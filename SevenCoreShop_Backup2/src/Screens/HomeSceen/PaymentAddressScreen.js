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
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
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

    // Nếu không có voucher, trả về tổng tiền hàng
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
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
        // await resetCartOnServer(cartItems);
        resetCart();
        Alert.alert('Thông báo', 'Đặt hàng thành công!');
        navigation.navigate('Tab');
      } else {
        throw new Error('Thanh toán không thành công.');
      }
    } catch (error) {
      // Kiểm tra và log chi tiết lỗi
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
      contentContainerStyle={styles.container}>
      <Customheader leftIcon={require('../../../assets/imgs/back4.png')} />
      <Text style={styles.sectionHeader}>Chọn Địa Chỉ Giao Hàng</Text>
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
      {paymentMethod === 'Ngân Hàng' && (
        <View>
          <Text style={styles.sectionHeader}>Chọn Ngân Hàng</Text>
          {[
            // { id: '675e6a75344d8008e4f65899', name: 'TP BANK' },
            // { id: '675e6ab7344d8008e4f6589d', name: 'VietComBank' },
            {id: '675e6ad4344d8008e4f658a3', name: 'MBBank'},
          ].map(bank => (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankOption,
                selectedBank?.id === bank.id && styles.selectedBankOption,
              ]}
              onPress={() => handleSelectBank(bank.id, bank.name)}>
              <Text style={styles.bankOptionText}>{bank.name}</Text>
            </TouchableOpacity>
          ))}
          {bankDetails &&
            bankDetails.images &&
            bankDetails.images.length > 0 && (
              <View style={styles.bankDetails}>
                <Text style={styles.bankDetailsText}>
                  Tên tài khoản: {bankDetails.acc_holder}
                </Text>
                <Text style={styles.bankDetailsText}>
                  Số tài khoản: {bankDetails.acc_number}
                </Text>
                <Image
                  source={{uri: bankDetails.images[0]}}
                  style={styles.bankImage}
                />
              </View>
            )}
        </View>
      )}
      <Text style={styles.sectionHeader}>Chọn Voucher</Text>
      {voucherList.length > 0 ? (
        voucherList.map(voucher => (
          <TouchableOpacity
            key={voucher._id}
            style={[
              styles.voucherCard,
              selectedVoucher?.id === voucher.id && styles.selectedVoucherCard,
            ]}
            onPress={() => handleSelectVoucher(voucher)}>
            {/* Hình ảnh */}
            <Image
              source={require('../../../assets/imgs/logo.png')} // Thay thế với đường dẫn hình ảnh của bạn
              style={styles.voucherImage}
            />

            <View style={styles.voucherInfo}>
              <Text style={styles.voucherTitle} umberOfLines={1}>
                {voucher.titleVoucher}
              </Text>
              <Text style={styles.voucherDiscount}>
                Giảm giá: {voucher.discountValue} VNĐ
              </Text>
              <Text style={styles.voucherExpiry}>
                Hạn sử dụng: {voucher.expiryDate}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Không có voucher nào khả dụng.</Text>
      )}

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
              {item.price * item.quantity} VNĐ
            </Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionHeader}>Chi tiết thanh toán</Text>
      {/* Hiển thị chi tiết thanh toán */}
      <View style={styles.paymentSummaryContainer}>
        <Text style={styles.paymentSummaryText}>
          Tổng tiền hàng:{' '}
          {cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          )}{' '}
          VNĐ
        </Text>
        <Text style={styles.paymentSummaryText}>
          Tổng voucher giảm giá: {selectedVoucher?.discountValue || 0} VNĐ
        </Text>
        <Text style={styles.paymentTotalText}>
          Tổng tiền thanh toán: {totalAmount} VNĐ
        </Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handlePayment}>
        <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F', // Màu đỏ
    marginVertical: 20,
  },
  voucherCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedVoucherCard: {
    borderWidth: 2,
    borderColor: '#D32F2F', // Màu đỏ
  },
  voucherImage: {
    width: 50, // Kích thước hình vuông
    height: 50,
    borderRadius: 5, // Bo tròn một chút
    marginRight: 15,
  },
  voucherInfo: {
    justifyContent: 'center',
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    flexWrap: 'wrap', // Đảm bảo chữ xuống dòng khi cần
    width: '80%', // Hạn chế chiều rộng
    overflow: 'hidden', // Ẩn phần thừa
    textOverflow: 'ellipsis', // Hiển thị ba chấm nếu vượt quá
  },

  voucherDiscount: {
    fontSize: 14,
    color: '#616161',
  },
  voucherExpiry: {
    fontSize: 12,
    color: '#757575',
    marginTop: 5,
  },

  paymentSummaryContainer: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  paymentSummaryText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  paymentTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
  },

  container: {
    padding: 16,
    backgroundColor: 'white',
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
    marginTop: 30,
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
