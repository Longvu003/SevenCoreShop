import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import axios from 'axios';
import API_URL from '../../../config';
import {useCart} from '../Cart/CartProdvider';
import PaymentAddressStyle from '../../StyleSheets/PaymentAddressStyle';
const PaymentAddressScreen = ({navigation, route}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const cartItems = route.params?.cartItems || [];
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const userID = route.params?.userID;
  const {resetCart} = useCart();
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
          formattedData = [{_id: '1', name: 'Mặc định', address: data}];
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
      const response = await axios.post(
        `${API_URL}/Orders/checkout`,
        orderData,
      );
      if (response.status === 201) {
        resetCart();
        Alert.alert('Thông báo', 'Đặt hàng thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      Alert.alert(
        'Lỗi',
        'Không thể hoàn tất thanh toán. Vui lòng thử lại sau.',
      );
    }
  };

  if (loading) {
    return (
      <View style={PaymentAddressStyle.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={PaymentAddressStyle.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={PaymentAddressStyle.container}>
      {/* Nút quay lại */}
      <TouchableOpacity
        style={PaymentAddressStyle.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../assets/imgs/back4.png')}
          style={PaymentAddressStyle.backIcon}
        />
      </TouchableOpacity>

      {/* Phần địa chỉ */}
      <Text style={PaymentAddressStyle.sectionHeader}>
        Chọn Địa Chỉ Giao Hàng
      </Text>
      {addresses.map(address => (
        <TouchableOpacity
          key={address._id}
          style={[
            PaymentAddressStyle.addressCard,
            selectedAddress?._id === address._id &&
              PaymentAddressStyle.selectedCard,
          ]}
          onPress={() => setSelectedAddress(address)}>
          <View style={PaymentAddressStyle.addressContent}>
            <View style={PaymentAddressStyle.addressDetails}>
              <Text style={PaymentAddressStyle.addressName}>
                {address.name || 'Không có tên'}
              </Text>
              <Text style={PaymentAddressStyle.addressText}>
                {address.address || 'Không có địa chỉ'}
              </Text>
            </View>
          </View>
          <Text style={PaymentAddressStyle.selectText}>
            {selectedAddress?._id === address._id ? 'Đã chọn' : 'Chọn'}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Phần phương thức thanh toán */}
      <Text style={PaymentAddressStyle.sectionHeader}>
        Chọn Phương Thức Thanh Toán
      </Text>
      <View style={PaymentAddressStyle.paymentOptions}>
        <TouchableOpacity
          style={[
            PaymentAddressStyle.paymentOption,
            paymentMethod === 'Tiền mặt' && PaymentAddressStyle.selectedPayment,
          ]}
          onPress={() => setPaymentMethod('Tiền mặt')}>
          <Text style={PaymentAddressStyle.paymentOptionText}>
            {paymentMethod === 'Tiền mặt' ? '✅ Tiền mặt' : 'Tiền mặt'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            PaymentAddressStyle.paymentOption,
            paymentMethod === 'MoMo' && PaymentAddressStyle.selectedPayment,
          ]}
          onPress={() => setPaymentMethod('MoMo')}>
          <Text style={PaymentAddressStyle.paymentOptionText}>
            {paymentMethod === 'MoMo' ? '✅ MoMo' : 'MoMo'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={PaymentAddressStyle.sectionHeader}>Thông Tin Giỏ Hàng</Text>
      <FlatList
        scrollEnabled={false}
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={PaymentAddressStyle.cartItem}>
            <Image
              source={{uri: item.images[0]}}
              style={PaymentAddressStyle.cartItemImage}
            />
            <View style={PaymentAddressStyle.cartItemDetails}>
              <Text style={PaymentAddressStyle.cartItemName}>
                {item.nameProduct}
              </Text>
              <Text style={PaymentAddressStyle.cartItemQuantity}>
                Số lượng: {item.quantity}
              </Text>
              <Text style={PaymentAddressStyle.cartItemPrice}>
                {item.price * item.quantity} VNĐ
              </Text>
            </View>
          </View>
        )}
      />
      <View style={PaymentAddressStyle.totalAmountContainer}>
        <Text style={PaymentAddressStyle.totalAmountText}>
          Tổng Tiền: {totalAmount} VNĐ
        </Text>
      </View>

      {/* Nút thanh toán */}
      <TouchableOpacity
        style={PaymentAddressStyle.checkoutButton}
        onPress={handlePayment}>
        <Text style={PaymentAddressStyle.checkoutButtonText}>Thanh Toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentAddressScreen;
