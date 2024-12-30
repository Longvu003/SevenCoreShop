import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React from 'react';
import Customheader from '../../../CustomHeader/Customheader';
import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../../config';
import {useFocusEffect} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const EditAddress = ({navigation, route}) => {
  const [userNameAddress, setuserNameAddress] = useState('');
  const [phoneAddress, setPhoneAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [addressId, setaddressId] = useState('');
  const [isDefault, setisDefault] = useState(false);
  const [userNameError, setUserNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressDetailError, setAddressDetailError] = useState('');
  const [listDataAddress, setListDataAddress] = useState([]);
  const [listDataDistrict, setListDataDistrict] = useState([]);
  const [listDataWard, setListDataWard] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [loading, setLoading] = useState(false);
  const [listIsDefault, setListIsDefault] = useState([]);
  const {item} = route.params;
  const getEmailUser = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const newUserId = JSON.parse(userId);
      const url = `${API__URL}/address/getAddressbyid?userId=${newUserId}&&addressId=${item._id}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        const addressData = response.data.data;
        setaddressId(addressData._id);
        setuserNameAddress(addressData.userNameAddress);
        setPhoneAddress(addressData.phoneAddress);
        setAddressDetail(addressData.addressDetail);
        setSelectedProvince(addressData.province);
        setSelectedDistrict(addressData.district);
        setSelectedWard(addressData.ward);
        setisDefault(addressData.isDefault);
        setLoading(false);
      } else {
        console.log('Có lỗi khi lấy địa chỉ');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleProvinceSelect = provinceId => {
    const selectedProvinceObj = listDataAddress.find(
      item => item.id === provinceId,
    );
    if (selectedProvinceObj && selectedProvinceObj.data2) {
      setListDataDistrict(selectedProvinceObj.data2);
      setSelectedProvince(provinceId);
      // setSelectedDistrict(null);
      setListDataWard([]);
    } else {
      setListDataDistrict([]);
      // setSelectedProvince(null);
      // setSelectedDistrict(null);
      setListDataWard([]);
    }
  };
  const handleDistrictSelect = districtId => {
    const selectedDistrictObj = listDataDistrict.find(
      item => item.id === districtId,
    );
    if (selectedDistrictObj && selectedDistrictObj.data3) {
      setListDataWard(selectedDistrictObj.data3);
      setSelectedDistrict(districtId);
    } else {
      setListDataWard([]);
      // setSelectedDistrict(null);
    }
  };

  const handleWardSelect = wardId => {
    setSelectedWard(wardId);
  };

  const getListDataAddressvietNam = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/4/0.htm`,
      );
      setListDataDistrict(response.data.data);
      setListDataWard(response.data.data);

      setListDataAddress(response.data.data || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy danh sách tỉnh/thành phố');
      console.error(error);
    } finally {
      setLoading(false);
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
      if (addressDetail.trim().length < 5) {
        setAddressDetailError(
          'Địa chỉ phải có ít nhất 10 ký tự và tối đa 60 ký tự',
        );
        return false;
      } else {
        setAddressDetailError('');
      }
      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        return Alert.alert(
          'Lỗi',
          'Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Xã/Phường',
        );
      }
      const addressInformation = {
        userId,
        addressId: addressId,
        userNameAddress,
        phoneAddress,
        addressDetail,
        province: listDataAddress.find(item => item.id === selectedProvince)
          ?.name,
        district: listDataDistrict.find(item => item.id === selectedDistrict)
          ?.name,
        ward: listDataWard.find(item => item.id === selectedWard)?.name,
        isDefault,
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
      console.log(error);
    }
  };

  const onChangeIsdefault = async () => {
    const checkIsDefault = listIsDefault.find(item => item.isDefault === true);
    if (checkIsDefault) {
      const otherAddresses = listIsDefault.filter(
        item => item.isDefault !== true,
      );
      if (otherAddresses) {
        Alert.alert(
          'Thông báo',
          'Bạn chưa chọn địa chỉ khác làm mặc định. Vui lòng chọn một địa chỉ khác để thay đổi mặc định.',
        );
        return null;
      }
    } else {
      Alert.alert(
        'Thông báo',
        'Đã có địa chỉ mặc định, bạn vẫn muốn thay đổi?',
      );
    }
    setisDefault(!isDefault);
  };

  const getListAddress = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const newUserEmail = JSON.parse(userEmail);
    const response = await axios.get(
      `${API__URL}/users/getUserEmail?email=${newUserEmail}`,
    );
    setListIsDefault(response.data.data.address);
  };

  useEffect(() => {
    getEmailUser();
    getListAddress();
  }, []);
  useEffect(() => {
    getListDataAddressvietNam();
  }, []);

  return (
    <ScrollView>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          <Customheader
            leftIcon={require('../../../../assets/imgs/back.png')}
            title="Sửa địa chỉ"
          />
        </View>
        {loading && <ActivityIndicator size="large" color="orange" />}
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
              placeholder="Thông tin địa chỉ"
              value={addressDetail}
              onChangeText={text => setAddressDetail(text)}
            />
            {addressDetailError ? (
              <Text style={styles.txt__error}>{addressDetailError}</Text>
            ) : null}

            <RNPickerSelect
              onValueChange={value => handleProvinceSelect(value)}
              items={listDataAddress.map(province => ({
                label: province.name,
                value: province.id,
              }))}
              placeholder={{
                label: 'Chọn Tỉnh/Thành phố',
                value: null,
              }}
              value={selectedProvince}
            />

            <RNPickerSelect
              onValueChange={value => handleDistrictSelect(value)}
              items={listDataDistrict.map(district => ({
                label: district.name,
                value: district.id,
              }))}
              placeholder={{label: 'Chọn Quận/Huyện', value: null}}
              value={selectedDistrict}
            />

            <RNPickerSelect
              onValueChange={value => handleWardSelect(value)}
              items={listDataWard.map(ward => ({
                label: ward.name,
                value: ward.id,
              }))}
              placeholder={{label: 'Chọn Xã/Phường', value: null}}
              value={selectedWard}
            />

            <View
              style={{
                width: WITH__Screen * 1,
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderWidth: 1,
                  borderRadius: 50,
                  borderColor: 'orange',
                  marginHorizontal: 10,
                }}
                onPress={onChangeIsdefault}>
                {isDefault && <View style={styles.innerCircle}></View>}
              </TouchableOpacity>

              <Text>{isDefault ? '  Bỏ mặc định' : 'Mặc định'}</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 2, alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.btn__Save}
            onPress={() => updateUser()}>
            <Text style={styles.txt__btn}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditAddress;
const styles = StyleSheet.create({
  innerCircle: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: 'orange',
  },
  btn__setIsDefault: {
    backgroundColor: 'black',
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
