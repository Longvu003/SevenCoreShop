import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState(''); // Sử dụng biến email ở đây

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://10.0.2.2:7777/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Sử dụng biến email
      });
  
      // Chỉ đọc phản hồi JSON nếu phản hồi từ máy chủ là OK
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert('Thành công', 'Mã khôi phục mật khẩu đã được gửi đến email.');
        navigation.navigate('Resetpass');
      } else {
        Alert.alert('Lỗi', result.message || 'Gửi email khôi phục mật khẩu không thành công.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
      console.error('Lỗi quên mật khẩu:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Image
          source={require('../../../assets/imgs/back2.png')}
          style={styles.back}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Thay đổi thành email-address để hỗ trợ nhập email
        autoCapitalize="none" // Không tự động viết hoa
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleForgotPassword}>
        <Text style={styles.loginText}>Tiếp Tục</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 1,
  },
  back: {
    width: 30, // Thay đổi kích thước cho ảnh
    height: 30,
    marginLeft: 15,
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
    fontWeight: '600', // Thay đổi thành '600' để tạo sự khác biệt
  },
});

export default ForgotPassword;
