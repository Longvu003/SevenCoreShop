import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../config';
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
      // Gửi yêu cầu đăng nhập tới API
      const response = await axios.post(
        `${API__URL}/users/login`,
        {email, password},
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}},
      );
      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        // Sửa đoạn này để phù hợp với cấu trúc phản hồi
        const user = JSON.stringify(response.data.data.email);
        const userId = JSON.stringify(response.data.data.id);
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
      <View style={styles.container}>
        <View style={{flex: 1, marginTop: 10}}>
          <Text style={styles.title}>Đăng nhập</Text>
        </View>
        <View style={{flex: 7}}>
          <TextInput
            style={styles.input}
            placeholder="Email "
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.reset}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.resetText}>Quên mật khẩu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reset}
            onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.resetText}>Chưa có tài khoản ? đăng ký</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Hoặc </Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('../../../assets/imgs/apple.png')}
                style={styles.icon1}
              />
              <Text style={styles.socialButtonText}>Tiếp tục với Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('../../../assets/imgs/google.png')}
                style={styles.icon2}
              />
              <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('../../../assets/imgs/facebook.png')}
                style={styles.icon3}
              />
              <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  btn_back: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'left',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#272727',
  },
  reset: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  resetText: {
    color: 'black',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'regular',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#8e8e8e',
  },
  socialButtons: {
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  icon1: {
    width: 20,
    height: 24,
    marginRight: 10,
  },
  icon2: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  icon3: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default LoginScreen;
