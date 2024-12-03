import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Customheader from '../../CustomHeader/Customheader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../config';
import {Dimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;

const CartScreen = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [totalPriceCart, setTotalPriceCart] = useState(0);
  const [userId, setUserId] = useState(null);

  const totalPrice = cartItem => {
    const totalCart = cartItem.reduce(
      (total, index) => total + index.price * index.quantity,
      0,
    );
    setTotalPriceCart(totalCart);
  };

  const updateCart = async (productId, quantity) => {
    try {
      if (quantity === 0) {
        clearCart(productId, quantity);
        return;
      }

      const response = await axios.put(`${API__URL}/carts/updateItemCart`, {
        userId,
        productId,
        quantity,
      });
      const updatedItem = response.data.item;

      const updatedCart = cart.map(item =>
        item.productId === productId
          ? {...item, quantity: updatedItem.quantity}
          : item,
      );

      setCart(updatedCart);
      totalPrice(updatedCart);
    } catch (error) {
      console.log('Error updating cart:', error);
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
    setUserId(newUserId);

    const response = await axios.get(
      `${API__URL}/carts/getItemCartById?userId=${newUserId}`,
    );

    setCart(response.data.result);
    totalPrice(response.data.result);
  };

  const clearCart = async (productId, quantity) => {
    try {
      const respone = await axios.delete(`${API__URL}/carts/deleteItemCart`, {
        data: {userId, productId, quantity},
      });
      if (respone.status === 200) {
        setCart(indexCart =>
          indexCart.filter(item => item.productId !== productId),
        );
        setTotalPriceCart(0);
      }
    } catch (error) {
      console.log('Error clearing cart:', error);
    }
  };
  const resetCartOnServer = async () => {
    try {
      for (const item of cart) {
        await axios.delete(`${API__URL}/carts/deleteItemCart`, {
          data: {userId, productId: item.productId, quantity: item.quantity},
        });
      }
      setCart([]);
      setTotalPriceCart(0);
      console.log('Giỏ hàng đã được reset trên server!');
    } catch (error) {
      console.log('Error resetting cart:', error);
      Alert.alert('Lỗi', 'Không thể reset giỏ hàng. Vui lòng thử lại.');
    }
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng trống, vui lòng thêm sản phẩm!');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const parsedUserId = JSON.parse(userId);

      navigation.navigate('PaymentAddressScreen', {
        userID: parsedUserId,
        cartItems: cart,
        totalAmount: totalPriceCart,
      });
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.');
    }
  };

  const deleteAllItemcart = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: () => {
            cart.forEach(element =>
              clearCart(element.productId, element.quantity),
            );
          },
        },
      ],
      {cancelable: false},
    );
  };

  useFocusEffect(
    useCallback(() => {
      getIdUser();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Customheader title="Giỏ hàng" />
      </View>
      {cart.length > 0 ? (
        <View style={{flex: 7}}>
          <TouchableOpacity
            style={styles.removeAllBtn}
            onPress={deleteAllItemcart}>
            <Text style={styles.txt__remove}>Remove All</Text>
          </TouchableOpacity>
          <View style={{flex: 6}}>
            <FlatList
              data={cart}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <View style={styles.cartItemContainer}>
                  <View style={styles.productContainer}>
                    <Image
                      style={styles.imgProduct}
                      source={{uri: item.images[0]}}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.nameProduct}</Text>
                      <Text style={styles.productQuantity}>
                        Quantity: {item.quantity}
                      </Text>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.iconContainer}
                          onPress={() =>
                            handleDecrease(item.productId, item.quantity)
                          }>
                          <Text style={styles.icon}>-</Text>
                        </TouchableOpacity>
                        <Text>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.iconContainer}
                          onPress={() =>
                            handleIncrease(item.productId, item.quantity)
                          }>
                          <Text style={styles.icon}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cartItemActions}>
                    <Text style={styles.productPrice}>{item.price} VND</Text>
                  </View>
                </View>
              )}
              keyExtractor={item => item.productId.toString()}
            />
          </View>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalText}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>{totalPriceCart} VND</Text>
          </View>
          <View style={{flex: 2}}>
            <TouchableOpacity
              style={styles.btnCheckout}
              onPress={handlePayment}>
              <Text style={styles.btnCheckoutText}> Thanh Toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: HEIGHT__SCREEN * 0.8,
          }}>
          <Image source={require('../../../assets/imgs/cart4.png')} />
          <Text
            style={{
              fontSize: 24,
              color: 'Black',
              fontWeight: '700',
              marginTop: 24,
            }}>
            Không có sản phẩm
          </Text>
        </View>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  removeAllBtn: {
    marginTop: 10,
    paddingRight: 20,
    alignSelf: 'flex-end',
  },
  txt__remove: {
    fontSize: 18,
    color: '#FF0000',
    fontWeight: 'bold',
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgProduct: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: WIDTH__SCREEN * 0.5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#555555',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemActions: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  totalPriceContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  btnCheckout: {
    backgroundColor: '#333',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCheckoutText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
