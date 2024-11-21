import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(`http://192.168.1.3:7777/products/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    return null;
  }
};

const Order = ({ route }) => {
  // const { order } = route.params;
  const order = route?.params?.order;
  const [orders, setOrders] = useState([]);
  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (order && order.items && order.items.length > 0) {
        const details = await Promise.all(
          order.items.map(async (item) => {
            const product = await getProductDetails(item.productId);
            return { ...item, product };
          })
        );
        setOrders((prevOrders) => [...prevOrders, { ...order, details }]);
      }
    };

    fetchOrderDetails();
  }, [order]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lịch sử các đơn hàng</Text>
      {orders.length > 0 ? (
        orders.map((order, orderIndex) => (
          <View key={orderIndex} style={styles.orderContainer}>
            <Text style={styles.orderTitle}>Đơn hàng {orderIndex + 1}</Text>
            <Text style={styles.paymentInfo}>Phương thức thanh toán: {order.paymentMethod}</Text>
            <Text style={styles.paymentInfo}>Tổng tiền: {order.totalAmount} VND</Text>
            {order.details.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.itemContainer}>
                <Text style={styles.itemName}>
                  Tên sản phẩm: {item.product ? item.product.name : 'Không có tên sản phẩm'}
                </Text>
                <Text>Số lượng: {item.quantity}</Text>
                <Text>Giá: {item.product ? item.product.price : 'N/A'} VND</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có đơn hàng</Text>
        </View>
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
  orderContainer: {
    marginBottom: 25,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Order;
