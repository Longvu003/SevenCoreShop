import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import React from 'react';
import Customheader from '../../../CustomHeader/Customheader';
import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../../config';
import {useFocusEffect} from '@react-navigation/native';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const AddAddress = ({navigation}) => {
  const [userNameAddress, setuserNameAddress] = useState('');
  const [phoneAddress, setPhoneAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [nameAddress, setnameAddress] = useState('');
  const [isDefault, setisDefault] = useState(false);
  const [userNameError, setUserNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressDetailError, setAddressDetailError] = useState('');
  const AddAddressUser = async () => {
    const OldUserId = await AsyncStorage.getItem('userId');
    const userId = JSON.parse(OldUserId);
    try {
      if (
        userNameAddress.trim().length < 5 ||
        userNameAddress.trim().length > 15
      ) {
        setUserNameError('Họ tên phải có ít nhất 5 ký tự và tối đa 15 ký tự');
      } else {
        setUserNameError('');
      }
      if (phoneAddress.trim().length < 10) {
        setPhoneError('Số điện thoại phải có độ dài 10 ký tự');
      } else {
        setPhoneError('');
      }
      if (
        addressDetail.trim().length < 10 ||
        addressDetail.trim().length > 60
      ) {
        setAddressDetailError(
          'Địa chỉ phải có ít nhất 10 ký tự và tối đa 60 ký tự',
        );
      } else {
        setAddressDetailError('');
      }
      const addressInformation = {
        userId,
        userNameAddress,
        phoneAddress,
        nameAddress,
        addressDetail,
        isDefault: isDefault,
      };
      const url2 = `${API__URL}/address/addAddress`;
      await axios.post(url2, addressInformation, {
        headers: 'application/x-www-form-urlencoded',
      });
      Alert.alert('Thông báo', 'Thêm thành công');
      navigation.navigate('ListAddress');
    } catch (error) {
      console.log(error);
    }
  };
  const checkDefault = () => {
    setisDefault(prevState => {
      const newState = !prevState;
      Alert.alert(
        newState ? 'Đã chọn địa chỉ mặc định' : 'Đã hủy địa chỉ mặc định',
      );
      return newState;
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../../assets/imgs/back.png')}
          title="Thêm địa chỉ"
        />
      </View>
      <View style={{flex: 8}}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={userNameAddress}
            onChangeText={text => setuserNameAddress(text)}
          />
          {userNameError ? (
            <Text style={styles.txt__error}>{userNameError}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phoneAddress}
            keyboardType="numeric"
            onChangeText={text => setPhoneAddress(text)}
          />
          {phoneError ? (
            <Text style={styles.txt__error}>{phoneError}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Tên riêng địa chỉ"
            value={nameAddress}
            onChangeText={text => setnameAddress(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Thông tin địa chỉ"
            value={addressDetail}
            onChangeText={text => setAddressDetail(text)}
          />
          {addressDetailError ? (
            <Text style={styles.txt__error}>{addressDetailError}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={checkDefault}
          style={styles.btn__setIsDefault}>
          <Text>Đặt làm địa chỉ mặc định</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.btn__Save}
          onPress={() => AddAddressUser()}>
          <Text style={styles.txt__btn}>Thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default AddAddress;
const styles = StyleSheet.create({
  btn__setIsDefault: {
    backgroundColor: 'orange',
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 30,
    marginTop: 30,
  },
  input: {
    borderRadius: 30,
    width: WITH__Screen * 0.9,
    marginHorizontal: 20,
    height: HEIGHT__SCREEN * 0.1,
  },
  txt__error: {
    marginHorizontal: 10,
    color: 'red',
  },
  txt__btn: {
    color: 'white',
    fontWeight: '800',
  },
  btn__Save: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.07,
    borderRadius: 20,
  },
  input: {
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.08,
    backgroundColor: '#F4F4F4',
    marginTop: 20,
    marginHorizontal: 20,
  },
});
