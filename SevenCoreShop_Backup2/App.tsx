import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Stacknavigation from './src/Navigation/Stacknavigation';
import HomeScreen from './src/Screens/HomeSceen/HomeScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <Stacknavigation /> */}
      <HomeScreen />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
