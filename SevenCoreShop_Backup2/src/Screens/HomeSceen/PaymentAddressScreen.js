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

  const handlePayment = async () => {
    if (!selectedAddress) {
      Alert.alert('Thông báo', 'Vui lòng chọn một địa chỉ giao hàng!');
      return;
    }
    if (!paymentMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán!');
      return;
    }
  
    const orderData = {
      userId: userID,
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.nameProduct,
        quantity: item.quantity,
        price: item.price,
        image: item.images[0], 
      })),
      totalAmount,
      address: selectedAddress.address,
      paymentMethod,
    };
  
    try {
      // Gửi yêu cầu thanh toán
      const response = await axios.post(`${API_URL}/Orders/checkout`, orderData);
  
      if (response.status === 201) {
        // Xóa toàn bộ giỏ hàng
        await resetCartOnServer(cartItems);
  
        Alert.alert('Thông báo', 'Đặt hàng thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      Alert.alert('Lỗi', 'Không thể hoàn tất thanh toán. Vui lòng thử lại sau.');
    }
  };
  
  const resetCartOnServer = async (cartItems) => {
    try {
      for (const item of cartItems) {
        await axios.delete(`${API_URL}/carts/deleteItemCart`, {
          data: {
            userId: userID,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
      console.log('Giỏ hàng đã được reset trên server!');
    } catch (error) {
      console.error('Lỗi khi reset giỏ hàng:', error);
      Alert.alert('Lỗi', 'Không thể reset giỏ hàng. Vui lòng thử lại.');
    }
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
      {/* Nút quay lại */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Image 
          source={require('../../../assets/imgs/back4.png')} 
          style={styles.backIcon} 
        />
      </TouchableOpacity>

      {/* Phần địa chỉ */}
      <Text style={styles.sectionHeader}>Chọn Địa Chỉ Giao Hàng</Text>
      {addresses.map((address) => (
        <TouchableOpacity
          key={address._id}
          style={[styles.addressCard, selectedAddress?._id === address._id && styles.selectedCard]}
          onPress={() => setSelectedAddress(address)}
        >
          <View style={styles.addressContent}>
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
          style={[styles.paymentOption, paymentMethod === 'Tiền mặt' && styles.selectedPayment]}
          onPress={() => setPaymentMethod('Tiền mặt')}
        >
          <Text style={styles.paymentOptionText}>
            {paymentMethod === 'Tiền mặt' ? '✅ Tiền mặt' : 'Tiền mặt'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'MoMo' && styles.selectedPayment]}
          onPress={() => setPaymentMethod('MoMo')}
        >
          <Text style={styles.paymentOptionText}>
            {paymentMethod === 'MoMo' ? '✅ MoMo' : 'MoMo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Phần thông tin giỏ hàng */}
      <Text style={styles.sectionHeader}>Thông Tin Giỏ Hàng</Text>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.cartItem}>
          <Image source={{ uri: item.images[0] }} style={styles.cartItemImage} />
          <View style={styles.cartItemDetails}>
            <Text style={styles.cartItemName}>{item.nameProduct}</Text>
            <Text style={styles.cartItemQuantity}>Số lượng: {item.quantity}</Text>
            <Text style={styles.cartItemPrice}>
              {item.price * item.quantity} VNĐ
            </Text>
          </View>
        </View>
      ))}
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
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
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
    marginTop: 50,
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
    color: '#008001',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentOption: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPayment: {
    borderColor: '#4CAF50',
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmountContainer: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#008001',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
