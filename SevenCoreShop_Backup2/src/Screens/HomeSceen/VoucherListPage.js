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
import {useFocusEffect} from '@react-navigation/native';

const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;

const VoucherListPage = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherList, setVoucherList] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const calculateTotalAmount = () => {
    // Kiểm tra nếu không có sản phẩm trong giỏ hàng
    if (!cartItems || cartItems.length === 0) return 0;

    // Tính tổng tiền hàng
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0,
    );

    // Nếu không có voucher được chọn, trả về tổng tiền hàng
    if (!selectedVoucher) {
      return subtotal;
    }

    // Nếu có voucher, áp dụng giá trị giảm giá
    const discount = selectedVoucher.discountValue || 0; // Giảm giá từ voucher
    return Math.max(subtotal - discount, 0); // Đảm bảo không trả về giá trị âm
  };

  const totalAmount = calculateTotalAmount();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
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

  const handleSelectVoucher = voucher => {
    setSelectedVoucher(voucher); // Cập nhật voucher đã chọn trong state
  };

  const handleNavigateToPayment = () => {
    if (!selectedVoucher) {
      Alert.alert('Thông báo', 'Vui lòng chọn một voucher!');
      return;
    }

    // Truyền voucher đã chọn khi người dùng nhấn nút thanh toán
    navigation.navigate('PaymentAddressScreen', {
      selectedVoucher, // Gửi voucher đã chọn qua params
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../assets/imgs/back4.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionHeader}>Chọn Voucher</Text>
      </View>

      {voucherList.length > 0 ? (
        voucherList.map(voucher => {
          const isOutOfStock = voucher.quantity === 0;
          const isBelowMinValue = totalAmount < (voucher.minValue || 0);
          const isDisabled = isOutOfStock || isBelowMinValue;

          return (
            <TouchableOpacity
              key={voucher._id}
              style={[
                styles.voucherCard,
                selectedVoucher?._id === voucher._id &&
                  styles.selectedVoucherCard,
                isDisabled && styles.disabledVoucherCard, // Áp dụng style nếu voucher bị vô hiệu hóa
              ]}
              onPress={() => !isDisabled && handleSelectVoucher(voucher)} // Chỉ cho phép chọn nếu không bị vô hiệu hóa
              disabled={isDisabled} // Vô hiệu hóa nút nếu không khả dụng
            >
              <Image
                source={require('../../../assets/imgs/logo.png')}
                style={styles.voucherImage}
              />

              <View style={styles.voucherInfo}>
                <Text style={styles.voucherTitle}>{voucher.titleVoucher}</Text>
                <Text style={styles.voucherDiscount}>
                  Giảm giá: {voucher.discountValue} VNĐ
                </Text>
                <Text style={styles.voucherExpiry}>
                  Hạn sử dụng:{' '}
                  {new Date(voucher.expiryDate).toLocaleDateString()}
                </Text>
                <Text style={styles.voucherQuantity}>
                  Số lượng: {isOutOfStock ? 'Hết số lượng' : voucher.quantity}
                </Text>

                {isOutOfStock ? (
                  <Text style={styles.disabledText}>
                    Voucher đã hết số lượng
                  </Text>
                ) : isBelowMinValue ? (
                  <Text style={styles.disabledText}>
                    Đơn hàng chưa đạt giá trị tối thiểu
                  </Text>
                ) : (
                  <Text style={styles.selectText}>
                    {selectedVoucher?._id === voucher._id ? 'Đã chọn' : 'Chọn'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text>Không có voucher nào khả dụng.</Text>
      )}

      {/* Nút chuyển trang sau khi chọn voucher */}
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={handleNavigateToPayment}>
        <Text style={styles.paymentButtonText}>Chuyển đến thanh toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  disabledText: {
    color: 'green', // Màu chữ khi voucher hết số lượng
    fontWeight: 'bold',
  },
  disabledVoucherCard: {
    backgroundColor: '#e0e0e0', // Màu nền cho voucher hết số lượng
    borderColor: '#ccc',
    borderWidth: 1,
  },
  paymentButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    borderRadius: 5,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
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
    // flexWrap: 'wrap', // Đảm bảo chữ xuống dòng khi cần
    maxWidth: '95%', // Hạn chế chiều rộng
    // overflow: 'hidden', // Ẩn phần thừa
    // textOverflow: 'ellipsis', // Hiển thị ba chấm nếu vượt quá
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

  sectionRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
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

export default VoucherListPage;
