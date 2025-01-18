import React, {useState} from 'react';
import {NativeModules, StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';

const {BrightnessModule} = NativeModules;

const BrightnessScreen = () => {
  const [brightness, setBrightness] = useState(0.5);

  const handleSliderChange = (value: number) => {
    setBrightness(value);
    BrightnessModule.setBrightness(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Brightness</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={brightness}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#2196F3"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#2196F3"
      />
      <Text style={styles.value}>{Math.round(brightness * 100)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  slider: {
    width: 300,
    height: 40,
  },
  value: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
});

export default BrightnessScreen;
