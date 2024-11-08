import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Customheader from '../../CustomHeader/Customheader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../config';
import {Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
import {useFocusEffect} from '@react-navigation/native';
const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [totalPriceCart, setTotalPriceCart] = useState();
  const totalPrice = async cartItem => {
    const totalCart = cartItem.reduce(
      (total, index) => total + index.price * index.quantity,
      0,
    );
    setTotalPriceCart(totalCart);
  };
  const updateCart = async (productId, quantity) => {
    const userId = await AsyncStorage.getItem('userId');
    const newUserId = JSON.parse(userId);
    try {
      const respone = await axios.put(`${API__URL}/carts/updateItemCart`, {
        userId: newUserId,
        productId,
        quantity,
      });
      const dataCart = respone.data.item;
      const renderItemCart = cart.map(item =>
        item.productId === productId ? dataCart : item,
      );
      setCart(renderItemCart);
      setTotalPriceCart(respone.data.totalPrice);
    } catch (error) {
      console.log(error);
    }
  };
  const handleIncrease = (productId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateCart(productId, newQuantity);
  };

  const handleDecrease = (productId, currentQuantity) => {
    const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;
    updateCart(productId, newQuantity);
  };
  const getIdUser = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const newUserId = JSON.parse(userId);
    const respone = await axios.get(
      `${API__URL}/carts/getItemCartById?id=${newUserId}`,
    );
    // const fixRespone = Object.values(respone.data.result);
    setCart(respone.data.result);
    totalPrice(respone.data.result);
  };

  const clearCart = async (productId, quantity) => {
    const userId = await AsyncStorage.getItem('userId');
    const newUserId = JSON.parse(userId);
    try {
      const respone = await axios.delete(`${API__URL}/carts/deleteItemCart`, {
        data: {userId: newUserId, productId, quantity},
      });
      if (respone.status === 200) {
        setCart(indexCart =>
          indexCart.filter(item => item.productId !== productId),
        );
        setTotalPriceCart(0);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getIdUser();
    }, []),
  );
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../assets/imgs/back4.png')}
          title="Giỏ hàng"
        />
      </View>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <TouchableOpacity
          onPress={() => {
            if (cart.length >= 1) {
              Alert.alert(
                'Xóa sản phẩm !',
                'Bạn muốn xóa hết sản phẩm trong giỏ hàng ?',
                [
                  {text: 'Không', onPress: () => console.log('Không')},
                  {
                    text: 'Xác nhận',
                    onPress: () =>
                      cart.forEach(element =>
                        clearCart(element.productId, element.quantity),
                      ),
                  },
                ],
              );
            } else {
              Alert.alert('Không có sản phẩm để xóa');
            }
          }}>
          <Text style={styles.txt__remove}>Remove All</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 6}}>
        <FlatList
          data={cart}
          renderItem={({item}) => {
            return (
              <View style={styles.product__container}>
                <View style={styles.item__container}>
                  <Image
                    style={styles.img__product}
                    source={{uri: item.images[0]}}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.txt__remove}>{item.nameProduct}</Text>
                    <Text style={styles.txt__remove}>{item.quantity}</Text>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={styles.txt__remove}>{item.price}</Text>

                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() =>
                          handleIncrease(item.productId, item.quantity)
                        }>
                        <Image
                          source={require('../../../assets/imgs/add.png')}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleDecrease(item.productId, item.quantity)
                        }
                        style={{marginHorizontal: 20}}>
                        <Image
                          source={require('../../../assets/imgs/minus2.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}>
        <Text style={styles.txt__price}>Total</Text>
        <Text style={styles.txt__price}>{totalPriceCart}</Text>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.btn__buy}>
          <Text style={styles.txt__buy}>Mua</Text>
        </TouchableOpacity>
      </View>
    </View>

    //  <View>
    //   <Text>
    //     Nodata in cart
    //   </Text>

    //   </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  txt__price: {
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
  },
  product__container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    flexDirection: 'row',
    height: HEIGHT__SCREEN * 0.13,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: WIDTH__SCREEN * 0.9,
    marginHorizontal: 20,
  },
  txt__buy: {
    fontSize: 16,
    color: 'white',
  },
  btn__buy: {
    backgroundColor: 'black',
    width: WIDTH__SCREEN * 0.9,
    height: HEIGHT__SCREEN * 0.08,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },

  item__container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 10,
    alignItems: 'center',
  },

  img__product: {
    width: 90,
    height: 90,
  },

  txt__remove: {
    fontSize: 16,
    color: 'black',
    marginRight: 20,
  },
});
