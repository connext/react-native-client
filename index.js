/**
 * @format
 */
// Import the required shims
import 'ethers/dist/shims.js';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
