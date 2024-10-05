import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppNavigation from './navigation/AppNavigation';
import Signin from './src/login/Signin';
import Create from './src/login/Create';
import Forgot from './src/login/Forgot';

export default function App() {
  return (
    <View style={styles.container}>
      <Create />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đặt flex: 1 để chiếm toàn bộ không gian màn hình
  },
});
