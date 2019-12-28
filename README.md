# Connext React Native

This is a typescript and react native implementation of Connext, please fork this code to get started with using Connext!

## Getting Started

### Prerequisites

This project was created using the Getting Started react native guide. Follow the instructions [here](http://facebook.github.io/react-native/docs/getting-started) to find and install the prerequisites for your system.

### Running the app

To run the app:

```bash
# in the root directory
npm install
# if you are developing for ios
npm run ios
# if you are developing for android
npm run android
```

### Important notes

The Connext-specific bits are in `index.js`, `post-install.sh`, and `store.js`.

- `store.js` contains an `AsyncStorage` based implementation of a Connext compatible key-value store

- `index.js` uses the [isomorphic-webcrypto](https://github.com/kevlened/isomorphic-webcrypto) library to ensure secure cryptographic functions in react native implementations.

- `post-install.sh` performs some connext (and related dependencies) specific adjustments to ensure the project builds successfully
