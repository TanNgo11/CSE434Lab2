import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeModules} from 'react-native';

const {BatteryModule} = NativeModules;

const BatteryScreen = () => {
  const [batteryLevel, setBatteryLevel] = useState(null);

  useEffect(() => {
    BatteryModule.getBatteryPercentage()
      .then(level => setBatteryLevel(level))
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Battery</Text>
      <View style={styles.batteryContainer}>
        <Text style={styles.batteryText}>{batteryLevel ?? '--'}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  batteryContainer: {
    width: 200,
    height: 300,
    borderRadius: 15,
    backgroundColor: '#0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  batteryText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BatteryScreen;
