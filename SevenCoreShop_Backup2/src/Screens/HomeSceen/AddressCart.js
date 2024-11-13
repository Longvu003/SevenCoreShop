import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const CheckoutScreen = () => {
  const subtotal = 200000;
  const shippingCost = 8;
  const tax = 0;
  const total = subtotal + shippingCost + tax;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Nút quay lại */}
        <TouchableOpacity style={styles.backButton}>
          {/* <Text style={styles.backText}>{"<"}</Text> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Nội dung chính */}
      <ScrollView style={styles.content}>
        {/* Địa chỉ giao hàng */}
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Địa Chỉ</Text>
          <Text style={styles.cardText}>CVPM Quang Trung FPT tòa T</Text>
        </TouchableOpacity>

        {/* Phương thức thanh toán */}
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <Text style={styles.cardText}>**** 4187</Text>
        </TouchableOpacity>

        {/* Thông tin thanh toán */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>vnd{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Shipping Cost</Text>
            <Text style={styles.summaryText}>vnd{shippingCost.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Tax</Text>
            <Text style={styles.summaryText}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryText, styles.totalText]}>Total</Text>
            <Text style={[styles.summaryText, styles.totalText]}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút Đặt Hàng */}
      <View style={styles.footer}>
        <Text style={styles.footerTotal}>${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.placeOrderButton}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  backButton: {
    marginRight: 8,
  },
  backText: {
    fontSize: 18,
    color: 'black',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  cardText: {
    fontSize: 16,
    marginTop: 4,
    color: '#000',
  },
  summary: {
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
  },
  totalText: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  footerTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CheckoutScreen;
