import React from 'react';
import Home from '../Screens/LoginTest';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import ListAddress from '../Screens/User/address/ListAddress';
import EditAddress from '../Screens/User/address/EditAddress';
import EditPayment from '../Screens/User/payment/EditPayment';
import ListPayment from '../Screens/User/payment/ListPayment';
import LoginTest from '../Screens/LoginTest';
import EditUser from '../Screens/User/EditUser';
const Stack = createStackNavigator();
const Stacknavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="EditAddress"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="LoginTest" component={LoginTest} />
        {/* <Stack.Screen name="Search" component={Search} /> */}
        <Stack.Screen name="Tab" component={TabNavigation} />
        <Stack.Screen name="ListAddress" component={ListAddress} />
        <Stack.Screen name="EditAddress" component={EditAddress} />
        <Stack.Screen name="EditPayment" component={EditPayment} />
        <Stack.Screen name="ListPayment" component={ListPayment} />
        <Stack.Screen name="EditUser" component={EditUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Stacknavigation;
