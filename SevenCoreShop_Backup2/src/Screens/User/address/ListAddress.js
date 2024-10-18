import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import Customheader from '../../../CustomHeader/Customheader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';
import axios from 'axios';

const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const ListAddress = ({navigation}) => {
  const [listAddress, setListAddress] = useState(null);
  const getAddress = async () => {
    const userId = await AsyncStorage.getItem('userId');
    // tách "" ra khỏi id
    const newuserId = JSON.parse(userId);
    const baseUrl = `http://192.168.2.59:3000/getid?id=${newuserId}`;
    // console.log('url', baseUrl);
    try {
      if (newuserId && newuserId.length >= 24) {
        const response = await axios.get(baseUrl);
        const newData = Object.values(response.data);
        setListAddress(newData);
        console.log(listAddress);
      } else {
        console.error('Có lỗi nè 2:', newuserId);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAddress();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../../assets/imgs/back.png')}
          title="Địa chỉ"
        />
      </View>
      <View style={{flex: 8}}>
        <FlatList
          data={listAddress}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.btn__list}
              onPress={() => navigation.navigate('EditAddress')}>
              <Text style={styles.txt__list}>{item.address}</Text>
              <Text style={[styles.txt__list, {marginRight: 20}]}>Sửa</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>
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
