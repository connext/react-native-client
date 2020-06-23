#!/bin/bash
echo "PostInstall script:"

echo "1. Nodeify react-native"
node_modules/.bin/rn-nodeify --install --hack

echo "2. Patch node modules"
npx patch-package

echo "3. Remove TCPSocket logs"
TARGET="node_modules/react-native-tcp/TcpSocket.js"
sed -i'' -e 's/console.log.apply(console, args);//' $TARGET;

# Only install ios stuff if we're on an apple OS
if [[ "`uname`" == "Darwin" ]]
then 
  echo "4. Install pod modules"
  cd ios 
  pod install
fi

