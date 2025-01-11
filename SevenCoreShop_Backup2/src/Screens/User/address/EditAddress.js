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
import EditAddressStyle from '../../../StyleSheets/EditAddressStyle';
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
      if (!addressDetail.trim() || addressDetail.length > 60) {
        setAddressDetailError(
          'Địa chỉ không được để trống và tối đa là 60 ký tự',
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
          ?.full_name,
        district: listDataDistrict.find(item => item.id === selectedDistrict)
          ?.full_name,
        ward: listDataWard.find(item => item.id === selectedWard)?.full_name,
        isDefault,
      };

      const response = await axios.put(url2, addressInformation, {
        headers: {'Content-Type': 'application/json'},
      });
      if (response.status === 200) {
        Alert.alert('Thông báo', 'Sửa thành công');
        navigation.navigate('ListAddress');
      } else {
        const errorMessage =
          error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        Alert.alert(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeIsdefault = async () => {
    Alert.alert('Thông báo', 'Đã thay đổi thành công');
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
              style={EditAddressStyle.input}
              placeholder="Họ và tên"
              value={userNameAddress}
              onChangeText={text => setuserNameAddress(text)}
            />
            {userNameError ? (
              <Text style={EditAddressStyle.txt__error}>{userNameError}</Text>
            ) : null}
            <TextInput
              style={EditAddressStyle.input}
              placeholder="Số điện thoại"
              value={phoneAddress}
              keyboardType="numeric"
              onChangeText={text => setPhoneAddress(text)}
            />
            {phoneError ? (
              <Text style={EditAddressStyle.txt__error}>{phoneError}</Text>
            ) : null}
            <TextInput
              style={EditAddressStyle.input}
              placeholder="Thông tin địa chỉ"
              value={addressDetail}
              onChangeText={text => setAddressDetail(text)}
            />
            {addressDetailError ? (
              <Text style={EditAddressStyle.txt__error}>
                {addressDetailError}
              </Text>
            ) : null}

            <RNPickerSelect
              onValueChange={value => handleProvinceSelect(value)}
              items={listDataAddress.map(province => ({
                label: province.full_name,
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
                label: district.full_name,
                value: district.id,
              }))}
              placeholder={{label: 'Chọn Quận/Huyện', value: null}}
              value={selectedDistrict}
            />

            <RNPickerSelect
              onValueChange={value => handleWardSelect(value)}
              items={listDataWard.map(ward => ({
                label: ward.full_name,
                value: ward.id,
              }))}
              placeholder={{label: 'Chọn Xã/Phường', value: null}}
              value={selectedWard}
            />

            <View style={EditAddressStyle.container__radiobutton}>
              <TouchableOpacity
                style={EditAddressStyle.btn__radioCheck}
                onPress={onChangeIsdefault}>
                {isDefault && (
                  <View style={EditAddressStyle.innerCircle}></View>
                )}
              </TouchableOpacity>
              <Text>{isDefault ? '  Bỏ mặc định' : 'Mặc định'}</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 2, alignItems: 'center'}}>
          <TouchableOpacity
            style={EditAddressStyle.btn__Save}
            onPress={() => updateUser()}>
            <Text style={EditAddressStyle.txt__btn}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default EditAddress;
