import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Customheader from '../../../CustomHeader/Customheader';
import {Dimensions} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../../config';
import RNPickerSelect from 'react-native-picker-select';

const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;

const AddAddress = ({navigation}) => {
  const [userNameAddress, setuserNameAddress] = useState('');
  const [phoneAddress, setPhoneAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isDefault, setisDefault] = useState(false);
  const [listDataAddress, setListDataAddress] = useState([]);
  const [listDataDistrict, setListDataDistrict] = useState([]);
  const [listDataWard, setListDataWard] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [loading, setLoading] = useState(false);

  const getListDataAddressvietNam = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/4/0.htm`,
      );
      setListDataAddress(response.data.data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy danh sách tỉnh/thành phố');
      console.error(error);
    } finally {
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
    } else {
      setListDataDistrict([]);
      setSelectedProvince(null);
    }
    setSelectedDistrict(null);
    setListDataWard([]);
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
      setSelectedDistrict(null);
    }
    setSelectedWard(null);
  };
  const onChangeIsdefault = async () => {
    Alert.alert('Thông báo', 'Đã thay đổi thành công');
    setisDefault(!isDefault);
  };

  const AddAddressUser = async () => {
    const OldUserId = await AsyncStorage.getItem('userId');
    const userId = JSON.parse(OldUserId);

    if (!userNameAddress.trim()) {
      return Alert.alert('Lỗi', 'Họ và tên không được để trống');
    }
    if (!phoneAddress.trim() || phoneAddress.length !== 10) {
      return Alert.alert('Lỗi', 'Số điện thoại phải có 10 ký tự');
    }
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      return Alert.alert(
        'Lỗi',
        'Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Xã/Phường',
      );
    }
    if (!addressDetail.trim() || addressDetail.length > 50) {
      return Alert.alert(
        'Lỗi',
        'Địa chỉ chi tiết không được để trống và ko lớn hơn 50 ký tự',
      );
    }
    const addressInformation = {
      userId,
      userNameAddress,
      phoneAddress,
      addressDetail,
      isDefault,
      province: listDataAddress.find(item => item.id === selectedProvince)
        ?.full_name,
      district: listDataDistrict.find(item => item.id === selectedDistrict)
        ?.full_name,
      ward: listDataWard.find(item => item.id === selectedWard)?.full_name,
    };
    try {
      const url2 = `${API__URL}/address/addAddress`;
      await axios.post(url2, addressInformation, {
        headers: {'Content-Type': 'application/json'},
      });
      Alert.alert('Thông báo', 'Thêm địa chỉ thành công');
      navigation.navigate('ListAddress');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm địa chỉ');
      console.log(error);
    }
  };

  useEffect(() => {
    getListDataAddressvietNam();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{flex: 1}}>
            <Customheader
              leftIcon={require('../../../../assets/imgs/back.png')}
              title="Thêm địa chỉ"
            />
          </View>

          <View style={{flex: 8, paddingHorizontal: 20}}>
            {loading && <ActivityIndicator size="large" color="blue" />}
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={userNameAddress}
              onChangeText={text => setuserNameAddress(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phoneAddress}
              keyboardType="numeric"
              onChangeText={text => setPhoneAddress(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Thông tin địa chỉ"
              value={addressDetail}
              onChangeText={text => setAddressDetail(text)}
            />

            <View style={{flex: 2}}>
              <RNPickerSelect
                onValueChange={value => handleProvinceSelect(value)}
                items={listDataAddress.map(province => ({
                  label: province.full_name,
                  value: province.id,
                }))}
                placeholder={{label: 'Chọn Tỉnh/Thành phố', value: null}}
              />

              {selectedProvince && (
                <RNPickerSelect
                  onValueChange={value => handleDistrictSelect(value)}
                  items={listDataDistrict.map(district => ({
                    label: district.full_name,
                    value: district.id,
                  }))}
                  placeholder={{label: 'Chọn Quận/Huyện', value: null}}
                />
              )}

              {selectedDistrict && (
                <RNPickerSelect
                  onValueChange={value => setSelectedWard(value)}
                  items={listDataWard.map(ward => ({
                    label: ward.full_name,
                    value: ward.id,
                  }))}
                  placeholder={{label: 'Chọn Xã/Phường', value: null}}
                />
              )}
            </View>
          </View>
          <View style={styles.container__radiobutton}>
            <TouchableOpacity
              style={styles.btn__radioCheck}
              onPress={onChangeIsdefault}>
              {isDefault && <View style={styles.innerCircle}></View>}
            </TouchableOpacity>

            <Text>{isDefault ? '  Bỏ mặc định' : 'Mặc định'}</Text>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.btn__Save}
              onPress={() => AddAddressUser()}>
              <Text style={styles.txt__btn}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  btn__radioCheck: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'orange',
    marginHorizontal: 10,
  },

  container__radiobutton: {
    width: WITH__Screen * 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: 'orange',
  },
  input: {
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.08,
    backgroundColor: '#F4F4F4',
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  txt__btn: {
    color: 'white',
    fontWeight: 'bold',
  },
  btn__Save: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.07,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default AddAddress;
