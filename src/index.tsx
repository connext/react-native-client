import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Linking,
  unstable_enableLogBox,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Wallet } from 'ethers';
import * as connext from '@connext/client';
import { ConnextStore } from '@connext/store';
import { StoreTypes } from '@connext/types';

import Info from './components/Info';

import { copyToClipboard, styles } from './helpers';

if (__DEV__) {
  unstable_enableLogBox();
}

const NETWORK = 'Rinkeby';

const App = () => {
  const [wallet] = useState(Wallet.createRandom());
  const [channel, setChannel] = useState(undefined as any);

  useEffect(() => {
    const startConnext = async () => {
      console.log(`Starting Connext on ${NETWORK}...`);
      const store = new ConnextStore(StoreTypes.AsyncStorage, {
        storage: AsyncStorage,
      });
      const signer = wallet.privateKey;
      const network = NETWORK.toLowerCase();
      const chan = await connext.connect(network, { signer, store });
      console.log('Channel connected!');

      setChannel(chan);
    };
    startConnext();
  }, [wallet]);

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
                  adjustsFontSizeToFit
                  numberOfLines={2}
                  onPress={() =>
                    copyToClipboard(
                      wallet.mnemonic,
                      'Copied mnemonic to clipboard',
                    )
                  }>
                  {wallet.mnemonic}
                </Text>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{'Channel Information'}</Text>
              {channel ? (
                <View>
                  <Info label={'Network'} data={NETWORK} numberOfLines={1} />
                  <Info
                    label={'Public Identifier'}
                    data={channel.publicIdentifier}
                    numberOfLines={2}
                  />
                  <Info
                    label={'Multisig Address'}
                    data={channel.multisigAddress}
                    numberOfLines={1}
                  />
                  <Info
                    label={'Signer Address'}
                    data={channel.signerAddress}
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
