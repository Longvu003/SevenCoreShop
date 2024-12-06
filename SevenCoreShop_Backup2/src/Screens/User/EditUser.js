import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import Customheader from '../../CustomHeader/Customheader';
const WITH__SCREEN = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../config';
const EditUser = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [errorName, setErrorName] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('userEmail');
      const newUser = JSON.parse(user);
      const url = `${API__URL}/users/getUserEmail?email=${newUser}`;
      if (user) {
        const respone = await axios.get(url);
        const userInformation = Object.values(respone.data);
        setUserData(userInformation[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  const changeDataUser = (dataInput, value) => {
    setUserData(oldData => ({...oldData, [dataInput]: value}));
  };
  const updateUserInformation = async () => {
    const userEmail_2 = await AsyncStorage.getItem('userEmail');
    const userString = JSON.parse(userEmail_2);
    const url = `${API__URL}/users/updateUser?email=${userString}`;
    try {
      let chekError = true;
      if (userData.username.length < 6) {
        setErrorName('User Name phải từ 6 ký tự   ');
        chekError = false;
      } else {
        setErrorName('');
      }
      if (userData.numberphone.length < 10) {
        setErrorPhone('Số điện thoại phải đủ 10 ký tự');
        chekError = false;
      } else {
        setErrorPhone('');
      }
      if (chekError) {
        await axios.put(url, userData, {
          headers: 'application/x-www-form-urlencoded',
        });
        Alert.alert('Thông báo', 'Cập nhật thành công');
        // navigation.navigate('User');
      }
    } catch (error) {
      console.log('Lỗi cập nhật user', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../assets/imgs/back.png')}
          title="Sửa thông tin "
        />
      </View>
      <View style={{flex: 7}}>
        <TextInput
          style={styles.input}
          onChangeText={text => changeDataUser('username', text)}
          value={userData.username || ''}
          // placeholder="username"
        />
        <View style={{height: 30}}>
          {errorName ? (
            <View>
              <Text style={styles.txt__error}>{errorName}</Text>
            </View>
          ) : null}
        </View>

        <TextInput
          style={styles.input}
          onChangeText={text => changeDataUser('numberphone', text)}
          value={userData.numberphone || ''}
          // placeholder="phone"
          keyboardType="phone-pad"
        />
        <View style={{height: 30}}>
          {errorPhone ? (
            <Text style={styles.txt__error}>{errorPhone}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.btn__container}>
        <TouchableOpacity
          style={styles.btn__save}
          onPress={updateUserInformation}>
          <Text style={styles.txt__save}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default EditUser;

const styles = StyleSheet.create({
  txt__error: {
    marginHorizontal: 20,
    color: 'red',
  },
  txt__save: {
    color: 'white',
  },
  btn__container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3,
  },
  btn__save: {
    backgroundColor: 'black',
    width: WITH__SCREEN * 0.9,
    height: HEIGHT__SCREEN * 0.08,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#F4F4F4',
    marginVertical: 10,
    width: WITH__SCREEN * 0.9,
    height: HEIGHT__SCREEN * 0.08,
    marginHorizontal: 20,
  },
});
