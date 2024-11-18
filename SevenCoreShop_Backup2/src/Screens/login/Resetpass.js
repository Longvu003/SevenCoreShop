import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';

const Resetpass = ({navigation}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email.');
      return;
    }
    if (!verificationCode) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true); // Bắt đầu loading
    try {
      const response = await fetch(`${API__URL}/resetpass/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: verificationCode,
          newPassword,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Mật khẩu đã được đặt lại thành công.');
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert(
          'Lỗi',
          result.message || 'Đặt lại mật khẩu không thành công.',
        );
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
      console.error('Lỗi đặt lại mật khẩu:', error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={{marginVertical: 26}}>
        <Customheader leftIcon={require('../../../assets/imgs/back4.png')} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Lấy lại mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mã xác minh"
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleResetPassword}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Gửi</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.linkText}>Gửi lại mã</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.linkText}>Quay lại trang đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 4,
    justifyContent: 'center',
    paddingHorizontal: 26,
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
  submitButton: {
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'regular',
  },
  linkText: {
    color: '#000',
    textAlign: 'center',
    marginVertical: 5,
    textDecorationLine: 'underline',
  },
});

export default Resetpass;
