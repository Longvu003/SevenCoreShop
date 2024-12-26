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
const EditAddress = ({navigation, route}) => {
  const [userNameAddress, setuserNameAddress] = useState('');
  const [phoneAddress, setPhoneAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [nameAddress, setnameAddress] = useState('');
  const [addressId, setaddressId] = useState('');
  const [isDefault, setisDefault] = useState(false);
  const [userNameError, setUserNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressDetailError, setAddressDetailError] = useState('');
  const {item} = route.params;
  const getEmailUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const newUserId = JSON.parse(userId);
      const url = `${API__URL}/address/getAddressbyid?userId=${newUserId}&&addressId=${item._id}`;
      const respone = await axios.get(url);
      if (respone.status === 200) {
        setaddressId(respone.data.data._id);
        setuserNameAddress(respone.data.data.userNameAddress);
        setPhoneAddress(respone.data.data.phoneAddress);
        setnameAddress(respone.data.data.nameAddress);
        setAddressDetail(respone.data.data.addressDetail);
        setisDefault(respone.data.data.isDefault);
      } else {
        console.log('Có lối khi lấy địa chỉ');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async () => {
    const OldUserId = await AsyncStorage.getItem('userId');
    const userId = JSON.parse(OldUserId);
    const url2 = `${API__URL}/address/updateAddressbyId`;
    try {
      if (
        userNameAddress.trim().length < 5 ||
        userNameAddress.trim().length > 15
      ) {
        setUserNameError('Họ tên phải có ít nhất 5 ký tự và tối đa 15 ký tự');
        return false;
      } else {
        setUserNameError('');
      }
      if (phoneAddress.trim().length < 10) {
        setPhoneError('Số điện thoại phải có độ dài 10 ký tự');
        return false;
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
        return false;
      } else {
        setAddressDetailError('');
      }
      const addressInformation = {
        userId,
        addressId: addressId,
        userNameAddress,
        phoneAddress,
        nameAddress,
        addressDetail,
        isDefault: isDefault,
      };

      const response = await axios.put(url2, addressInformation, {
        headers: {'Content-Type': 'application/json'},
      });
      if (response.status === 200) {
        Alert.alert('Thông báo', 'Sửa thành công');
        navigation.navigate('ListAddress');
      } else {
        Alert.alert('Lỗi', response.data?.message || 'Đã xảy ra lỗi.');
      }
    } catch (error) {
      Alert.alert('Lỗi', response.data?.message || 'Đã xảy ra lỗi.');
    }
  };
  useEffect(() => {
    getEmailUser();
  }, []);
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
          title="Sửa địa chỉ"
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
        <TouchableOpacity style={styles.btn__Save} onPress={() => updateUser()}>
          <Text style={styles.txt__btn}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default EditAddress;
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
