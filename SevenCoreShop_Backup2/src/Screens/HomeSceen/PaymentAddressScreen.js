import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import API_URL from '../../../config';

const PaymentAddressScreen = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  const cartItems = route.params?.cartItems || [];
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const userID = route.params?.userID;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!userID) throw new Error('UserID is required');
        const response = await axios.get(`${API_URL}/users/${userID}/address`);
        const data = response.data?.address;

        let formattedData = [];
        if (Array.isArray(data)) {
          formattedData = data;
        } else if (typeof data === 'string') {
          formattedData = [{ _id: '1', name: 'Mặc định', address: data }];
        } else {
          console.error('API trả về dữ liệu không hợp lệ:', response.data);
          throw new Error('Invalid data format from API');
        }

        setAddresses(formattedData);
      } catch (error) {
        console.error('Error fetching addresses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userID]);

  const handlePayment = () => {
    if (!selectedAddress) {
      Alert.alert('Thông báo', 'Vui lòng chọn một địa chỉ giao hàng!');
      return;
    }
    if (!paymentMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán!');
      return;
    }
    navigation.navigate('PaymentMethod', {
      selectedAddress,
      paymentMethod,
      cartItems,
      totalAmount,
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Phần địa chỉ */}
      <Text style={styles.sectionHeader}>Chọn Địa Chỉ Giao Hàng</Text>
      {addresses.map((address) => (
        <TouchableOpacity
          key={address._id}
          style={[
            styles.addressCard,
            selectedAddress?._id === address._id && styles.selectedCard,
          ]}
          onPress={() => setSelectedAddress(address)}
        >
          <View style={styles.addressContent}>
            <Icon name="location-on" size={24} color="#000" />
            <View style={styles.addressDetails}>
              <Text style={styles.addressName}>{address.name || 'Không có tên'}</Text>
              <Text style={styles.addressText}>{address.address || 'Không có địa chỉ'}</Text>
            </View>
          </View>
          <Text style={styles.selectText}>
            {selectedAddress?._id === address._id ? 'Đã chọn' : 'Chọn'}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Phần phương thức thanh toán */}
      <Text style={styles.sectionHeader}>Chọn Phương Thức Thanh Toán</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'Tiền mặt' && styles.selectedPayment,
          ]}
          onPress={() => setPaymentMethod('Tiền mặt')}
        >
          <Text style={styles.paymentOptionText}>
            {paymentMethod === 'Tiền mặt' ? '✅ Tiền mặt' : 'Tiền mặt'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'MoMo' && styles.selectedPayment,
          ]}
          onPress={() => setPaymentMethod('MoMo')}
        >
          <Text style={styles.paymentOptionText}>
            {paymentMethod === 'MoMo' ? '✅ MoMo' : 'MoMo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Phần thông tin giỏ hàng */}
      <Text style={styles.sectionHeader}>Thông Tin Giỏ Hàng</Text>
           {cartItems.map((item, index) => {
          console.log('Item.images[0]', item.image);
          return (
            <View key={index} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.cartItemImage} />
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemQuantity}>Số lượng: {item.quantity}</Text>
                <Text style={styles.cartItemPrice}>
                  {item.price * item.quantity} VNĐ
                </Text>
              </View>
            </View>
          );
        })}
      <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountText}>Tổng Tiền: {totalAmount} VNĐ</Text>
      </View>

      {/* Nút thanh toán */}
      <TouchableOpacity style={styles.checkoutButton} onPress={handlePayment}>
        <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentAddressScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  addressCard: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#4CAF50',
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressDetails: {
    marginLeft: 10,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 14,
    color: '#555',
  },
  selectText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  paymentOption: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    width: '45%',
    alignItems: 'center',
  },
  selectedPayment: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  paymentOptionText: {
    fontSize: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemDetails: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#555',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#333',
  },
  totalAmountContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
