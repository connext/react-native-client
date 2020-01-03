#!/bin/bash
echo "PostInstall script:"

echo "0. React Native nodeify..."
node_modules/.bin/rn-nodeify --install --hack

# The build output from aes-js breaks the metro bundler. Until we safely upgrade
# to a new version of aes-js, we patch it by removing the erroneous line.
echo "1. Fix aes-js build ouput..."
AES_OUTPUT_FILE="node_modules/aes-js/index.js";
sed -i'' -e 's/var previous_mymodule = root.mymodule;//g' $AES_OUTPUT_FILE;

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
