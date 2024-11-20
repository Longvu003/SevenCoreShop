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

  // useEffect(() => {
  //   console.log(userData.birthday);
  // }, [userData]);
  const changeDataUser = (dataInput, value) => {
    setUserData(oldData => ({...oldData, [dataInput]: value}));
  };
  const updateUserInformation = async () => {
    const userEmail_2 = await AsyncStorage.getItem('userEmail');
    const userString = JSON.parse(userEmail_2);
    const url = `${API__URL}/users/updateUser?email=${userString}`;
    try {
      if (userData.username.length < 6 && userData.numberphone.length <= 10) {
        Alert.alert('userName từ 6 ký tự và numberphone phải 10 ký tự  ');
      } else {
        await axios.put(url, userData, {
          headers: 'application/x-www-form-urlencoded',
        });
        Alert.alert('Cập nhật thành công');
        navigation.navigate('User');
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
      <View style={{flex: 8}}>
        <TextInput
          style={styles.input}
          onChangeText={text => changeDataUser('username', text)}
          value={userData.username || ''}
          // placeholder="username"
        />
        <TextInput
          style={styles.input}
          onChangeText={text => changeDataUser('numberphone', text)}
          value={userData.numberphone || ''}
          // placeholder="phone"
          keyboardType="phone-pad"
        />
        {/* <TextInput
          style={styles.input}
          onChangeText={text => setBirthday(text)}
          placeholder="birthday"
          keyboardType="number-pad"
        /> */}
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
  txt__save: {
    color: 'white',
  },
  btn__container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  btn__save: {
    backgroundColor: 'black',
    width: WITH__SCREEN * 0.8,
    height: HEIGHT__SCREEN * 0.05,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#F4F4F4',
    marginTop: 20,
  },
});
