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
const EditUser = () => {
  const [userData, setUserData] = useState({});

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('userEmail');
      const newUser = JSON.parse(user);
      const url = `http://192.168.2.59:7777/users/getUserEmail?email=${newUser}`;
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
    try {
      const userEmail_2 = await AsyncStorage.getItem('userEmail');
      const userString = JSON.parse(userEmail_2);
      const url = `http://192.168.2.59:7777/users/updateUser?email=${userString}`;
      await axios.put(url, userData, {
        headers: 'application/x-www-form-urlencoded',
      });
      // console.log(url);
      const newDataUpdate = {
        ...userData[0],
        username: userData.username,
        numberphone: userData.numberphone,
      };

      await AsyncStorage.setItem(
        'newDataUpdate',
        JSON.stringify(newDataUpdate),
      );

      Alert.alert('Cập nhật thành công');
    } catch (error) {
      console.error('Lỗi cập nhật user', error);
    }
  };

  // console.log(userData);
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
