#!/bin/bash
echo "PostInstall script:"

echo "1. React Native nodeify..."
node_modules/.bin/rn-nodeify --install --hack

echo "2. Fix xmlhttprequest"
TARGET="node_modules/xmlhttprequest/lib/XMLHttpRequest.js"
sed -i'' -e 's/var spawn /\/\/var spawn/' $TARGET;

echo "3. Connext v2 fixes"
TARGET="node_modules/websocket-nats/lib/nats.js"
# set default nats port
sed -i'' -e 's/this.url = url;/this.url = url;this.url.port = 4222;/' $TARGET;
# remove core-js/stable
TARGET="node_modules/@connext/client/dist/connext.js"
sed -i'' -e 's/require("core-js\/stable");//' $TARGET;
# remove TCPSocket logs
TARGET="node_modules/react-native-tcp/TcpSocket.js"
sed -i'' -e 's/console.log.apply(console, args);//' $TARGET;
# Fix crypto libs	
TARGET="node_modules/eccrypto/browser.js"	
sed -i'' -e 's/global.crypto || global.msCrypto || {};/require("isomorphic-webcrypto");/' $TARGET;
