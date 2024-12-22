import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import ListAddress from '../Screens/User/address/ListAddress';
import EditAddress from '../Screens/User/address/EditAddress';
import EditPayment from '../Screens/User/payment/EditPayment';
import ListPayment from '../Screens/User/payment/ListPayment';
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
import AdScreen from '../Screens/HomeSceen/AdScreen';
import AdDetail from '../Screens/HomeSceen/AdDetail';
import PaymentAddressScreen from '../Screens/HomeSceen/PaymentAddressScreen';
import CartProdvider from '../Screens/Cart/CartProdvider';
import SearchOrder from '../Screens/Order/SearchOrder';
import AddAddress from '../Screens/User/address/AddAddress';
const Stack = createStackNavigator();
const Stacknavigation = () => {
  return (
    <CartProdvider>
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
          <Stack.Screen
            name="AllProductsScreen"
            component={AllProductsScreen}
          />
          <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
          <Stack.Screen
            name="PaymentAddressScreen"
            component={PaymentAddressScreen}
            options={{title: 'Chọn địa chỉ và thanh toán'}}
          />
          <Stack.Screen
            name="CategoryDetailScreen"
            component={CategoryDetailScreen}
          />
          <Stack.Screen name="DetailOrder" component={DetailOrder} />
          <Stack.Screen name="AdScreen" component={AdScreen} />
          <Stack.Screen name="AdDetail" component={AdDetail} />
          <Stack.Screen name="SearchOrder" component={SearchOrder} />
          <Stack.Screen name="AddAddress" component={AddAddress} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProdvider>
  );
};
export default Stacknavigation;
