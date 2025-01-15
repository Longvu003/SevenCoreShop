import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Customheader from '../../CustomHeader/Customheader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCart} from './CartProdvider';
import CartStyle from '../../StyleSheets/CartStyle';
const CartScreen = () => {
  const navigation = useNavigation();
  const {
    cart,
    getDataCart,
    setCart,
    totalPriceCart,
    setTotalPriceCart,
    clearCart,
    updateCart,
    userId,
  } = useCart();

  const handleIncrease = async (productId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateCart(productId, newQuantity);
  };

  const handleDecrease = async (productId, currentQuantity) => {
    const newQuantity = currentQuantity - 1;
    updateCart(productId, newQuantity);
  };

  const handlePayment = async () => {
    try {
      navigation.navigate('PaymentAddressScreen', {
        userID: userId,
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
      getDataCart();
    }, []),
  );

  return (
    <View style={CartStyle.container}>
      <View style={{flex: 0.5}}>
        <Customheader title="Giỏ hàng" />
      </View>
      {cart.length > 0 ? (
        <View style={{flex: 9}}>
          <TouchableOpacity
            style={CartStyle.removeAllBtn}
            onPress={deleteAllItemcart}>
            <Text style={CartStyle.txt__remove}>Xóa tất cả</Text>
          </TouchableOpacity>
          <View style={{flex: 6}}>
            <FlatList
              data={cart}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <View style={CartStyle.cartItemContainer}>
                    <View style={CartStyle.productContainer}>
                      <Image
                        style={CartStyle.imgProduct}
                        source={{uri: item.images[0]}}
                      />
                      <View style={CartStyle.productInfo}>
                        <Text style={CartStyle.productName}>
                          {item.nameProduct}
                        </Text>
<Text style={CartStyle.productQuantity}>
                          Quantity: {item.quantity}
                        </Text>
                        <View style={CartStyle.quantityControls}>
                          <TouchableOpacity
                            style={CartStyle.iconContainer}
                            onPress={() =>
                              handleDecrease(item.productId, item.quantity)
                            }>
                            <Text style={CartStyle.icon}>-</Text>
                          </TouchableOpacity>
                          <Text>{item.quantity}</Text>
                          <TouchableOpacity
                            style={CartStyle.iconContainer}
                            onPress={() =>
                              handleIncrease(item.productId, item.quantity)
                            }>
                            <Text style={CartStyle.icon}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={CartStyle.cartItemActions}>
                      <Text style={CartStyle.productPrice}>{item.price}</Text>
                    </View>
                  </View>
                );
              }}
              keyExtractor={item => item._id}
            />
          </View>
          <View style={CartStyle.totalPriceContainer}>
            <Text style={CartStyle.totalText}>Tổng cộng</Text>
            <Text style={CartStyle.totalAmount}>{totalPriceCart} VND</Text>
          </View>
          <View style={{flex: 2}}>
            <TouchableOpacity
              style={CartStyle.btnCheckout}
              onPress={handlePayment}>
              <Text style={CartStyle.btnCheckoutText}> Thanh Toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={CartStyle.container__nodata}>
          <Image source={require('../../../assets/imgs/cart4.png')} />
          <Text style={CartStyle.txt__nodata}>Không có sản phẩm</Text>
        </View>
      )}
    </View>
  );
};
export default CartScreen;