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
  const [paymentMethod, setPaymentMethod] = useState(null);

  const totalPrice = cartItem => {
    const totalCart = cartItem.reduce(
      (total, index) => total + index.price * index.quantity,
      0,
    );
    setTotalPriceCart(totalCart);
  };
  const clearCart2 = () => {
    setCart([]);
  };
  const updateCart = async (productId, quantity) => {
    try {
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
    const respone = await axios.get(
      `${API__URL}/carts/getItemCartById?userId=${newUserId}`,
    );

    setCart(respone.data.result);
    totalPrice(respone.data.result);
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
      console.error('Error clearing cart:', error);
    }
  };
  const resetCartOnServer = async () => {
    try {
      for (const item of cart) {
        await axios.delete(`${API__URL}/carts/deleteItemCart`, {
          data: { userId, productId: item.productId, quantity: item.quantity },
        });
      }
      setCart([]);
      setTotalPriceCart(0);
      console.log('Giỏ hàng đã được reset trên server!');
    } catch (error) {
      console.error('Error resetting cart:', error);
      Alert.alert('Lỗi', 'Không thể reset giỏ hàng. Vui lòng thử lại.');
    }
  };

  // const handleCheckout = async () => {
  //   if (!paymentMethod) {
  //     Alert.alert('Thông báo', 'Bạn phải chọn phương thức thanh toán!');
  //     return false;
  //   }

  //   try {
  //     const response = await axios.post(`${API__URL}/Orders/checkout`, {
  //       userId: userId,
  //       items: cart,
  //       paymentMethod: paymentMethod || 'COD',
  //     });

  //     if (response.status === 200) {
  //       const order = response.data.order;
  //       const detailedItems = await Promise.all(
  //         order.items.map(async item => {
  //           const productResponse = await axios.get(
  //             `${API__URL}/products/${item.productId}`,
  //           );
  //           const productData = productResponse.data.data;

  //           return {
  //             ...item,
  //             name: productData.name,
  //             images: productData.images[0],
  //             price: productData.price,
  //           };
  //         }),
  //       );

  //       const productDetails = detailedItems
  //         .map(item => `- ${item.name}: ${item.price} VND x ${item.quantity}`)
  //         .join('\n');

  //       const message = response.data.message || 'Thanh toán thành công!';
  //       const orderId = order._id || 'Không có mã đơn hàng';

  //       Alert.alert(
  //         'Thông báo',
  //         'Thanh toán thành công',
  //         [
  //           {
  //             text: 'OK',
  //             onPress: () => {
  //               navigation.navigate('OrderScreen', {order});
  //             },
  //           },
  //         ],
  //         {cancelable: false},
  //       );

  //       // Clear toàn bộ giỏ hàng sau khi thanh toán
  //       for (let item of cart) {
  //         await clearCart(item.productId, item.quantity); // Xóa
  //       }

  //       // Reset lại tổng giá trị và phương thức thanh toán
  //       setTotalPriceCart(0);
  //       setPaymentMethod(null); // Reset phương thức thanh toán
  //     }
  //   } catch (error) {
  //     console.error(
  //       'Lỗi khi thanh toán:',
  //       error.response ? error.response.data : error,
  //     );
  //     Alert.alert(
  //       'Lỗi',
  //       error.response?.data?.message ||
  //         'Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.',
  //     );
  //   }
  // };
  const handlePayment = async () => {
  if (cart.length === 0) {
    Alert.alert('Thông báo', 'Giỏ hàng trống, vui lòng thêm sản phẩm!');
    return;
  }

  if (paymentMethod !== 'COD') {
    Alert.alert('Thông báo', 'Bạn phải chấp nhận đơn hàng trước khi thanh toán!');
    return;
  }

  try {
    // Lấy userId từ AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    const parsedUserId = JSON.parse(userId);

    // Chuyển hướng sang màn hình PaymentAddressScreen
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

  useFocusEffect(
    useCallback(() => {
      getIdUser();
    }, []),
  );
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
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Customheader title="Giỏ hàng" 
        />
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
                    </View>
                  </View>
                  <View style={styles.cartItemActions}>
                    <Text style={styles.productPrice}>{item.price} VND</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        onPress={() =>
                          handleIncrease(item.productId, item.quantity)
                        }>
                        <Image
                          source={require('../../../assets/imgs/add.png')}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleDecrease(item.productId, item.quantity)
                        }
                        style={styles.iconContainer}>
                        <Image
                          source={require('../../../assets/imgs/minus2.png')}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={item => item.productId.toString()}
            />
          </View>
          <View style={styles.paymentMethodContainer}>
            <Text style={styles.paymentMethodTitle}>
            Xác nhận đơn hàng
            </Text>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setPaymentMethod('COD')}>
              <View
                style={[
                  styles.radioButton,
                  paymentMethod === 'COD' && styles.radioButtonSelected,
                ]}>
                {paymentMethod === 'COD' && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
              <Text style={styles.paymentMethodText}>
              Chấp nhận mua hàng
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalText}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>{totalPriceCart} VND</Text>
          </View>
          <View style={{flex: 2}}>
                    <TouchableOpacity
                    style={styles.btnCheckout}
                    onPress={handlePayment}>
                    <Text style={styles.btnCheckoutText}>Tiến Hành Thanh Toán</Text>
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
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productQuantity: {
    fontSize: 14,
    color: '#555',
  },
  cartItemActions: {
    alignItems: 'flex-end',
    flex: 1,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    marginTop: 10,
  },
  iconContainer: {
    marginHorizontal: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  paymentMethodContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#4CAF50',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    flex: 1,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
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


