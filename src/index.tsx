import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as connext from '@connext/client';

import Info from './components/Info';

import {
  ChannelWallet,
  copyToClipboard,
  decryptWithPrivateKey,
  styles,
  encryptWithPublicKey,
} from './helpers';

import * as EthCrypto from './helpers/ethCrypto';

const NETWORK = 'rinkeby';

let shouldTestCrypto = true;
const useEthCrypto = true;

const encrypt = useEthCrypto ? EthCrypto.encrypt : encryptWithPublicKey;
const decrypt = useEthCrypto ? EthCrypto.decrypt : decryptWithPrivateKey;

async function testCrypto(channelWallet: ChannelWallet) {
  const message = JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
  });
  console.log('[testCrypto]', 'message', message);

  const publicKey = channelWallet.publicKey;
  console.log('[testCrypto]', 'publicKey', publicKey);

  const encrypted = await encrypt(publicKey, message);
  console.log('[testCrypto]', 'encrypted', encrypted);

  const privateKey = channelWallet.privateKey;
  console.log('[testCrypto]', 'privateKey', privateKey);

  const decrypted = await decrypt(privateKey, encrypted);
  console.log('[testCrypto]', 'decrypted', JSON.parse(decrypted));
}

function createChannelWallet() {
  const channelWallet = new ChannelWallet();
  if (shouldTestCrypto) {
    testCrypto(channelWallet);
    shouldTestCrypto = false;
  }
  return channelWallet;
}

const App = () => {
  const [channelWallet] = useState(createChannelWallet());
  const [channel, setChannel] = useState(undefined as any);

  useEffect(() => {
    const startConnext = async () => {
      console.log(`Starting Connext on ${NETWORK}...`);

      const xpub = channelWallet.xpub;
      const keyGen = (index: string) => channelWallet.keyGen(index);

      const chan: any = await connext.connect(NETWORK, {
        xpub,
        keyGen,
        asyncStorage: AsyncStorage,
      });

      console.log('Channel connected!');

      setChannel(chan);
    };
    startConnext();
  }, [channelWallet]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{'Hello, Connext!'}</Text>
              <View style={styles.sectionDescription}>
                <Text style={styles.baseFont}>
                  {'Your randomly generated mnemonic is:'}
                </Text>
                <Text
                  style={styles.highlight}
                  onPress={() =>
                    copyToClipboard(
                      channelWallet.mnemonic,
                      'Copied mnemonic to clipboard',
                    )
                  }>
                  {channelWallet.mnemonic}
                </Text>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{'Channel Information'}</Text>
              {channel ? (
                <View>
                  <Info label={'Network'} data={'Rinkeby'} numberOfLines={1} />
                  <Info
                    label={'Public Identifier'}
                    data={channel.publicIdentifier}
                    numberOfLines={3}
                  />
                  <Info
                    label={'Multisig Address'}
                    data={channel.multisigAddress}
                    numberOfLines={1}
                  />
                  <Info
                    label={'Free Balance Address'}
                    data={channel.freeBalanceAddress}
                    numberOfLines={1}
                  />
                </View>
              ) : (
                <Text style={styles.sectionDescription}>
                  {'Still loading channel...'}
                </Text>
              )}
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <View style={styles.sectionFooter}>
                <TouchableHighlight
                  onPress={() =>
                    Linking.openURL('https://docs.connext.network')
                  }>
                  <Text style={styles.sectionDescription}>
                    Read the <Text style={styles.highlight}>docs</Text> to
                    discover what to do next!
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
