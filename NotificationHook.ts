/* eslint-disable @typescript-eslint/no-unused-vars */
import notifee, {EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {getCurrentUser} from './config/firebase.config';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');
    await getToken();
  } else {
    console.log('Notification permission denied.');
  }
}

export async function getToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    await AsyncStorage.setItem('deviceId', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export const setupNotificationListener = async () => {
  try {
    const myDeviceToken = await AsyncStorage.getItem('myDeviceToken');
    if (!myDeviceToken) {
      console.log('🚫 No device token found.');
      return;
    }

    console.log('📡 Listening for notifications...', myDeviceToken);

    const lastTimestamp = await AsyncStorage.getItem(
      'lastNotificationTimestamp',
    );
    const user = getCurrentUser();
    let query = firestore()
      .collection('users')
      .doc(user?.uid)
      .collection('pendingNotifications')
      .where('targetDevice', '==', myDeviceToken)
      .orderBy('timestamp', 'desc');

    if (lastTimestamp) {
      const date = new Date(parseInt(lastTimestamp, 10));
      query = query.where('timestamp', '>', date);
    }

    return query.onSnapshot(async snapshot => {
      console.log(`🔍 Firestore detected ${snapshot.docs.length} documents`);

      for (const change of snapshot.docChanges()) {
        if (change.type === 'added') {
          const notification = change.doc.data();
          console.log('📩 New notification received:', notification);

          if (!notification.timestamp) {
            console.log('⚠️ Notification has no timestamp, skipping');
            continue;
          }

          const notificationTime = notification.timestamp.toDate().getTime();
          const lastProcessedTime = lastTimestamp
            ? parseInt(lastTimestamp, 10)
            : 0;

          console.log(
            '🚀 ~ setupNotificationListener ~ notificationTime > lastProcessedTime:',
            notificationTime > lastProcessedTime,
          );
          if (notificationTime > lastProcessedTime) {
            await notifee.displayNotification({
              title: notification.title,
              body: notification.body,
              data: {noteId: notification.noteId, type: 'NEW_NOTE'},
              android: {
                channelId: 'notes_channel',
                pressAction: {id: 'default'},
              },
            });

            await AsyncStorage.setItem(
              'lastNotificationTimestamp',
              notificationTime.toString(),
            );
          } else {
            console.log('⚠️ Skipping old notification:', notification);
          }
        }
      }
    });
  } catch (error) {
    console.error('❌ Error setting up notification listener:', error);
    return null;
  }
};

export const registerDeviceToken = async () => {
  try {
    const token = await messaging().getToken();

    if (token) {
      console.log('✅ Registering device token:', token);

      await firestore().collection('deviceTokens').doc(token).set(
        {
          token,
          timestamp: firestore.FieldValue.serverTimestamp(),
        },
        {merge: true},
      );

      await AsyncStorage.setItem('myDeviceToken', token);
    } else {
      console.log('❌ No FCM token received');
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
  }
};

export const createChannel = async () => {
  const channel = await notifee.createChannel({
    id: 'notes_channel',
    name: 'Notes Notifications',
    lights: false,
    vibration: true,
    importance: 4,
  });
  console.log('✅ Channel created:', channel);
  return channel;
};
