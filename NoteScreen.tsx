import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AddNoteForm from './components/AddNoteForm';
import NoteItem from './components/NoteItem';
interface Note {
  id: string;
  [key: string]: any;
}
const NoteScreen = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const notesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setNotes(notesList);
          setLoading(false);
        },
        error => {
          console.error('Error fetching notes: ', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ecdc4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notes</Text>
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
