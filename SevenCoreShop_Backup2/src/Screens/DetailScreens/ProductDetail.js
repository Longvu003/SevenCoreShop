import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Customheader from '../../CustomHeader/Customheader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {useState} from 'react';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const ProductDetail = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Customheader leftIcon={require('../../../assets/imgs/back3.png')} />
      </View>
      <View style={{flex: 5}}>
        <Image
          style={styles.img__product}
          source={require('../../../assets/imgs/profile.png')}
        />
        <Text style={styles.txt__nameProduct}>Áo khoác mùa đông</Text>
        <Text style={styles.txt__priceProduct}>12300vnd</Text>
        <View style={{flexDirection: 'column', flex: 2}}>
          <TouchableOpacity disabled style={styles.btn__container}>
            <View style={styles.quantity__Container}>
              <Text>kích cỡ</Text>
            </View>

            <Text style={styles.txt__nameProduct}>s</Text>
            <TouchableOpacity>
              <Image
                style={{marginHorizontal: 30}}
                source={require('../../../assets/imgs/arrowdown2.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity disabled style={styles.btn__container}>
            <View style={styles.quantity__Container}>
              <Text>Số lượng</Text>
            </View>
            <TouchableOpacity>
              <Image
                style={styles.icon}
                source={require('../../../assets/imgs/add.png')}
              />
            </TouchableOpacity>

            <Text style={{marginHorizontal: 5}}>s</Text>
            <TouchableOpacity>
              <Image
                style={styles.icon}
                source={require('../../../assets/imgs/minus2.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.txt__description}>Đây là sản phẩm chất lượng</Text>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.btn__buy}>
          <Text style={styles.txt__btnbuy}>123.000vnđ</Text>
          <Text style={styles.txt__btnbuy}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  txt__description: {
    marginVertical: 20,
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 20,
  },
  txt__btnbuy: {
    fontSize: 15,
    color: 'white',
  },
  btn__buy: {
    width: WIDTH__SCREEN * 1,
    height: HEIGHT__SCREEN * 0.09,
    backgroundColor: 'black',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
  },
  quantity__Container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  btn__container: {
    width: WIDTH__SCREEN * 1,
    height: HEIGHT__SCREEN * 0.09,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 20,
    marginTop: 20,
  },

  txt__priceProduct: {
    fontSize: 15,
    color: '#A2845E',
    fontWeight: '600',
  },
  txt__nameProduct: {
    fontSize: 20,
    color: 'black',
    fontWeight: '800',
    marginVertical: 10,
  },
  img__product: {
    width: WIDTH__SCREEN * 1,
    height: HEIGHT__SCREEN * 0.3,
  },
});