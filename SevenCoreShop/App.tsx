
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Home from './src/Screens/LoginTest';
import Stacknavigation from './src/Navigation/Stacknavigation';
const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stacknavigation />
    </View>

  )
}

const styles = StyleSheet.create({

});

export default App;
