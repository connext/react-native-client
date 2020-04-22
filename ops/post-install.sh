#!/bin/bash
echo "PostInstall script:"

echo "1. React Native nodeify..."
node_modules/.bin/rn-nodeify --install --hack

echo "2. Fix xmlhttprequest"
TARGET="node_modules/xmlhttprequest/lib/XMLHttpRequest.js"
sed -i'' -e 's/var spawn /\/\/var spawn/' $TARGET;
sed -i'' -e 's/response = resp;/if (typeof resp === "undefined") return; response = resp;/' $TARGET;

echo "3. Remove TCPSocket logs"
TARGET="node_modules/react-native-tcp/TcpSocket.js"
sed -i'' -e 's/console.log.apply(console, args);//' $TARGET;
