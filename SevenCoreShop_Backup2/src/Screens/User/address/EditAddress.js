import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import Customheader from '../../../CustomHeader/Customheader';
import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../../config';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const EditAddress = () => {
  const [addressInformation, setAddressInformation] = useState('');
  const getEmailUser = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const newUserEmail = JSON.parse(userEmail);
      const url = `${API__URL}/users/getUserEmail?email=${newUserEmail}`;
      if (newUserEmail) {
        const respone = await axios.get(url);
        // ep vao data vao mang chua json
        const userInfor = Object.values(respone.data);
        setAddressInformation(userInfor[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeAddress = async (inputData, value) => {
    setAddressInformation(oldData => ({
      ...oldData,
      [inputData]: value,
    }));
  };

  const updateUser = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const newUserEmail = JSON.parse(userEmail);
    const url2 = `${API__URL}/users/updateUser?email=${newUserEmail}`;

    try {
      if (newUserEmail) {
        await axios.put(url2, addressInformation, {
          headers: 'application/x-www-form-urlencoded',
        });
        Alert.alert('Sửa thành công');
      } else {
        console.log('Sửa thất bại');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmailUser();
  }, []);
  // console.log(addressInformation.address);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../../assets/imgs/back.png')}
          title="Thêm địa chỉ"
        />
      </View>
      <View style={{flex: 8}}>
        <TextInput
          style={styles.input}
          placeholder="phường, xã, huyện,TP "
          onChangeText={text => changeAddress('address', text)}
          value={addressInformation.address}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <TouchableOpacity style={styles.btn__Save} onPress={updateUser}>
          <Text style={styles.txt__btn}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default EditAddress;
const styles = StyleSheet.create({
  txt__btn: {
    color: 'white',
    fontWeight: '800',
  },
  btn__Save: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: WITH__Screen * 0.8,
    height: HEIGHT__SCREEN * 0.07,
    borderRadius: 40,
  },
  input: {
    width: WITH__Screen * 1,
    height: HEIGHT__SCREEN * 0.07,
    backgroundColor: '#F4F4F4',
    marginTop: 20,
  },
});
