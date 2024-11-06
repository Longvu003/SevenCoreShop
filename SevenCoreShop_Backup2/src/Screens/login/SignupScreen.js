import React, {useState} from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import {Modal} from 'react-native-modal';
import axios from 'axios';
import API__URL from '../../../config';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [numberphone, setNumberphone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Show modal to select role

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = selectedDate.toISOString().split('T')[0]; // Format date
      setBirthday(date);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const formData = {
      email,
      password,
      username,
      numberphone,
      birthday,
    };

    // Basic validation for form inputs
    if (!email || !password || !username || !numberphone || !birthday) {
      Alert.alert('Please fill out all fields');
      return;
    }

    try {
      // Send POST request to API
      const response = await axios.post(`${API__URL}/users/register`, formData);

      // Handle response
      if (response.status === 200) {
        Alert.alert('Đăng ký thành công');
        navigation.navigate('LoginScreen'); // Navigate to sign-in page
      } else {
        Alert.alert('Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Error during request:', error);
      Alert.alert('Network error or server issue');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{flex: 2}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Image
              source={require('../../../assets/imgs/back2.png')}
              style={styles.back}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex: 2, marginTop: 20}}>
          <Text style={styles.title}>Tạo tài khoản</Text>
        </View>
        <View style={{flex: 8}}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={numberphone}
            onChangeText={setNumberphone}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {/* Birthday Input */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={[styles.input, birthday ? styles.boldText : null]}
              placeholder="Birthday"
              value={birthday}
              editable={false} // Disable direct editing
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              style={styles.input}
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginText}>Tiếp tục</Text>
          </TouchableOpacity>
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

  back: {
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 50,
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
  boldText: {
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
    fontWeight: 'regular',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    fontWeight: 'bold',
    color: '#272727',
  },
  roleText: {
    fontSize: 18,
    paddingVertical: 10,
    fontWeight: 'bold',
    color: '#272727',
  },
});

export default SignupScreen;
