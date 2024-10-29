import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Stacknavigation from './src/Navigation/Stacknavigation';
import store from './src/ReduxTookit/Store';
import { Provider } from 'react-redux';



const App = () => {
  return (
    <Provider store={store}>
      <Stacknavigation />
    
    </Provider>
  );
};

export default App;
