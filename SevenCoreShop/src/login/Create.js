import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import axios from 'axios';

const Create = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [numberphone, setNumberphone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [role, setRole] = useState('Buyer'); // Selected role
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Show modal to select role

  const roles = ['Admin', 'Seller', 'Buyer']; // List of roles

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectRole = (role) => {
    setRole(role);
    toggleModal(); // Close modal after selecting role
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
      role,
    };

    // Basic validation for form inputs
    if (!email || !password || !username || !numberphone || !birthday || !role) {
      Alert.alert('Please fill out all fields');
      return;
    }

    try {
      // Send POST request to API
      const response = await axios.post('http://10.0.2.2:3000/api/add-user', formData);
      
      // Handle response
      if (response.status === 200) {
        Alert.alert('Registration successful');
        navigation.navigate('Signin'); // Navigate to sign-in page
      } else {
        Alert.alert('Registration failed, please try again');
      }
    } catch (error) {
      console.error('Error during request:', error);
      Alert.alert('Network error or server issue');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../src/assets/back.png')} style={styles.back} />
      </TouchableOpacity>
      <Text style={styles.title}>Create Account</Text>

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

      {/* Role Input */}
      <TouchableOpacity onPress={toggleModal}>
        <TextInput
          style={[styles.input, role ? styles.boldText : null]}
          placeholder="Select Role"
          value={role}
          editable={false} // Disable direct editing
        />
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <FlatList
            data={roles}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectRole(item)}>
                <Text style={styles.roleText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginText}>Continue</Text>
      </TouchableOpacity>
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
  back: {
    fontSize: 0,
    marginLeft: 15,
    backgroundColor: 'black',
    padding: 10,
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

export default Create;
