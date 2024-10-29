import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import Customheader from '../../CustomHeader/Customheader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {useState} from 'react';

import API__URL from '../../../config';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const ProductDetail = ({navigation, route}) => {
  const {item} = route.params;
  const [quantityProduct, setQuantityProduct] = useState(1);
  // const [priceProduct, setPriceProduct] = useState(0);
  const increaseQuantity = () => {
    setQuantityProduct(prev => prev + 1);
  };
  // const priceProduct = item.price.reduce(
  //   (total, index) => total + index.price * quantityProduct,
  //   setPriceProduct(priceProduct),
  // );
  // Hàm giảm số lượng
  const decreaseQuantity = () => {
    if (quantityProduct > 1) {
      setQuantityProduct(prev => prev - 1);
    } else {
      Alert.alert('Sản phẩm không được dưới 1');
    }
  };
  const addProductCart = async item => {
    const userId = await AsyncStorage.getItem('userId');
    const newUserId = JSON.parse(userId);
    const product = {
      userId: newUserId,
      productId: item._id,
      images: item.images[0],
      nameProduct: item.name,
      quantity: quantityProduct,
      price: item.price,
    };
    try {
      const respone = await axios.post(
        `${API__URL}/carts/addItemcart`,
        product,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      if (respone.data) {
        Alert.alert('Thêm sản phẩm thành công');
      }
    } catch (error) {
      console.log('Lỗi ', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Customheader leftIcon={require('../../../assets/imgs/back3.png')} />
      </View>
      <View style={{flex: 6}}>
        <Image
          style={styles.img__product}
          // source={require('../../../assets/imgs/profile.png')}
          source={{uri: item.images[0]}}
        />
        <Text style={styles.txt__nameProduct}>{item.name}</Text>
        <Text style={styles.txt__priceProduct}>{item.price}</Text>
        <View style={{flexDirection: 'column', flex: 2}}>
          <TouchableOpacity disabled style={styles.btn__container}>
            <View style={styles.quantity__Container}>
              <Text>kích cỡ</Text>
            </View>
            <Text style={styles.txt__nameProduct}>{item.size}</Text>
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
            <TouchableOpacity onPress={increaseQuantity}>
              <Image
                style={styles.icon}
                source={require('../../../assets/imgs/add.png')}
              />
            </TouchableOpacity>
            <Text style={{marginHorizontal: 5}}>{quantityProduct}</Text>
            <TouchableOpacity onPress={decreaseQuantity}>
              <Image
                style={styles.icon}
                source={require('../../../assets/imgs/minus2.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.txt__description}>{item.description}</Text>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={styles.btn__buy}
          onPress={() => addProductCart(item)}>
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
    height: HEIGHT__SCREEN * 0.08,
    backgroundColor: 'black',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    height: HEIGHT__SCREEN * 0.08,
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
