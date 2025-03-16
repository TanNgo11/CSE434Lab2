import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const AddNoteForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addNote = async () => {
    if (title.trim() === '' || content.trim() === '') {
      return;
    }
    const myDeviceToken = await AsyncStorage.getItem('myDeviceToken');

    try {
      await firestore().collection('notes').add({
        title,
        content,
        createdAt: firestore.FieldValue.serverTimestamp(),
        createdBy: myDeviceToken,
      });
      if (myDeviceToken) {
        const notificationRef = firestore()
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
    } catch (error) {
      console.error('Error adding note: ', error);
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
