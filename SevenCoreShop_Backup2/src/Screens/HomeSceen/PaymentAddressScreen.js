import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import API_URL from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCart} from '../Cart/CartProdvider';
import {useFocusEffect} from '@react-navigation/native';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const PaymentAddressScreen = ({navigation, route}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const {resetCart} = useCart();
  const cartItems = route.params?.cartItems || [];
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const userID = route.params?.userID;

  useFocusEffect(
    useCallback(() => {
      const fetchAddresses = async () => {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const newUserEmail = JSON.parse(userEmail);
        try {
          const response = await axios.get(
            `${API_URL}/users/getUserEmail/?email=${newUserEmail}`,
          );
          const data = response.data.data.address;
          const newData = data.filter(item => item.isDefault === true);
          setAddresses(newData);
        } catch (error) {
          console.error('Error fetching addresses:', error.message);
          Alert.alert('Lỗi', 'Không thể tải địa chỉ giao hàng.');
        } finally {
          setLoading(false);
        }
      };
      fetchAddresses();
    }, []),
  );


  const [dataCode, setDataCode] = useState(null);

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
      address: selectedAddress,
      paymentMethod,
    };
    try {
      const response = await axios.post(
        `${API_URL}/Orders/checkout`,
        orderData,
      );
      console.clear();
      let codes = response.data.code;
      if (response.status === 201) {
        resetCart();
        await setDataCode(response.data.code);
        Alert.alert('Thông báo', 'Đặt hàng thành công!');
        navigation.navigate('Tab');
        if (paymentMethod === 'Ngân Hàng') {
          navigation.navigate('QRPay', {totalAmount,codes });
          return;
        }
      } else {
        throw new Error('Thanh toán không thành công.');
      }
    } catch (error) {
      if (error.response) {
        console.log('Chi tiết lỗi từ server:', error.response.data);
        Alert.alert(
          'Lỗi',
          error.response.data?.message || 'Không thể hoàn tất thanh toán.',
        );
      } else {
        console.error('Lỗi không xác định:', error.message);
        Alert.alert(
          'Lỗi',
          'Không thể hoàn tất thanh toán. Vui lòng thử lại sau.',
        );
      }
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../assets/imgs/back4.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Giao Hàng</Text>

      {addresses.length > 0 ? (
        addresses.map(addressItem => (
          <TouchableOpacity
            key={addressItem._id}
            style={[
              styles.addressCard,
              selectedAddress?._id === addressItem._id && styles.selectedCard,
            ]}
            onPress={() => setSelectedAddress(addressItem)}>
            <View style={styles.addressContent}>
              <View style={styles.addressDetails}>
                <Text style={styles.addressText}>
                  {addressItem.userNameAddress}|| {addressItem.phoneAddress}
                </Text>
                <Text style={styles.addressText}>
                  {addressItem.addressDetail || 'Không có địa chỉ'},
                  {addressItem.ward},{addressItem.district},
                  {addressItem.province}
                </Text>
              </View>
            </View>
            <Text style={styles.selectText}>
              {selectedAddress?._id === addressItem._id ? 'Đã chọn' : 'Chọn'}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
            <Text style={{fontSize: 16, fontWeight: '800'}}>
              Chưa có địa chỉ giao hàng, nhấn vào để thêm
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionHeader}>Chọn Phương Thức Thanh Toán</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'Tiền mặt' && styles.selectedPayment,
          ]}
          onPress={() => setPaymentMethod('Tiền mặt')}>
          <Text style={styles.paymentOptionText}>
            {paymentMethod === 'Tiền mặt' ? '✅ Tiền mặt' : 'Tiền mặt'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'Ngân Hàng' && styles.selectedPayment,
          ]}
          onPress={() => setPaymentMethod('Ngân Hàng')}>
          <Text style={styles.paymentOptionText}>
            {paymentMethod === 'Ngân Hàng' ? '✅ Ngân Hàng' : 'Ngân Hàng'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Thông Tin Giỏ Hàng</Text>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.cartItem}>
          <Image source={{uri: item.images[0]}} style={styles.cartItemImage} />
          <View style={styles.cartItemDetails}>
            <Text style={styles.cartItemName}>{item.nameProduct}</Text>
            <Text style={styles.cartItemQuantity}>
              Số lượng: {item.quantity}
            </Text>
            <Text style={styles.cartItemPrice}>
              đ{item.price * item.quantity} 
            </Text>
          </View>
        </View>
      ))}
      <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountText}>Tổng Tiền: đ{totalAmount}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handlePayment}>
        <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

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
    shadowOffset: {width: 0, height: 2},
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
    width: WITH__Screen * 0.6,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPayment: {
    backgroundColor: '#DFF8E5',
    borderColor: '#4CAF50',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bankOption: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedBankOption: {
    backgroundColor: '#DFF8E5',
    borderColor: '#4CAF50',
  },
  bankOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  bankDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  bankDetailsText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  bankImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
    marginTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  cartItemDetails: {
    flex: 1,
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
    color: '#FF5722',
  },
  totalAmountContainer: {
    marginVertical: 16,
    paddingVertical: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    alignItems: 'center',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PaymentAddressScreen;
