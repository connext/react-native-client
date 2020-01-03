/**
 * @format
 */
// Import the required shims
import 'ethers/dist/shims.js';

// Fix crypto fns for react native
// import crypto from 'crypto';
// require('react-native-browser-polyfill');
// const isomorphicCrypto = require('isomorphic-webcrypto');

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// // secure all random values before initing the app, see:
// // https://github.com/kevlened/isomorphic-webcrypto
// (async () => {
//   // Only needed for crypto.getRandomValues
//   // but only wait once, future calls are secure
//   await isomorphicCrypto.ensureSecure();
//   const array = new Uint8Array(1);
//   // @ts-ignore
//   isomorphicCrypto.getRandomValues(array);
// })();

AppRegistry.registerComponent(appName, () => App);
