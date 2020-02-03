import {
  decryptWithPrivateKey,
  // encryptWithPublicKey,
} from './crypto';

import * as EthCrypto from './ethCrypto';

const isomorphicCrypto = require('isomorphic-webcrypto');

const useEthCrypto = false;

// const encrypt = useEthCrypto ? EthCrypto.encrypt : encryptWithPublicKey;
const decrypt = useEthCrypto ? EthCrypto.decrypt : decryptWithPrivateKey;

export async function testCrypto(publicKey: string, privateKey: string) {
  await isomorphicCrypto.ensureSecure();

  console.log('[testCrypto]', 'useEthCrypto', useEthCrypto); // tslint:disable-line
  const message = JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
  });
  console.log('[testCrypto]', 'message', message); // tslint:disable-line
  publicKey =
    '0x044acab90f34d21996961b2e876ba7795e18f75c1569be11bfc281b2582a0cda1103e8854aed3337d09daa0cb939165a657ae2c7a7cd93b1844985ac90a191c537';
  console.log('[testCrypto]', 'publicKey', publicKey); // tslint:disable-line
  privateKey =
    '0xb8c8f82624f4f60f6cf40d94337800fd7e4aa2b075fdea0625e974004d021ca2';
  console.log('[testCrypto]', 'privateKey', privateKey); // tslint:disable-line

  // const encrypted = await encrypt(publicKey, message);
  const encrypted =
    '0961ff9d62b9a096424795099189523d03399ebf3a1bd22424a1b1cb293f69ed33a08d956a731bad441e7a96eb2f0c2dd005ae9dbaffa0a8ccb04dc6906fa8b58e66d3f8e86931720192bccdc59f43b4b22afbcd1a87e39ce0b50dfea1a3f0445fe059c816b9098b670e2f2f4e3ad721d2d7c78de347f562c2048480a094d96332bbeeb7d6066391dca14059d6ddf28ef5';
  console.log('[testCrypto]', 'encrypted', encrypted); // tslint:disable-line

  const decrypted = await decrypt(privateKey, encrypted);
  console.log('[testCrypto]', 'decrypted', JSON.parse(decrypted)); // tslint:disable-line
}
