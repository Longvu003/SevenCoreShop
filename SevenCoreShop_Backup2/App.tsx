import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Stacknavigation from './src/Navigation/Stacknavigation';
import store from './src/ReduxTookit/Store';
// import { Provider } from 'react-redux';
import AddressCart from './src/Screens/HomeSceen/AddressCart';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Stacknavigation />
      {/* <AddressCart /> */}
    </View>
  );
};

export default App;
