import React from 'react';
import { Text } from 'react-native';

import { copyToClipboard, styles } from '../helpers';

const Info = ({ label, data, numberOfLines }: any) => (
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

export default Info;
