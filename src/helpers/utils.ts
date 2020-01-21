import { Alert, Clipboard } from 'react-native';

export function copyToClipboard(
  data: string,
  message: string,
  title: string = 'Copied',
) {
  Clipboard.setString(data);
  Alert.alert(title, message);
}
