import { Buffer } from 'buffer';
import * as eccrypto from 'eccrypto';

export async function testEccrypto() {
  const privateKey = eccrypto.generatePrivate();
  console.log('[testEccrypto]', 'privateKey', privateKey.toString());
  const publicKey = eccrypto.getPublic(privateKey);
  console.log('[testEccrypto]', 'publicKey', publicKey.toString());

  const message = 'testing eccrypto';
  console.log('[testEccrypto]', 'message', message);

  const encrypted = await eccrypto.encrypt(publicKey, Buffer.from(message));
  console.log('[testEccrypto]', 'encrypted', JSON.stringify(encrypted));

  const decrypted = await eccrypto.decrypt(privateKey, encrypted);
  console.log('[testEccrypto]', 'decrypted', decrypted.toString());
}