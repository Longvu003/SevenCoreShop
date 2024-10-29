import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/Screens/HomeSceen/HomeScreen';
import CategoryScreen from './src/Screens/HomeSceen/Category';
import AllProductsScreen from './src/Screens/HomeSceen/AllProductsScreen';
import CategoryDetailScreen from './src/Screens/HomeSceen/CategoryDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="AllProducts" component={AllProductsScreen} />
        <Stack.Screen
          name="CategoryDetail"
          component={CategoryDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
