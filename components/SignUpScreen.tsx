/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {signUpWithEmail} from '../config/firebase.config';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signUpWithEmail(email, password);

      if (displayName && userCredential?.user) {
        await userCredential.user.updateProfile({
          displayName: displayName,
        });
      }

      Alert.alert('Success', 'Account created successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert(
        'Error',
        error.message || 'There was a problem creating your account',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{alignItems: 'center', marginBottom: 20, paddingBottom: 30}}>
        <Text
          variant="displayMedium"
          style={{color: '#6d28d9', fontWeight: 'bold'}}>
          {' '}
          {/* Updated color */}
          Sign Up
        </Text>
      </View>

      <TextInput
        label="Display Name (Optional)"
        value={displayName}
        onChangeText={setDisplayName}
        mode="flat"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="flat"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="flat"
        secureTextEntry={!showPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="flat"
        secureTextEntry={!showConfirmPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
      />

      <Button
        mode="contained"
        onPress={handleSignUp}
        loading={loading}
        disabled={loading}>
        Sign Up
      </Button>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f3ff', // Light purple background
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#ffffff', // White input background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a78bfa', // Soft purple border
  },
  button: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#4c1d95', // Deep purple for title
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#7dd3fc', // Light blue divider
  },
  dividerText: {
    marginHorizontal: 20,
    color: '#0d9488', // Teal text
    fontSize: 16,
  },
});

export default SignupScreen;
