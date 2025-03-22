import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import {Button, Divider, IconButton, Menu} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import AddNoteForm from './components/AddNoteForm';
import NoteItem from './components/NoteItem';
import {getCurrentUser, signOut} from './config/firebase.config';
interface Note {
  id: string;
  [key: string]: any;
}
const NoteScreen = ({navigation}: {navigation: any}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const currentUser = getCurrentUser();
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      return;
    }

    const subscriber = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('notes')
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        if (!querySnapshot || querySnapshot.empty) {
          console.log('No notes found.');
          setNotes([]);
          return;
        }
        const notesArray: Note[] = [];
        querySnapshot.forEach(documentSnapshot => {
          const note = {
            id: documentSnapshot.id,
            title: documentSnapshot.data().title,
            content: documentSnapshot.data().content,
            timestamp: documentSnapshot.data().timestamp,
          };
          notesArray.push(note);
        });
        console.log('Fetched notes:', notesArray);
        setNotes(notesArray);
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || '',
      );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.data?.type === 'NEW_NOTE') {
        navigation.navigate('NotesList');
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.type === 'NEW_NOTE' && navigation.isReady()) {
          navigation.navigate('NotesList');
        }
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <IconButton
            icon="note-plus"
            onPress={() => navigation.navigate('AddNote')}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }>
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                signOut();
              }}
              title="Logout"
              leadingIcon="logout"
            />
            <Divider />
          </Menu>
        </View>
      ),
    });
  }, [navigation, menuVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>My Notes from {currentUser?.email}</Text>
        <Button onPress={() => signOut()}>Sign Out</Button>
        <AddNoteForm />
        {notes.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No notes yet. Add one to get started!
          </Text>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={item => item?.id}
            renderItem={({item}) => <NoteItem note={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default NoteScreen;
