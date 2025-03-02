import firestore from '@react-native-firebase/firestore';

const notesCollection = firestore().collection('notes');

export {firestore, notesCollection};
