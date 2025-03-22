// import firestore from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// const notesCollection = firestore().collection('notes');

// export {firestore, notesCollection};

GoogleSignin.configure({
  webClientId:
    '545255468888-t8a1kbb4juh8v7muceej3c4lkqv5qibt.apps.googleusercontent.com',
});

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const userId = userCredential.user.uid;

    console.log('✅ Logged in with UID:', userId);
    await AsyncStorage.setItem('userId', userId);
  } catch (error) {
    console.error('❌ Login Error:', error);
    Alert.alert('Error', 'Something is wrong');
  }
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    const signInResult = await GoogleSignin.signIn();

    let idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found in signInResult');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const userCredential = await auth().signInWithCredential(googleCredential);

    console.log('Signed in with Google:', userCredential.user);
    Alert.alert('Success', 'Signed in with Google!');

    // navigation.replace('MainTabs');
  } catch (error) {
    console.error('Google Sign-In Error:', error);
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

export const signOut = async () => {
  await auth().signOut();
};
export const getCurrentUser = () => {
  return auth().currentUser;
};
