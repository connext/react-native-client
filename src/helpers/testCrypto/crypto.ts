import { Buffer } from 'buffer';
import * as eccrypto from 'eccrypto';
// @ts-ignore
import { publicKeyConvert } from 'secp256k1';

// type Encrypted = {
//   ciphertext: string;
//   ephemPublicKey: string;
//   iv: string;
//   mac: string;
// };

const removeTrailing0x = (data: string) => data.replace(/^0x/, '');

const addTrailing04 = (data: string) => `04${data}`;

const sanitizePubKey = (pubKey: string): string =>
  addTrailing04(decompress(pubKey));

const compress = (pubKey: string): string => {
  console.log('[compress]', 'pubKey', pubKey); // tslint:disable-line

  const publicKey = removeTrailing0x(pubKey);

  const startsWith04 =
    Buffer.from(publicKey, 'hex').length === 64
      ? addTrailing04(publicKey)
      : publicKey;
  console.log('[compress]', 'startsWith04', startsWith04); // tslint:disable-line

  const compressed = publicKeyConvert(
    Buffer.from(startsWith04, 'hex'),
    true,
  ).toString('hex');
  console.log('[compress]', 'compressed', compressed); // tslint:disable-line

  return compressed;
};

const decompress = (pubKey: string): string => {
  console.log('[decompress]', 'pubKey', pubKey); // tslint:disable-line

  const prefixed =
    Buffer.from(pubKey, 'hex').length === 64 ? addTrailing04(pubKey) : pubKey;
  console.log('[decompress]', 'prefixed', prefixed); // tslint:disable-line

  const decompressed = publicKeyConvert(
    Buffer.from(removeTrailing0x(prefixed), 'hex'),
    false,
  )
    .toString('hex')
    .substring(2);
  console.log('[decompress]', 'decompressed', decompressed); // tslint:disable-line

  return decompressed;
};

export const encryptWithPublicKey = async (
  publicKey: string,
  message: string,
): Promise<string> => {
  console.log('[encryptWithPublicKey]', 'publicKey', publicKey); // tslint:disable-line

  console.log('[encryptWithPublicKey]', 'message', message); // tslint:disable-line

  const key = sanitizePubKey(publicKey);
  console.log('[encryptWithPublicKey]', 'key', key); // tslint:disable-line

  const encryptedBuffers = await eccrypto.encrypt(
    Buffer.from(key, 'hex'),
    Buffer.from(message),
  );
  console.log('[encryptWithPublicKey]', 'encryptedBuffers', encryptedBuffers); // tslint:disable-line

  const ciphertext = encryptedBuffers.ciphertext.toString('hex');
  console.log('[encryptWithPublicKey]', 'ciphertext', ciphertext); // tslint:disable-line

  const ephemPublicKey = encryptedBuffers.ephemPublicKey.toString('hex');
  console.log('[encryptWithPublicKey]', 'ephemPublicKey', ephemPublicKey); // tslint:disable-line

  const iv = encryptedBuffers.iv.toString('hex');
  console.log('[encryptWithPublicKey]', 'iv', iv); // tslint:disable-line

  const mac = encryptedBuffers.mac.toString('hex');
  console.log('[encryptWithPublicKey]', 'mac', mac); // tslint:disable-line

  const encryptedString = Buffer.concat([
    Buffer.from(iv, 'hex'), // 16bit
    Buffer.from(compress(ephemPublicKey), 'hex'), // 33bit
    Buffer.from(mac, 'hex'), // 32bit
    Buffer.from(ciphertext, 'hex'), // var bit
  ]).toString('hex');
  console.log('[encryptWithPublicKey]', 'encryptedString', encryptedString); // tslint:disable-line

  return encryptedString;
};

export const decryptWithPrivateKey = async (
  privateKey: string,
  message: string,
): Promise<string> => {
  console.log('[decryptWithPrivateKey]', 'privateKey', privateKey); // tslint:disable-line

  console.log('[decryptWithPrivateKey]', 'message', message); // tslint:disable-line

  const buf = Buffer.from(message, 'hex');
  console.log('[decryptWithPrivateKey]', 'buf.length', buf.length); // tslint:disable-line

  const ciphertext = buf.toString('hex', 81, buf.length);
  console.log('[decryptWithPrivateKey]', 'ciphertext', ciphertext); // tslint:disable-line

  const publicKey = buf.toString('hex', 16, 49);
  console.log('[decryptWithPrivateKey]', 'publicKey', publicKey); // tslint:disable-line

  const ephemPublicKey = sanitizePubKey(publicKey);
  console.log('[decryptWithPrivateKey]', 'ephemPublicKey', ephemPublicKey); // tslint:disable-line

  const iv = buf.toString('hex', 0, 16);
  console.log('[decryptWithPrivateKey]', 'iv', iv); // tslint:disable-line

  const mac = buf.toString('hex', 49, 81);
  console.log('[decryptWithPrivateKey]', 'mac', mac); // tslint:disable-line

  const decryptedBuffer = await eccrypto.decrypt(
    Buffer.from(removeTrailing0x(privateKey), 'hex'),
    {
      ciphertext: Buffer.from(ciphertext, 'hex'),
      ephemPublicKey: Buffer.from(ephemPublicKey, 'hex'),
      iv: Buffer.from(iv, 'hex'),
      mac: Buffer.from(mac, 'hex'),
    },
  );
  console.log('[decryptWithPrivateKey]', 'decryptedBuffer', decryptedBuffer); // tslint:disable-line

  const decryptedString = decryptedBuffer.toString();
  console.log('[decryptWithPrivateKey]', 'decryptedString', decryptedString); // tslint:disable-line

  return decryptedString;
};
