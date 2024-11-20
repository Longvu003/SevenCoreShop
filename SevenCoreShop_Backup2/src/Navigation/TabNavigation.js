import {Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import User from '../Screens/User/User';

import Notification from '../Screens/Notification/Notification';
import OrderScreen from '../Screens/Order/OrderScreen';
import HomeScreen from '../Screens/HomeSceen/HomeScreen';
import CartScreen from '../Screens/Cart/CartScreen';
const Tab = createBottomTabNavigator();
const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: () => (
            <Image source={require('../../assets/imgs/home2.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          tabBarLabel: 'Giỏ Hàng',
          tabBarIcon: () => (
            <Image source={require('../../assets/imgs/ic_cart.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={{
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: () => (
            <Image source={require('../../assets/imgs/Order.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={User}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: () => (
            <Image source={require('../../assets/imgs/profile.png')} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
