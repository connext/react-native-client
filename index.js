/**
 * @format
 */
// Import the required shims
import 'ethers/dist/shims.js';

const isomorphicCrypto = require('isomorphic-webcrypto');
import { AppRegistry } from 'react-native';
import App from './src';
import { name } from './app.json';

async function secureRandomValuesBeforeInit() {
  if (!__DEV__) {
    await isomorphicCrypto.ensureSecure();
    const array = new Uint8Array(1);
    isomorphicCrypto.getRandomValues(array);
  }

  /**
   * Application entry point responsible for registering root component
   */
  AppRegistry.registerComponent(name, () => App);
}

secureRandomValuesBeforeInit();
