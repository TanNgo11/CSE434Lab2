/**
 * Sample React Native App with Bottom Tab Navigation
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import BatteryScreen from './BatteryScreen';
import BrightnessScreen from './BrightnessScreen';

const Tab = createBottomTabNavigator();

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
    </Tab.Navigator>
  );
};

const App = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default App;
