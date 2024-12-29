import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useCallback} from 'react';
import {useState, useEffect} from 'react';
import Customheader from '../../../CustomHeader/Customheader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
import API__URL from '../../../../config';
const ListAddress = ({navigation}) => {
  const [listAddress, setListAddress] = useState([]);
  const getListAddress = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const newUserEmail = JSON.parse(userEmail);
    const response = await axios.get(
      `${API__URL}/users/getUserEmail?email=${newUserEmail}`,
    );
    setListAddress(response.data.data.address);
  };
  const deleteAddress = async id => {
    const OldUserId = await AsyncStorage.getItem('userId');
    const userId = JSON.parse(OldUserId);
    try {
      const respone = await axios.delete(
        `${API__URL}/address/deleteAddressById?userId=${userId}&&id=${id}`,
      );
      if (respone.status === 200) {
        setListAddress(prev => prev.filter(item => item._id !== id));
        Alert.alert('Xóa thành công');
      } else {
        Alert.alert('Xóa thất bại');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getListAddress();
    }, []),
  );
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../../assets/imgs/back.png')}
          title="Địa chỉ"
        />
      </View>
      <View style={{flex: 7}}>
        {listAddress.length > 0 ? (
          <FlatList
            data={listAddress}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <View style={styles.container__list}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EditAddress', {item})}
                    onLongPress={() =>
                      Alert.alert(
                        'Xác nhận',
                        'Bạn có chắc muốn xóa địa chỉ này không?',
                        [
                          {text: 'Hủy', style: 'cancel'},
                          {
                            text: 'Xóa',
                            onPress: () => deleteAddress(item._id),
                          },
                        ],
                        {cancelable: true},
                      )
                    }
                    delayLongPress={500}>
                    <View>
                      <Text style={styles.txt__list}>
                        {item.userNameAddress}
                      </Text>
                      <Text style={styles.txt__list}>{item.phoneAddress}</Text>
                      <Text
                        style={[styles.txt__list, {width: WITH__Screen * 0.8}]}>
                        {item.addressDetail}, xã {item.ward}, huyện
                        {item.district}, {item.province}
                      </Text>
                      {item.isDefault && (
                        <Text style={styles.txt__default}>Mặc định</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={item => item._id}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{width: 100, height: 100, marginVertical: 20}}
              source={require('../../../../assets/imgs/address-81-48.png')}
            />
            <Text style={styles.txt__list}>
              Chưa có địa chỉ giao hàng, vui lòng thêm địa chỉ giao hàng !
            </Text>
          </View>
        )}
      </View>
      <View style={styles.container__add}>
        <TouchableOpacity
          style={styles.btn__add}
          onPress={() => navigation.navigate('AddAddress')}>
          <Image source={require('../../../../assets/imgs/add.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ListAddress;

const styles = StyleSheet.create({
  txt__default: {
    color: 'orange',
    marginLeft: 20,
    textAlign: 'center',
    height: 30,
    width: 100,
    borderWidth: 1,
    borderColor: 'orange',
  },

  container__add: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  btn__add: {
    width: WITH__Screen * 0.4,
    height: HEIGHT__SCREEN * 0.08,
    alignItems: 'center',
  },

  txt__list: {
    fontWeight: '700',
    marginLeft: 20,
    width: WITH__Screen * 0.65,
  },
  container__list: {
    backgroundColor: '#F4F4F4',
    height: HEIGHT__SCREEN * 0.13,
    width: WITH__Screen * 0.9,
    marginHorizontal: 20,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
