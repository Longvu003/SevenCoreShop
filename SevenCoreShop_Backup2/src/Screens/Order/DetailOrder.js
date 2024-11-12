import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import Customheader from '../../CustomHeader/Customheader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../config';
import axios from 'axios';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const DetailOrder = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../assets/imgs/back4.png')}
          title="đơn hàng #123123123"
        />
      </View>
      <View style={{flex: 1}}>
        <View style={styles.item__container}>
          <Image
            style={styles.img__size}
            source={require('../../../assets/imgs/logo.png')}
          />
          <View>
            <Text>Áo khoác mùa đông</Text>
            <Text>Số lượng : 2</Text>
            <Text>đơn giá : 100</Text>
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        <View style={styles.item__container}>
          <Image
            style={styles.img__size}
            source={require('../../../assets/imgs/logo.png')}
          />
          <View>
            <Text>Giày thể thao</Text>
            <Text>Số lượng : 1</Text>
            <Text>đơn giá : 100</Text>
          </View>
        </View>
      </View>
      <View style={{flex: 2}}>
        <Text
          style={{
            color: 'black',
            marginHorizontal: 20,
            fontSize: 16,
            marginVertical: 20,
          }}>
          Thông tin đơn hàng:
        </Text>
        <View
          style={{
            backgroundColor: '#f4f4f4',
            justifyContent: 'center',
            width: WIDTH__SCREEN * 0.9,
            height: HEIGHT__SCREEN * 0.15,
            marginHorizontal: 20,
          }}>
          <View style={{marginHorizontal: 20}}>
            <Text>Địa chỉ: Tô ký, Tân Chánh Hiệp, Quận 12, Tp.Hồ Chí Minh</Text>
            <Text>Trạng thái: Thành công</Text>
            <Text>Phương thức thanh toán: Tiền mặt</Text>
            <Text>Tổng tiền: 1000</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DetailOrder;

const styles = StyleSheet.create({
  item__container: {
    width: WIDTH__SCREEN * 0.9,
    height: HEIGHT__SCREEN * 0.14,
    backgroundColor: '#f4f4f4',
    marginHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  img__size: {
    width: WIDTH__SCREEN * 0.2,
    height: HEIGHT__SCREEN * 0.1,
    marginHorizontal: 20,
    borderRadius: 4,
  },
});
