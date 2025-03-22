/**
 * Sample React Native App with Bottom Tab Navigation
 */

import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import BatteryScreen from './BatteryScreen';
import BrightnessScreen from './BrightnessScreen';
import NoteScreen from './NoteScreen';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createChannel,
  registerDeviceToken,
  requestUserPermission,
  setupNotificationListener,
} from './NotificationHook';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignUpScreen';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}>
      <Tab.Screen name="Brightness" component={BrightnessScreen} />
      <Tab.Screen name="Battery" component={BatteryScreen} />
      <Tab.Screen name="Note" component={NoteScreen} />
    </Tab.Navigator>
  );
};

const App = (): React.JSX.Element => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        await AsyncStorage.setItem('userId', user.uid);
        setUser(user);
      } else {
        await AsyncStorage.removeItem('userId');
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      requestUserPermission();
      registerDeviceToken();
      createChannel();
      setupNotificationListener();
    }
  }, [user]);
  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
        </Stack.Navigator>
      ) : (
        <TabNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;
