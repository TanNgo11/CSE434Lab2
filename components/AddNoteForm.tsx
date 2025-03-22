import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {getCurrentUser} from '../config/firebase.config';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddNoteForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and note cannot be empty');
      return;
    }
    const myDeviceToken = await AsyncStorage.getItem('myDeviceToken');
    try {
      const user = getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }
      if (myDeviceToken) {
        const noteRef = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('notes')
          .add({
            title,
            content: content || '',
            timestamp: firestore.FieldValue.serverTimestamp(),
            userId: user.uid,
          });

        console.log('✅ Note added with ID:', noteRef.id);

        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('pendingNotifications')
          .add({
            title: 'New Note Added!',
            body: `A new note titled "${title}" was added.`,
            noteId: noteRef.id,
            userId: user.uid,
            timestamp: firestore.FieldValue.serverTimestamp(),
          });
        const notificationRef = firestore()
          .collection('users')
          .doc(user.uid)
          .collection('pendingNotifications')
          .doc();

        await notificationRef.set({
          title: 'New Note Added!',
          body: `A new note titled "${title}" has been added.`,
          noteId: notificationRef.id,
          timestamp: firestore.FieldValue.serverTimestamp(),
          sourceDevice: myDeviceToken,
          targetDevice: myDeviceToken,
        });

        await notifee.displayNotification({
          title: 'New Note Added!',
          body: `A new note titled "${title}" has been added.`,
          data: {
            noteId: notificationRef.id,
            type: 'NEW_NOTE',
          },
          android: {
            channelId: 'notes_channel',
            pressAction: {id: 'default'},
          },
        });
      }

      setTitle('');
      setContent('');
      // navigation.navigate('NotesList');
    } catch (error) {
      console.error('❌ Error adding note:', error);
      Alert.alert('Error', 'Failed to add note. Please try again.');
    } finally {
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Note Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={addNote}>
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#4ecdc4',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddNoteForm;
