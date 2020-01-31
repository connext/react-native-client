import { Buffer } from 'buffer';
import { decrypt, encrypt } from 'eccrypto';
import { publicKeyConvert } from 'secp256k1';

type Encrypted = {
  ciphertext: string;
  ephemPublicKey: string;
  iv: string;
  mac: string;
};

const compress = (pubKey: string): string => {
  // console.log('[compress]', 'pubKey', pubKey);

  const startsWith04 =
    Buffer.from(pubKey.replace(/^0x/, ''), 'hex').length === 64
      ? `04${pubKey.replace(/^0x/, '')}`
      : pubKey.replace(/^0x/, '');
  // console.log('[compress]', 'startsWith04', startsWith04);

  const compressed = publicKeyConvert(
    Buffer.from(startsWith04, 'hex'),
    true,
  ).toString('hex');
  // console.log('[compress]', 'compressed', compressed);

  return compressed;
};

const decompress = (pubKey: string): string => {
  // console.log('[decompress]', 'pubKey', pubKey);

  const prefixed =
    Buffer.from(pubKey, 'hex').length === 64 ? `04${pubKey}` : pubKey;
  // console.log('[decompress]', 'prefixed', prefixed);

  const decompressed = publicKeyConvert(
    Buffer.from(prefixed.replace(/^0x/, ''), 'hex'),
    false,
  )
    .toString('hex')
    .substring(2);
  // console.log('[decompress]', 'decompressed', decompressed);

  return decompressed;
};

const sanitizePubKey = (pubKey: string): string => `04${decompress(pubKey)}`;

export const encryptWithPublicKey = async (
  publicKey: string,
  message: string,
): Promise<string> => {
  // console.log('[encryptWithPublicKey]', 'publicKey', publicKey);

  // console.log('[encryptWithPublicKey]', 'message', message);

  const key = sanitizePubKey(publicKey);
  // console.log('[encryptWithPublicKey]', 'key', key);

  const encryptedBuffers = await encrypt(
    Buffer.from(key, 'hex'),
    Buffer.from(message),
  );
  // console.log('[encryptWithPublicKey]', 'encryptedBuffers', encryptedBuffers);

  const ciphertext = encryptedBuffers.ciphertext.toString('hex');
  // console.log('[encryptWithPublicKey]', 'ciphertext', ciphertext);

  const ephemPublicKey = encryptedBuffers.ephemPublicKey.toString('hex');
  // console.log('[encryptWithPublicKey]', 'ephemPublicKey', ephemPublicKey);

  const iv = encryptedBuffers.iv.toString('hex');
  // console.log('[encryptWithPublicKey]', 'iv', iv);

  const mac = encryptedBuffers.mac.toString('hex');
  // console.log('[encryptWithPublicKey]', 'mac', mac);

  const encryptedString = Buffer.concat([
    Buffer.from(iv, 'hex'), // 16bit
    Buffer.from(compress(ephemPublicKey), 'hex'), // 33bit
    Buffer.from(mac, 'hex'), // 32bit
    Buffer.from(ciphertext, 'hex'), // var bit
  ]).toString('hex');
  // console.log('[encryptWithPublicKey]', 'encryptedString', encryptedString);

  return encryptedString;
};

export const decryptWithPrivateKey = async (
  privateKey: string,
  message: string,
): Promise<string> => {
  // console.log('[decryptWithPrivateKey]', 'privateKey', privateKey);

  // console.log('[decryptWithPrivateKey]', 'message', message);

  const buf = Buffer.from(message, 'hex');
  // console.log('[decryptWithPrivateKey]', 'buf.length', buf.length);

  const ciphertext = buf.toString('hex', 81, buf.length);
  // console.log('[decryptWithPrivateKey]', 'ciphertext', ciphertext);

  const publicKey = buf.toString('hex', 16, 49);
  // console.log('[decryptWithPrivateKey]', 'publicKey', publicKey);

  const ephemPublicKey = sanitizePubKey(publicKey);
  // console.log('[decryptWithPrivateKey]', 'ephemPublicKey', ephemPublicKey);

  const iv = buf.toString('hex', 0, 16);
  // console.log('[decryptWithPrivateKey]', 'iv', iv);

  const mac = buf.toString('hex', 49, 81);
  // console.log('[decryptWithPrivateKey]', 'mac', mac);

  const decryptedBuffer = await decrypt(
    Buffer.from(privateKey.replace(/^0x/, ''), 'hex'),
    {
      ciphertext: Buffer.from(ciphertext, 'hex'),
      ephemPublicKey: Buffer.from(ephemPublicKey, 'hex'),
      iv: Buffer.from(iv, 'hex'),
      mac: Buffer.from(mac, 'hex'),
    },
  );
  // console.log('[decryptWithPrivateKey]', 'decryptedBuffer', decryptedBuffer);

  const decryptedString = decryptedBuffer.toString();
  // console.log('[decryptWithPrivateKey]', 'decryptedString', decryptedString);

  return decryptedString;
};
