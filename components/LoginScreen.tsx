import React, {useState} from 'react';
import {Alert, Button, Text, TextInput, View, StyleSheet} from 'react-native';
import {signInWithEmail, signInWithGoogle} from '../config/firebase.config';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#007AFF" />
        <View style={styles.buttonSpacer} />
        <Button
          title="Register"
          onPress={() => navigation.navigate('SignUp')}
          color="#34C759"
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Sign in with Google"
          onPress={handleGoogleSignIn}
          color="#FF9500"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonSpacer: {
    height: 15,
  },
});

export default LoginScreen;
