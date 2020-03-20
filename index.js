// Import the required shims
import 'ethers/dist/shims.js';
import './global.js';

import { AppRegistry } from 'react-native';
import App from './src';
import { name } from './app.json';

AppRegistry.registerComponent(name, () => App);
