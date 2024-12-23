import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Customheader from '../../CustomHeader/Customheader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../config';
import axios from 'axios';

const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const DetailOrder = ({route}) => {
  const {item} = route.params;
  const [DetailOrder, setDetailOrder] = useState([]);
  const getOrderDetail = () => {
    setDetailOrder(item);
  };
  console.log(
    DetailOrder?.address?.[0]?.addressDetail || 'No address detail found',
  );

  useEffect(() => {
    getOrderDetail();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../assets/imgs/back4.png')}
          title={item.items[0].name}
        />
      </View>
      <View style={{flex: 4}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={DetailOrder.items}
          renderItem={({item}) => {
            return (
              <View style={styles.item__container}>
                <Image style={styles.img__size} source={{uri: item.image[0]}} />
                <View>
                  <Text style={{width: WIDTH__SCREEN * 0.6}}>{item.name}</Text>
                  <Text>Số lượng : {item.quantity}</Text>
                  <Text>Đơn giá : {item.price}</Text>
                </View>
              </View>
            );
          }}
          keyExtractor={item => item._id}
        />
      </View>

      <View style={{flex: 3}}>
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
            <Text>
              Địa chỉ:
              {DetailOrder?.address?.[0]?.addressDetail || 'Không có địa chỉ'}
            </Text>
            <Text>
              Số điện thoại:
              {DetailOrder?.address?.[0].phoneAddress ||
                'Không có số điện thoại'}
            </Text>
            <Text>Trạng thái: {DetailOrder.status}</Text>
            <Text>Phương thức thanh toán: {DetailOrder.paymentMethod} </Text>
            <Text>Tổng tiền: {DetailOrder.totalAmount} VNĐ</Text>
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
    marginVertical: 20,
  },
  img__size: {
    width: WIDTH__SCREEN * 0.2,
    height: HEIGHT__SCREEN * 0.1,
    marginHorizontal: 20,
    borderRadius: 4,
  },
});
