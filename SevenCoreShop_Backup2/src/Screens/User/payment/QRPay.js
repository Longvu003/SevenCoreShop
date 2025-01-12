import React, { useState, useEffect, useCallback } from 'react';
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
import API_URL from '../../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const WITH__Screen = Dimensions.get('screen').width;

const QRPay = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false); // Theo dõi trạng thái thanh toán
  const totalAmount = route.params?.totalAmount;
  const dataCode = route.params?.codes;
  console.log('dataCode', bankDetails);
  

  useFocusEffect(
    useCallback(() => {
      const fetchAddresses = async () => {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const newUserEmail = JSON.parse(userEmail);
        try {
          const response = await axios.get(
            `${API_URL}/users/getUserEmail/?email=${newUserEmail}`
          );
          const data = response.data.data.address;
          const newData = data.filter((item) => item.isDefault === true);
          setAddresses(newData);
        } catch (error) {
          console.error('Error fetching addresses:', error.message);
          Alert.alert('Lỗi', 'Không thể tải địa chỉ giao hàng.');
        } finally {
          setLoading(false);
        }
      };

      fetchAddresses();
    }, [])
  );

  // const handleSelectBank = (bankId, bankName) => {
  //   setSelectedBank({ id: bankId, name: bankName });
  //   fetchBankDetails(bankId);
  // };

  useEffect (() => {
    fetchBankDetails('675fc262980c81e33232aeb8');
  }, []);
  

  const fetchBankDetails = async (bankId) => {
    try {
      const response = await axios.get(`${API_URL}/payonline/${bankId}`);
      const { data: bankData } = response.data;
      console.log('bankData', bankData);

      if (
        bankData &&
        typeof bankData === 'object' &&
        typeof bankData._id === 'string' &&
        typeof bankData.bank === 'string' &&
        typeof bankData.acc_holder === 'string' &&
        typeof bankData.acc_number === 'string' &&
        Array.isArray(bankData.images) &&
        bankData.images.length > 0
      ) {
        setBankDetails(bankData);
      } else {
        console.log('Định dạng dữ liệu ngân hàng không hợp lệ:', response.data);
        throw new Error('Dữ liệu trả về không đúng định dạng');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API ngân hàng:', error.message);
      Alert.alert(
        'Lỗi',
        'Không thể tải thông tin ngân hàng. Kiểm tra lại API hoặc dữ liệu.'
      );
      setBankDetails(null);
    }
  };

  const fetchStatusPay = async () => {
    try {
      const response = await axios.post(`${API_URL}/Orders/checkStatusPay`, {
        orderCode: dataCode,
      });

      console.log('response', response.data.message);

      if (response.data.message === 'Đã thanh toán' && !isPaid) {
        setIsPaid(true); // Đánh dấu đã thanh toán để không hiển thị lại Alert
        Alert.alert('Thông báo', 'Thanh toán thành công', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OrderScreen'),
          },
        ]);
      }
    } catch (error) {
      console.error('Error checking payment status:', error.message);
    }
  };

  useEffect(() => {
    // Gọi API mỗi 20 giây
    const interval = setInterval(() => {
      fetchStatusPay();
    }, 20000); // 20 giây

    // Cleanup khi component bị hủy
    return () => clearInterval(interval);
  }, []);

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
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../../../../assets/imgs/back4.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.sectionHeader}>Chọn Ngân Hàng</Text>
        {[{ id: '675fc262980c81e33232aeb8', name: 'MBBank' }].map((bank) => (
          <TouchableOpacity
            key={bank.id}
            style={[
              styles.bankOption,
              selectedBank?.id === bank.id && styles.selectedBankOption,
            ]}
            onPress={() => handleSelectBank(bank.id, bank.name)}
          >
            <Text style={styles.bankOptionText}>{bank.name}</Text>
          </TouchableOpacity>
        ))}
        {bankDetails && bankDetails.images && bankDetails.images.length > 0 && (
          <View style={styles.bankDetails}>
            <Text style={styles.bankDetailsText}>
              Tên tài khoản: {bankDetails.acc_holder}
            </Text>
            <Text style={styles.bankDetailsText}>
              Số tài khoản: {bankDetails.acc_number}
            </Text>
            <Text style={styles.bankDetailsText}>
              Mã chuyển tiền: {dataCode}
            </Text>
            <Text style={styles.totalAmountText}>
              Tổng Tiền: đ{totalAmount}
            </Text>
            <Image
              source={{
                uri: `https://api.vietqr.io/${bankDetails.bank}/${bankDetails.acc_number}/${totalAmount}/${dataCode}/vietqr_net_2.jpg?`,
              }}
              style={styles.bankImage}
            />
          </View>
        )}
      </View>
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
    width: 330,
    height: 330,
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

export default QRPay;
