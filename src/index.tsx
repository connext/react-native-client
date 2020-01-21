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
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-community/async-storage';
import * as connext from '@connext/client';

import Info from './components/Info';

import { ChannelWallet, copyToClipboard, styles } from './helpers';

const App = () => {
  const [channelWallet] = useState(new ChannelWallet());
  const [channel, setChannel] = useState(undefined as any);

  const ethProviderUrl =
    'https://rinkeby.indra.connext.network/api/ethprovider';

  useEffect(() => {
    const startConnext = async () => {
      console.log('starting connext...');
      console.log('store init-d, testing provider');
      const provider = new ethers.providers.JsonRpcProvider(ethProviderUrl);
      const network = (await provider.getNetwork()).name;
      console.log(`got network: ${network}. testing connect...`);
      const xpub = channelWallet.xpub;
      const keyGen = (index: string) => channelWallet.keyGen(index);
      const chan: any = await connext.connect(network, {
        xpub,
        keyGen,
        asyncStorage: AsyncStorage,
      });
      console.log('channel connected!');

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
