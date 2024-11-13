import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginTest = ({navigation}) => {
  // const baseUrl='http://192.168.1.7:3000'
  const [nameUser, setName] = useState();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [Repassword, setRePassword] = useState();

  // const [isLoading, setIsLoading] = useState(false);
  const onSubmitFormHandler = async () => {
    try {
      const response = await Axios.post('http://192.168.1.3:7777/login', {
        phone,
        password,
      });
      const {user} = response.data;
      const jsonUser = JSON.stringify(user.id);
      await AsyncStorage.setItem('userId', jsonUser);
      navigation.navigate('Tab');
      // console.log(jsonUser);
      if (response.status === 200) {
        // alert(` You have created: ${JSON.stringify(response.data)}`);
        alert('Login thành công');
      } else {
        throw new Error('An error has occurred');
      }
    } catch (error) {
      alert('An error has occurred 2', error.message);
      console.log(error.message);
      // setIsLoading(false);
    }
  };
  // }
  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <View style={{flex: 2}}>
          {/* <TextInput style={styles.input} onChangeText={(text)=>setName(text)} /> */}
          <TextInput
            style={styles.input}
            onChangeText={text => setPhone(text)}
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setPassword(text)}
          />
          {/* <TextInput style={styles.input} onChangeText={(text)=>setRePassword(text)} /> */}
        </View>
        <View style={{flex: 4, alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={onSubmitFormHandler}>
            <Text style={styles.txtLogin}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginTest;

const styles = StyleSheet.create({
  txtLogin: {
    fontSize: 15,
    color: 'red',
  },
  btnLogin: {
    width: 375,
    height: 60,
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderRadius: 10,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    width: 350,
    marginHorizontal: 'auto',
    marginVertical: 20,
  },
});
