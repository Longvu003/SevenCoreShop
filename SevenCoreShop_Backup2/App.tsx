import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Stacknavigation from './src/Navigation/Stacknavigation';
// import { Provider } from 'react-redux';
import AddressCart from './src/Screens/HomeSceen/AddressCart';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Stacknavigation />
    </View>
  );
};

export default App;
