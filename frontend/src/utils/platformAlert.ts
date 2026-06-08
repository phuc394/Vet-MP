import { Alert, AlertButton, AlertOptions, Platform } from 'react-native';

const getMessage = (title: string, message?: string) => (message ? `${title}\n\n${message}` : title);

export const showPlatformAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: AlertOptions
) => {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons, options);
    return;
  }

  const confirmed = window.confirm(getMessage(title, message));
  const cancelButton = buttons?.find((button) => button.style === 'cancel');
  const actionButton = buttons?.filter((button) => button.style !== 'cancel').at(-1);

  if (confirmed) {
    actionButton?.onPress?.();
    return;
  }

  cancelButton?.onPress?.();
};
