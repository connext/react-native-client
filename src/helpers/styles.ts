import { StyleSheet } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
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
