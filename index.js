/**
 * @format
 */
// Import the required shims
import './shim.js';

// Fix crypto fns for react native
// import crypto from 'crypto';
require('react-native-browser-polyfill');
// const isomorphicCrypto = require('isomorphic-webcrypto');

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

async function secureRandomValuesBeforeInit() {
  // await isomorphicCrypto.ensureSecure();
  // const array = new Uint8Array(1);
  // isomorphicCrypto.getRandomValues(array);

  /**
   * Application entry point responsible for registering root component
   */
  AppRegistry.registerComponent(appName, () => App);
}
secureRandomValuesBeforeInit();
