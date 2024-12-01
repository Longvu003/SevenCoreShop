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
import Resetpass from '../Screens/login/Resetpass';
import ForgotPassword from '../Screens/login/ForgotPassword';
import LoginScreen from '../Screens/login/LoginScreen';
import SignupScreen from '../Screens/login/SignupScreen';
import Welcome1 from '../Screens/login/Welcome1';
import Welcome2 from '../Screens/login/Welcome2';
import ProductDetail from '../Screens/DetailScreens/ProductDetail';
import CartScreen from '../Screens/Cart/CartScreen';
import AllProductsScreen from '../Screens/HomeSceen/AllProductsScreen';
import CategoryDetailScreen from '../Screens/HomeSceen/CategoryDetailScreen';
import CategoryScreen from '../Screens/HomeSceen/Category';
import DetailOrder from '../Screens/Order/DetailOrder';
import OrderScreen from '../Screens/Order/OrderScreen';
import PaymentAddressScreen from '../Screens/HomeSceen/PaymentAddressScreen'
const Stack = createStackNavigator();
const Stacknavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tab"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Welcome1" component={Welcome1} />
        <Stack.Screen name="Welcome2" component={Welcome2} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Resetpass" component={Resetpass} />
        <Stack.Screen name="Tab" component={TabNavigation} />
        <Stack.Screen name="ListAddress" component={ListAddress} />
        <Stack.Screen name="EditAddress" component={EditAddress} />
        <Stack.Screen name="EditPayment" component={EditPayment} />
        <Stack.Screen name="ListPayment" component={ListPayment} />
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="AllProductsScreen" component={AllProductsScreen} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen
          name="PaymentAddressScreen"
          component={PaymentAddressScreen}
          options={{ title: 'Chọn địa chỉ và thanh toán' }}
        />
        <Stack.Screen
          name="CategoryDetailScreen"
          component={CategoryDetailScreen}
        />
        <Stack.Screen name="DetailOrder" component={DetailOrder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Stacknavigation;
