import {StyleSheet, Text, View, Alert} from 'react-native';
import React from 'react';
import API__URL from '../../../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useContext,
  useEffect,
  useState,
  createContext,
  useCallback,
} from 'react';
const CartContext = createContext();
export const CartProdvider = ({children}) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [totalPriceCart, setTotalPriceCart] = useState(0);
  const [dataOrder, setDataOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getDataCart = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const newUserId = JSON.parse(userId);
      setUserId(newUserId);
      const response = await axios.get(
        `${API__URL}/carts/getItemCartById?userId=${newUserId}`,
      );
      const clearData = response.data.result[0].cartItems;

      setCart(clearData);
      setTotalPriceCart(response.data.data);
    } catch (error) {
      console.log(error);
    }
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

  const updateCart = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        Alert.alert(
          'Xác nhận xóa sản phẩm',
          'Số lượng sản phẩm nhỏ hơn hoặc bằng 0. Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
          [
            {
              text: 'Hủy',
              onPress: () => console.log('Hủy bỏ'),
              style: 'cancel',
            },
            {
              text: 'Xóa',
              onPress: async () => {
                try {
                  const updatedCart = cart.filter(
                    item => item.productId !== productId,
                  );
                  setCart(updatedCart);

                  const totalCart = updatedCart.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  );
                  setTotalPriceCart(totalCart);
                  await axios.put(`${API__URL}/carts/updateItemCart`, {
                    userId,
                    productId,
                    quantity,
                  });
                  Alert.alert('Sản phẩm đã bị xóa khỏi giỏ hàng!');
                } catch (error) {
                  console.log('Error removing item:', error);
                }
              },
            },
          ],
        );
      } else {
        const updatedCart = cart.map(item =>
          item.productId === productId ? {...item, quantity} : item,
        );
        setCart(updatedCart);
        const totalCart = updatedCart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
        setTotalPriceCart(totalCart);
        await axios.put(`${API__URL}/carts/updateItemCart`, {
          userId,
          productId,
          quantity,
        });
      }
    } catch (error) {
      console.log('Error updating cart:', error);
    }
  };

  const resetCart = async () => {
    try {
      const response = await axios.delete(`${API__URL}/carts/resetCart`, {
        data: {userId},
      });
      if (response.status === 200) {
        setCart([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProductDetails = async () => {
    if (loading) {
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} color="orange" />;
      </View>;
    }
    if (error) {
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>
          Có lỗi trong lúc lấy dữ liệu... Vui lòng kiểm tra lại kết nối !!
        </Text>
      </View>;
    }
    try {
      const userId = await AsyncStorage.getItem('userId');
      const newUserId = JSON.parse(userId);
      const response = await axios.get(
        `${API__URL}/Orders/getOrderUserById?userId=${newUserId}`,
      );

      setLoading(false);
      setDataOrder(response.data);
    } catch (error) {
      console.log('Lỗi khi lấy thông tin sản phẩm:', error);
      setError(error);
      setLoading(false);
      return null;
    }
  };
  useEffect(() => {
    getDataCart();
    getProductDetails();
  }, []);

  return (
    <CartContext.Provider
      value={{
        getDataCart,
        cart,
        setCart,
        setUserId,
        totalPriceCart,
        setTotalPriceCart,
        clearCart,
        updateCart,
        userId,
        setUserId,
        resetCart,
        getProductDetails,
        dataOrder,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProdvider;
