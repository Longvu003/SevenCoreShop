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
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';
import {useFocusEffect} from '@react-navigation/native';
import PaymentMethobStyle from '../../StyleSheets/PaymentMethobStyle';
const PaymentAddressScreen = ({navigation, route}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const {resetCart} = useCart();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherList, setVoucherList] = useState([]);

  const cartItems = route.params?.cartItems || [];

  const calculateTotalAmount = () => {
    // Tính tổng tiền hàng
    const total = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Kiểm tra nếu có voucher, áp dụng giá trị giảm giá
    if (selectedVoucher) {
      const discount = selectedVoucher.discountValue || 0; // Lấy giá trị giảm giá từ voucher
      return Math.max(total - discount, 0); // Đảm bảo tổng tiền không âm
    }
    return total;
  };

  const totalAmount = calculateTotalAmount();

  const userID = route.params?.userID;

  useEffect(() => {}, [voucherList, selectedVoucher]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const userEmail = await AsyncStorage.getItem('userEmail');
          const parsedEmail = JSON.parse(userEmail);

          // Fetch addresses
          const addressResponse = await axios.get(
            `${API_URL}/users/getUserEmail/?email=${parsedEmail}`,
          );
          const addressData = addressResponse.data.data.address.filter(
            item => item.isDefault === true,
          );
          setAddresses(addressData);

          // Fetch vouchers
          const voucherResponse = await axios.get(
            `${API_URL}/Voucher/`, // Đường dẫn API lấy danh sách voucher
          );
          setVoucherList(voucherResponse.data.vouchers || []);
        } catch (error) {
          console.error('Error fetching data:', error.message);
          Alert.alert('Lỗi', 'Không thể tải dữ liệu.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []),
  );

  const handleSelectVoucher = voucher => {
    setSelectedVoucher(voucher);
  };

  if (loading) {
    return (
      <View style={PaymentMethobStyle.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={PaymentMethobStyle.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const fetchBankDetails = async bankId => {
    try {
      const response = await axios.get(`${API_URL}/payonline/${bankId}`);
      const {data: bankData} = response.data;
      // console.log('Dữ liệu ngân hàng:', bankData);

      if (
        bankData &&
        typeof bankData === 'object' &&
        typeof bankData.acc_holder === 'string' &&
        typeof bankData.acc_number === 'string' &&
        Array.isArray(bankData.images) &&
        bankData.images.length > 0
      ) {
        setBankDetails(bankData); // Cập nhật thông tin ngân hàng
      } else {
        console.log('Định dạng dữ liệu ngân hàng không hợp lệ:', response.data);
        throw new Error('Dữ liệu trả về không đúng định dạng');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API ngân hàng:', error.message);
      Alert.alert(
        'Lỗi',
        'Không thể tải thông tin ngân hàng. Kiểm tra lại API hoặc dữ liệu.',
      );
      setBankDetails(null);
    }
  };

  const handleSelectBank = (bankId, bankName) => {
    setSelectedBank({id: bankId, name: bankName});
    fetchBankDetails(bankId);
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      Alert.alert('Thông báo', 'Vui lòng chọn một địa chỉ giao hàng!');
      return;
    }
    if (!paymentMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán!');
      return;
    }
    if (paymentMethod === 'Ngân Hàng' && !selectedBank) {
      Alert.alert('Thông báo', 'Vui lòng chọn ngân hàng!');
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
      bankId: selectedBank?.id,
    };
    try {
      const response = await axios.post(
        `${API_URL}/Orders/checkout`,
        orderData,
      );

      if (response.status === 201) {
        resetCart();
        Alert.alert('Thông báo', 'Đặt hàng thành công!');
        navigation.navigate('Tab');
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
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={PaymentMethobStyle.container}>
      <Customheader leftIcon={require('../../../assets/imgs/back4.png')} />
      <Text style={PaymentMethobStyle.sectionHeader}>
        Chọn Địa Chỉ Giao Hàng
      </Text>
      {addresses.length > 0 ? (
        addresses.map(addressItem => (
          <TouchableOpacity
            key={addressItem._id}
            style={[
              PaymentMethobStyle.addressCard,
              selectedAddress?._id === addressItem._id &&
                PaymentMethobStyle.selectedCard,
            ]}
            onPress={() => setSelectedAddress(addressItem)}>
            <View style={PaymentMethobStyle.addressContent}>
              <View style={PaymentMethobStyle.addressDetails}>
                <Text style={PaymentMethobStyle.addressText}>
                  {addressItem.userNameAddress}|| {addressItem.phoneAddress}
                </Text>
                <Text style={PaymentMethobStyle.addressText}>
                  {addressItem.addressDetail || 'Không có địa chỉ'},
                  {addressItem.ward},{addressItem.district},
                  {addressItem.province}
                </Text>
              </View>
            </View>
            <Text style={PaymentMethobStyle.selectText}>
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
      <Text style={PaymentMethobStyle.sectionHeader}>
        Chọn Phương Thức Thanh Toán
      </Text>
      <View style={PaymentMethobStyle.paymentOptions}>
        <TouchableOpacity
          style={[
            PaymentMethobStyle.paymentOption,
            paymentMethod === 'Tiền mặt' && PaymentMethobStyle.selectedPayment,
          ]}
          onPress={() => setPaymentMethod('Tiền mặt')}>
          <Text style={PaymentMethobStyle.paymentOptionText}>
            {paymentMethod === 'Tiền mặt' ? '✅ Tiền mặt' : 'Tiền mặt'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            PaymentMethobStyle.paymentOption,
            paymentMethod === 'Ngân Hàng' && PaymentMethobStyle.selectedPayment,
          ]}
          onPress={() => setPaymentMethod('Ngân Hàng')}>
          <Text style={PaymentMethobStyle.paymentOptionText}>
            {paymentMethod === 'Ngân Hàng' ? '✅ Ngân Hàng' : 'Ngân Hàng'}
          </Text>
        </TouchableOpacity>
      </View>
      {paymentMethod === 'Ngân Hàng' && (
        <View>
          <Text style={PaymentMethobStyle.sectionHeader}>Chọn Ngân Hàng</Text>
          {[
            // { id: '675e6a75344d8008e4f65899', name: 'TP BANK' },
            // { id: '675e6ab7344d8008e4f6589d', name: 'VietComBank' },
            {id: '675e6ad4344d8008e4f658a3', name: 'MBBank'},
          ].map(bank => (
            <TouchableOpacity
              key={bank.id}
              style={[
                PaymentMethobStyle.bankOption,
                selectedBank?.id === bank.id &&
                  PaymentMethobStyle.selectedBankOption,
              ]}
              onPress={() => handleSelectBank(bank.id, bank.name)}>
              <Text style={PaymentMethobStyle.bankOptionText}>{bank.name}</Text>
            </TouchableOpacity>
          ))}
          {bankDetails &&
            bankDetails.images &&
            bankDetails.images.length > 0 && (
              <View style={PaymentMethobStyle.bankDetails}>
                <Text style={PaymentMethobStyle.bankDetailsText}>
                  Tên tài khoản: {bankDetails.acc_holder}
                </Text>
                <Text style={PaymentMethobStyle.bankDetailsText}>
                  Số tài khoản: {bankDetails.acc_number}
                </Text>
                <Image
                  source={{uri: bankDetails.images[0]}}
                  style={PaymentMethobStyle.bankImage}
                />
              </View>
            )}
        </View>
      )}
      <Text style={PaymentMethobStyle.sectionHeader}>Chọn Voucher</Text>
      {voucherList.length > 0 ? (
        voucherList.map(voucher => (
          <TouchableOpacity
            key={voucher._id}
            style={[
              PaymentMethobStyle.voucherCard,
              selectedVoucher?.id === voucher.id &&
                PaymentMethobStyle.selectedVoucherCard,
            ]}
            onPress={() => handleSelectVoucher(voucher)}>
            {/* Hình ảnh */}
            <Image
              source={require('../../../assets/imgs/logo.png')} // Thay thế với đường dẫn hình ảnh của bạn
              style={PaymentMethobStyle.voucherImage}
            />

            <View style={PaymentMethobStyle.voucherInfo}>
              <Text style={PaymentMethobStyle.voucherTitle} umberOfLines={1}>
                {voucher.titleVoucher}
              </Text>
              <Text style={PaymentMethobStyle.voucherDiscount}>
                Giảm giá: {voucher.discountValue} VNĐ
              </Text>
              <Text style={PaymentMethobStyle.voucherExpiry}>
                Hạn sử dụng: {voucher.expiryDate}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Không có voucher nào khả dụng.</Text>
      )}

      <Text style={PaymentMethobStyle.sectionHeader}>Thông Tin Giỏ Hàng</Text>
      {cartItems.map((item, index) => (
        <View key={index} style={PaymentMethobStyle.cartItem}>
          <Image
            source={{uri: item.images[0]}}
            style={PaymentMethobStyle.cartItemImage}
          />
          <View style={PaymentMethobStyle.cartItemDetails}>
            <Text style={PaymentMethobStyle.cartItemName}>
              {item.nameProduct}
            </Text>
            <Text style={PaymentMethobStyle.cartItemQuantity}>
              Số lượng: {item.quantity}
            </Text>
            <Text style={PaymentMethobStyle.cartItemPrice}>
              {item.price * item.quantity} VNĐ
            </Text>
          </View>
        </View>
      ))}

      <Text style={PaymentMethobStyle.sectionHeader}>Chi tiết thanh toán</Text>
      {/* Hiển thị chi tiết thanh toán */}
      <View style={PaymentMethobStyle.paymentSummaryContainer}>
        <Text style={PaymentMethobStyle.paymentSummaryText}>
          Tổng tiền hàng:
          {cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          )}
          VNĐ
        </Text>
        <Text style={PaymentMethobStyle.paymentSummaryText}>
          Tổng voucher giảm giá: {selectedVoucher?.discountValue || 0} VNĐ
        </Text>
        <Text style={PaymentMethobStyle.paymentTotalText}>
          Tổng tiền thanh toán: {totalAmount} VNĐ
        </Text>
      </View>
      <TouchableOpacity
        style={PaymentMethobStyle.checkoutButton}
        onPress={handlePayment}>
        <Text style={PaymentMethobStyle.checkoutButtonText}>Thanh Toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default PaymentAddressScreen;
