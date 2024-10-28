import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
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
  const [listAddress, setListAddress] = useState(null);
  const getAddress = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    // tách "" ra khỏi email
    const newuserEmail = JSON.parse(userEmail);
    const baseUrl = `${API__URL}/users/getUserEmail?email=${newuserEmail}`;
    // console.log('url', baseUrl);
    try {
      if (newuserEmail) {
        const response = await axios.get(baseUrl);
        const newData = Object.values(response.data);
        // console.log(newData[0].address);
        setListAddress(newData[0].address);
      } else {
        console.error('Có lỗi nè 2:');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getAddress();
    }, []),
  );
  // console.log(listAddress);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../../assets/imgs/back.png')}
          title="Địa chỉ"
        />
      </View>
      <View style={{flex: 1}}>
        {listAddress ? (
          <TouchableOpacity
            style={styles.btn__list}
            onPress={() => navigation.navigate('EditAddress')}>
            <Text style={styles.txt__list}>{listAddress}</Text>
            {/* <Text style={[styles.txt__list, {marginRight: 20}]}>Sửa</Text> */}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btn__list}
            onPress={() => navigation.navigate('EditAddress')}>
            <Text style={styles.txt__list}>Nhấp vào để thêm địa chỉ</Text>
            {/* <Text style={[styles.txt__list, {marginRight: 20}]}>Thêm</Text> */}
          </TouchableOpacity>
        )}
      </View>
      <View style={{flex: 6}}></View>
    </View>
  );
};
export default ListAddress;

const styles = StyleSheet.create({
  txt__list: {
    fontWeight: '700',
    marginLeft: 20,
  },
  btn__list: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#F4F4F4',
    height: HEIGHT__SCREEN * 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
