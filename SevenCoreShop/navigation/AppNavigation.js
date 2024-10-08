import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Screen1 from '../src/login/Screen1';
import Screen2 from '../src/login/Screen2';
import Signin from '../src/login/Signin';
import Create from '../src/login/Create';
import Forgot from '../src/login/Forgot';

const Stack = createStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Screen1" component={Screen1} options={{headerShown: false}}/>
        <Stack.Screen name="Screen2" component={Screen2} options={{headerShown: false}}/>
        <Stack.Screen name="Signin" component={Signin} options={{headerShown: false}}/>
        <Stack.Screen name="Forgot" component={Forgot} options={{headerShown: false}}/>
        <Stack.Screen name="Create" component={Create} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
