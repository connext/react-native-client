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
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { ethers as eth } from 'ethers';

import * as connext from '@connext/client';
import Store from './store.js';

declare var global: { HermesInternal: null | {} };

const App = () => {
  const [mnemonic] = useState(eth.Wallet.createRandom().mnemonic);
  const [channel, setChannel] = useState(undefined as any);
  // const [ethProvider, setEthProvider] = useState(undefined as any);

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
      const chan: any = await connext.connect({
        mnemonic,
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
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Hello, Connext!</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.tsx</Text> to change
                this screen and then come back to see your edits.
              </Text>
              <Text style={styles.sectionDescription}>
                Your randomly generated mnemonic is:{'\n'}
                <Text style={styles.highlight}>{mnemonic}</Text>
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Channel Information</Text>
              <Text style={styles.sectionDescription}>
                {channel
                  ? `Public Identifier:${
                      channel.publicIdentifier
                    }\nMultisig address: ${
                      channel.multisigAddress
                    }\nFree balance address: ${channel.freeBalanceAddress}`
                  : 'Still loading channel.'}
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default App;
