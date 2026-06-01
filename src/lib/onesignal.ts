import OneSignal from 'react-onesignal';

const ONESIGNAL_APP_ID = '1cd87ca6-d3bb-45d8-923f-6b1e6f9b7c54';

export const initializeOneSignal = async (): Promise<void> => {
  try {
    // Only initialize in production or if explicitly enabled
    if (import.meta.env.PROD) {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        notifyButton: {
          enable: false,
          prenotify: false,
          showCredit: false,
          text: {
            'tip.state.unsubscribed': 'Subscribe to notifications',
            'tip.state.subscribed': 'You\'re subscribed to notifications',
            'tip.state.blocked': 'You\'ve blocked notifications',
            'message.prenotify': 'Click to subscribe to notifications',
            'message.action.subscribing': 'Subscribing...',
            'message.action.subscribed': 'Thanks for subscribing!',
            'message.action.resubscribed': 'You\'re subscribed to notifications',
            'message.action.unsubscribed': 'You won\'t receive notifications again',
            'dialog.main.title': 'Manage Site Notifications',
            'dialog.main.button.subscribe': 'Subscribe',
            'dialog.main.button.unsubscribe': 'Unsubscribe',
            'dialog.blocked.title': 'Unblock Notifications',
            'dialog.blocked.message': 'Follow these instructions to allow notifications:',
          },
        },
        allowLocalhostAsSecureOrigin: false,
      });
      console.log('OneSignal initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize OneSignal:', error);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const permission = await OneSignal.Notifications.requestPermission();
    if (typeof permission === 'boolean') {
      return permission;
    }
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

export const getNotificationPermission = async (): Promise<string> => {
  try {
    const permission = await OneSignal.Notifications.permission;
    if (typeof permission === 'string') {
      return permission;
    }
    return permission ? 'granted' : 'default';
  } catch (error) {
    console.error('Failed to get notification permission:', error);
    return 'default';
  }
};

export const isSubscribed = async (): Promise<boolean> => {
  try {
    const isPushSupported = await OneSignal.Notifications.isPushSupported();
    if (!isPushSupported) return false;

    const permission = await OneSignal.Notifications.permission;
    if (typeof permission === 'boolean') {
      return permission;
    }
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to check subscription status:', error);
    return false;
  }
};

export const getSubscriptionState = async (): Promise<{
  isSubscribed: boolean;
  isPushSupported: boolean;
  permission: string;
}> => {
  try {
    const isPushSupported = await OneSignal.Notifications.isPushSupported();
    const permission = await OneSignal.Notifications.permission;
    let permissionString: string;

    if (typeof permission === 'string') {
      permissionString = permission;
    } else {
      permissionString = permission ? 'granted' : 'default';
    }

    const isSubscribed = typeof permission === 'boolean' ? permission : permission === 'granted';

    return {
      isSubscribed,
      isPushSupported,
      permission: permissionString,
    };
  } catch (error) {
    console.error('Failed to get subscription state:', error);
    return {
      isSubscribed: false,
      isPushSupported: false,
      permission: 'default',
    };
  }
};
