import { Buffer } from 'buffer';
import * as eccrypto from 'eccrypto';
import { publicKeyConvert } from 'secp256k1';

type Encrypted = {
  ciphertext: string;
  ephemPublicKey: string;
  iv: string;
  mac: string;
};

export function removeTrailing0x(str: string) {
  if (str.startsWith('0x')) {
    return str.substring(2);
  } else {
    return str;
  }
}

export function addTrailing0x(str: string) {
  if (!str.startsWith('0x')) {
    return '0x' + str;
  } else {
    return str;
  }
}

export function compress(startsWith04: string) {
  // add trailing 04 if not done before
  const testBuffer = Buffer.from(startsWith04, 'hex');
  if (testBuffer.length === 64) {
    startsWith04 = '04' + startsWith04;
  }

  return publicKeyConvert(Buffer.from(startsWith04, 'hex'), true).toString(
    'hex',
  );
}

export function decompress(startsWith02Or03: string) {
  // if already decompressed an not has trailing 04
  const testBuffer = Buffer.from(startsWith02Or03, 'hex');
  if (testBuffer.length === 64) {
    startsWith02Or03 = '04' + startsWith02Or03;
  }

  let decompressed = publicKeyConvert(
    Buffer.from(startsWith02Or03, 'hex'),
    false,
  ).toString('hex');

  // remove trailing 04
  decompressed = decompressed.substring(2);
  return decompressed;
}

export function stringify(cipher: Encrypted) {
  if (typeof cipher === 'string') {
    return cipher;
  }

  // use compressed key because it's smaller
  const compressedKey = compress(cipher.ephemPublicKey);

  const ret = Buffer.concat([
    Buffer.from(cipher.iv, 'hex'), // 16bit
    Buffer.from(compressedKey, 'hex'), // 33bit
    Buffer.from(cipher.mac, 'hex'), // 32bit
    Buffer.from(cipher.ciphertext, 'hex'), // var bit
  ]);

  return ret.toString('hex');
}

export function parse(str: string) {
  if (typeof str !== 'string') {
    return str;
  }

  const buf = Buffer.from(str, 'hex');

  const ret = {
    iv: buf.toString('hex', 0, 16),
    ephemPublicKey: buf.toString('hex', 16, 49),
    mac: buf.toString('hex', 49, 81),
    ciphertext: buf.toString('hex', 81, buf.length),
  };

  // decompress publicKey
  ret.ephemPublicKey = '04' + decompress(ret.ephemPublicKey);

  return ret;
}

export function encryptWithPublicKey(publicKey: string, message: string) {
  // ensure its an uncompressed publicKey
  publicKey = decompress(publicKey);

  // re-add the compression-flag
  const pubString = '04' + publicKey;

  return eccrypto
    .encrypt(Buffer.from(pubString, 'hex'), Buffer.from(message))
    .then(encryptedBuffers => {
      const encrypted = {
        iv: encryptedBuffers.iv.toString('hex'),
        ephemPublicKey: encryptedBuffers.ephemPublicKey.toString('hex'),
        ciphertext: encryptedBuffers.ciphertext.toString('hex'),
        mac: encryptedBuffers.mac.toString('hex'),
      };
      return encrypted;
    });
}

export function decryptWithPrivateKey(
  privateKey: string,
  encrypted: Encrypted,
) {
  if (typeof encrypted === 'string') {
    encrypted = parse(encrypted);
  }

  // remove trailing '0x' from privateKey
  const twoStripped = removeTrailing0x(privateKey);

  const encryptedBuffer = {
    iv: Buffer.from(encrypted.iv, 'hex'),
    ephemPublicKey: Buffer.from(encrypted.ephemPublicKey, 'hex'),
    ciphertext: Buffer.from(encrypted.ciphertext, 'hex'),
    mac: Buffer.from(encrypted.mac, 'hex'),
  };

  return eccrypto
    .decrypt(Buffer.from(twoStripped, 'hex'), encryptedBuffer)
    .then(decryptedBuffer => decryptedBuffer.toString());
}

export async function encrypt(
  publicKey: string,
  message: string,
): Promise<string> {
  const encryptedCipher = await encryptWithPublicKey(
    publicKey.slice(2),
    message,
  );
  const encrypted = stringify(encryptedCipher);
  return encrypted;
}

export async function decrypt(
  privateKey: string,
  message: string,
): Promise<string> {
  const cipher = parse(message);
  const decrypted = await decryptWithPrivateKey(privateKey, cipher);
  return decrypted;
}
