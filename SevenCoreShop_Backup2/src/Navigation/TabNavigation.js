import {Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import User from '../Screens/User/User';

import Notification from '../Screens/Notification/Notification';
import Order from '../Screens/Order/Order';
import HomeScreen from '../Screens/HomeSceen/HomeScreen';
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
        name="Notification"
        component={Notification}
        options={{
          tabBarLabel: 'Thông báo',
          tabBarIcon: () => (
            <Image source={require('../../assets/imgs/notificationbing.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={Order}
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
