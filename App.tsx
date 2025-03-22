import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import TabNavigator from './TabNavigator';
import notifee, {EventType} from '@notifee/react-native';

function App(): React.JSX.Element {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground notification received:', remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Note',
        body: remoteMessage.notification?.body || 'A new note was added',
        data: remoteMessage.data,
        android: {
          channelId: 'notes_channel',
          pressAction: {id: 'default'},
        },
      });

      // if (remoteMessage?.data?.noteId && navigationRef.current) {
      //   navigationRef.current.navigate('NotesList');
      // }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        console.log('🔔 Notification clicked:', detail.notification);

        // if (navigationRef.current) {
        //   navigationRef.current.navigate('NotesList');
        // }
      }
    });

    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        console.log(
          '🔔 Notification clicked in background:',
          detail.notification,
        );
      }
    });

    const checkInitialNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {
        console.log('🔔 App opened by notification', initialNotification);
        setTimeout(() => {
          // if (navigationRef.current) {
          //   navigationRef.current.navigate('NotesList');
          // }
        }, 500);
      }
    };

    checkInitialNotification();

    return unsubscribe;
  }, []);

  return <TabNavigator />;
}

export default App;
