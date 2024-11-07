import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Stacknavigation from './src/Navigation/Stacknavigation';
import store from './src/ReduxTookit/Store';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Stacknavigation />
    </View>
  );
};

export default App;
