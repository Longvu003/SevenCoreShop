import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../config';
import LoginStyle from '../../StyleSheets/LoginStyle';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Email không được để trống');
      return false;
    }
    if (!password) {
      Alert.alert('Mật khẩu không được để trống');
      return false;
    }
    try {
      const response = await axios.post(
        `${API__URL}/users/login`,
        {email, password},
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}},
      );
      if (response.status === 200) {
        const user = JSON.stringify(response.data.data.email);
        const userId = JSON.stringify(response.data.data._id);
        await AsyncStorage.setItem('userEmail', user);
        await AsyncStorage.setItem('userId', userId);
        navigation.navigate('Tab');
      } else {
        Alert.alert('Đăng nhập thất bại', 'Nhập đúng email và mật khẩu');
      }
    } catch (error) {
      console.log('Error during login request:', error);
      Alert.alert('Lỗi', 'Email hoặc mật khẩu không chính xác');
    }
  };
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={LoginStyle.container}>
        <View style={{flex: 1, marginTop: 10}}>
          <Text style={LoginStyle.title}>Đăng nhập</Text>
        </View>
        <View style={{flex: 7}}>
          <TextInput
            style={LoginStyle.input}
            placeholder="Email "
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={LoginStyle.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={LoginStyle.reset}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={LoginStyle.resetText}>Quên mật khẩu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={LoginStyle.reset}
            onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={LoginStyle.resetText}>
              Chưa có tài khoản ? đăng ký
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={LoginStyle.loginButton}
            onPress={handleSubmit}>
            <Text style={LoginStyle.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
