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
  const [loading, setLoading] = useState(true);
  const {resetCart} = useCart();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherList, setVoucherList] = useState([]);

  const cartItems = route.params?.cartItems || [];

  const calculateTotalAmount = () => {
    // Kiểm tra nếu không có sản phẩm trong giỏ hàng
    if (!cartItems || cartItems.length === 0) return 0;

    // Tính tổng tiền hàng
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
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

  useEffect(() => {
    console.log('Danh sách voucher:', voucherList);
    console.log('Voucher được chọn:', selectedVoucher);
  }, [voucherList, selectedVoucher]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const cartItems = route.params?.cartItems || [];
        setCartItems(cartItems);
        const userID = route.params?.userID || null;
        setUserID(userID);

        
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
          setVoucherList(voucherResponse.data.data || []);
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

  // const handleSelectVoucher = voucher => {
  //   setSelectedVoucher(voucher);
  // };

  if (loading) {
    return (
      <View style={PaymentMethobStyle.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={PaymentMethobStyle.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

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
        // Nếu thanh toán thành công, giảm số lượng voucher
        if (selectedVoucher) {
          const voucherUpdateData = {
            voucherId: selectedVoucher._id,
            quantity: selectedVoucher.quantity - 1, // Giảm 1 quantity
          };

          // Gọi API giảm số lượng voucher
          // Thay đổi từ id thành selectedVoucher._id
          await axios.put(
            `${API_URL}/Voucher/${selectedVoucher._id}/updateQuantity`,
            voucherUpdateData,
          );

          // Cập nhật lại giao diện
          // setSelectedVoucher(prevVoucherList =>
          //   prevVoucherList.map(voucher =>
          //     voucher._id === selectedVoucher._id
          //       ? {...voucher, quantity: voucher.quantity - 1}
          //       : voucher,
          //   ),
          // );
        }
        resetCart();
        setDataCode(response.data.code);
        Alert.alert('Thông báo', 'Đặt hàng thành công!');
        navigation.navigate('Tab');
        if (paymentMethod === 'Ngân Hàng') {
          navigation.navigate('QRPay', {totalAmount, codes});
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
              selectedVoucher?.id === voucher._id && styles.selectedVoucherCard,
            ]}
            onPress={() => handleSelectVoucher(voucher)}>
            {/* Hình ảnh */}
            <Image
              source={require('../../../assets/imgs/logo.png')} // Thay thế với đường dẫn hình ảnh của bạn
              style={styles.voucherImage}
            />

            <View style={styles.voucherInfo}>
              <Text style={styles.voucherTitle} numberOfLines={1}>
                {voucher.titleVoucher}
              </Text>
              <Text style={styles.voucherDiscount}>
                Giảm giá: {voucher.discountValue} VNĐ
              </Text>
              <Text style={styles.voucherExpiry}>
                Hạn sử dụng: {new Date(voucher.expiryDate).toLocaleDateString()}
              </Text>
              <Text style={styles.voucherQuantity}>
                Số lượng: {voucher.quantity}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Không có voucher nào được chọn.</Text>
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
      <View style={PaymentMethobStyle.totalAmountContainer}>
        <Text style={PaymentMethobStyle.totalAmountText}>
          Tổng Tiền: đ{totalAmount}
        </Text>
      </View>

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
