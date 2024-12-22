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
        {listAddress ? (
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
                      <Text style={styles.txt__list}>{item.addressDetail}</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.txt__list}>{item.nameAddress}</Text>
                </View>
              );
            }}
            keyExtractor={item => item._id}
          />
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
            <Text style={styles.txt__list}>Nhấp vào để thêm địa chỉ</Text>
            <Text style={[styles.txt__list, {marginRight: 20}]}>Thêm</Text>
          </TouchableOpacity>
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
  container__add: {
    flex: 8,

    flexDirection: 'row',
    justifyContent: 'center',
  },

  btn__add: {
    width: WITH__Screen * 0.2,
    height: HEIGHT__SCREEN * 0.06,
    alignItems: 'center',
  },

  txt__list: {
    fontWeight: '700',
    marginLeft: 20,
    width: WITH__Screen * 0.65,
  },
  container__list: {
    backgroundColor: '#F4F4F4',
    height: HEIGHT__SCREEN * 0.1,
    width: WITH__Screen * 0.9,
    marginHorizontal: 20,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
