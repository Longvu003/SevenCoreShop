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
  const [listAddress, setListAddress] = useState([]);
  console.log(listAddress);
  const getListAddress = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const newUserEmail = JSON.parse(userEmail);

    const response = await axios.get(
      `${API__URL}/users/getUserEmail?email=${newUserEmail}`,
    );

    setListAddress(response.data.data.address);
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
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.btn__list}
                  onPress={() => navigation.navigate('EditAddress')}>
                  <Text style={styles.txt__list}>{item.isDefault}</Text>
                  <Text style={styles.txt__list}>{item.address}</Text>
                  <Text style={[styles.txt__list, {marginRight: 20}]}>Sửa</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item._id}
          />
        ) : (
          <TouchableOpacity
            style={styles.btn__list}
            onPress={() => navigation.navigate('EditAddress')}>
            <Text style={styles.txt__list}>Nhấp vào để thêm địa chỉ</Text>
            <Text style={[styles.txt__list, {marginRight: 20}]}>Thêm</Text>
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
    backgroundColor: '#F4F4F4',
    height: HEIGHT__SCREEN * 0.08,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WITH__Screen * 0.9,
    marginHorizontal: 20,
    marginVertical: 20,
  },
});
