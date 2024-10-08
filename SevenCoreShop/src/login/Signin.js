import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios'; // Import axios

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hàm để xử lý đăng nhập
  const handleSubmit = async () => {
    // Kiểm tra người dùng đã nhập đầy đủ thông tin chưa
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }

    try {
      // Gửi yêu cầu đăng nhập tới API
      const response = await axios.post('http://10.0.2.2:3000/api/login', {
        email: email,
        password: password,
      });

      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        const data = response.data;
        Alert.alert('Login successful', `Welcome ${data.username}`);
        // Điều hướng sang trang tiếp theo nếu cần
        navigation.navigate('Home'); // Trang bạn muốn điều hướng sau khi đăng nhập thành công
      } else {
        Alert.alert('Login failed', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login request:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign In Data:', userInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../src/assets/back.png')} style={styles.back} />
      </TouchableOpacity>
      <Text style={styles.title}>Sign in</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.reset} onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.resetText}>Forgot Password? Reset</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.reset} onPress={() => navigation.navigate('Create')}>
        <Text style={styles.resetText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>Or connect with social media</Text>
      
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../src/assets/apple.png')} style={styles.icon1} />
          <Text style={styles.socialButtonText}>Continue With Apple</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
          <Image source={require('../../src/assets/google.png')} style={styles.icon2} />
          <Text style={styles.socialButtonText}>Continue With Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../src/assets/facebook.png')} style={styles.icon3} />
          <Text style={styles.socialButtonText}>Continue With Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 1,
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

export default SignInScreen;
