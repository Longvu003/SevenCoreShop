import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const ForgotPassword = ({navigation}) => {
  const [enteremailaddress, setEnteremailaddress] = useState('');

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
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email Address"
        value={enteremailaddress}
        onChangeText={setEnteremailaddress}
        keyboardType="default"
      />
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Continue</Text>
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
    fontSize: 20,
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
});

export default ForgotPassword;
