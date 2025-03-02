import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
const NoteItem = ({note}: {note: any}) => {
  const deleteNote = async () => {
    try {
      await firestore().collection('notes').doc(note?.id).delete();
      console.log('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note: ', error);
    }
  };

  return (
    <View style={styles.noteContainer}>
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle}>{note?.title}</Text>
        <Text style={styles.noteText}>{note?.content}</Text>
        <Text style={styles.noteDate}>
          {new Date(note?.createdAt?.toDate())?.toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity onPress={deleteNote} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    flexDirection: 'row',
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    borderRadius: 5,
    padding: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NoteItem;
