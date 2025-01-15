import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;

const PaymentMethobStyle = StyleSheet.create({
    sectionRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
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
export default PaymentMethobStyle;