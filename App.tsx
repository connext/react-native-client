/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  Alert,
  Clipboard,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Linking,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { ethers as eth } from 'ethers';

import * as connext from '@connext/client';
import { CF_PATH } from '@connext/types';
import Store from './store.js';
import { fromExtendedKey, fromMnemonic } from 'ethers/utils/hdnode';

function copyToClipboard(
  data: string,
  message: string,
  title: string = 'Copied',
) {
  Clipboard.setString(data);
  Alert.alert(title, message);
}

const ChannelDetail = ({ label, data, numberOfLines }: any) => (
  <>
    <Text style={styles.label}>{`${label}`}</Text>
    <Text
      style={styles.baseFont}
      adjustsFontSizeToFit
      numberOfLines={numberOfLines}
      onPress={() => copyToClipboard(data, `Copied ${label} to clipboard`)}>
      {data}
    </Text>
  </>
);

const App = () => {
  const [mnemonic] = useState(eth.Wallet.createRandom().mnemonic);
  const [channel, setChannel] = useState(undefined as any);

  const ethProviderUrl =
    'https://rinkeby.indra.connext.network/api/ethprovider';

  useEffect(() => {
    const startConnext = async () => {
      console.log('starting connext...');
      const store: any = await Store.init();
      console.log('store init-d, testing provider');
      const provider = new eth.providers.JsonRpcProvider(ethProviderUrl);
      const network = await provider.getNetwork();
      console.log(`got network id: ${network.chainId}. testing connect...`);
      const hdNode = fromExtendedKey(
        fromMnemonic(mnemonic).extendedKey,
      ).derivePath(CF_PATH);
      const xpub = hdNode.neuter().extendedKey;
      const keyGen = (index: string) => {
        const res = hdNode.derivePath(index);
        return Promise.resolve(res.privateKey);
      };
      const chan: any = await connext.connect({
        xpub,
        keyGen,
        nodeUrl: 'wss://rinkeby.indra.connext.network/api/messaging',
        ethProviderUrl,
        store,
      });
      console.log('channel connected!');
      setChannel(chan);
    };
    startConnext();
  }, [mnemonic]);

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
                    copyToClipboard(mnemonic, 'Copied mnemonic to clipboard')
                  }>
                  {mnemonic}
                </Text>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{'Channel Information'}</Text>
              {channel ? (
                <View>
                  <ChannelDetail
                    label={'Network'}
                    data={'Rinkeby'}
                    numberOfLines={1}
                  />
                  <ChannelDetail
                    label={'Public Identifier'}
                    data={channel.publicIdentifier}
                    numberOfLines={3}
                  />
                  <ChannelDetail
                    label={'Multisig Address'}
                    data={channel.multisigAddress}
                    numberOfLines={1}
                  />
                  <ChannelDetail
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

const styles = StyleSheet.create({
  baseFont: {
    fontSize: 18,
    fontWeight: '400',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  sectionFooter: {
    marginBottom: 32,
  },
});

export default App;
