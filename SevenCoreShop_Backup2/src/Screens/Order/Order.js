import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import axios from 'axios';

const getProductDetails = async productId => {
  try {
    const response = await axios.get(
      `http://192.168.1.8:7777/products/${productId}`,
    );
    return response.data.data; // Trả về dữ liệu sản phẩm chi tiết
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    return null;
  }
};

const Order = ({route}) => {
  const {order} = route.params;
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    console.log('Dữ liệu order nhận được:', order);

    const fetchProductDetails = async () => {
      if (order && order.items && order.items.length > 0) {
        const details = await Promise.all(
          order.items.map(async item => {
            const product = await getProductDetails(item.productId);
            return {...item, product}; // Kết hợp thông tin sản phẩm và số lượng trong đơn hàng
          }),
        );
        setProductDetails(details);
      }
    };

    if (order) {
      fetchProductDetails();
    }
  }, [order]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết đơn hàng</Text>
      {order ? (
        <>
          <Text style={styles.paymentInfo}>
            Phương thức thanh toán: {order.paymentMethod}
          </Text>
          <Text style={styles.paymentInfo}>
            Tổng tiền: {order.totalAmount} VND
          </Text>

          {productDetails.length > 0 ? (
            productDetails.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemName}>
                  Tên sản phẩm:{' '}
                  {item.product ? item.product.name : 'Không có tên sản phẩm'}
                </Text>
                <Text>Số lượng: {item.quantity}</Text>
                <Text>
                  Giá: {item.product ? item.product.price : 'N/A'} VND
                </Text>
              </View>
            ))
          ) : (
            <Text>Không có sản phẩm nào trong đơn hàng.</Text>
          )}
        </>
      ) : (
        <Text>Không có đơn hàng nào được tạo.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Order;
