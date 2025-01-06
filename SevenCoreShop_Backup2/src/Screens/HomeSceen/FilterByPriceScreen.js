import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';
const FilterByPriceScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchFilteredProducts = async () => {
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return Alert.alert('Lỗi', 'Giá trị nhập vào phải là số.');
    }

    if (parseFloat(minPrice) < 0 || parseFloat(maxPrice) < 0) {
      return Alert.alert('Lỗi', 'Giá trị không được nhỏ hơn 0.');
    }

    try {
      const response = await axios.get(`${API__URL}/products/loc-theo-gia`, {
        params: {
          min: minPrice || 0,
          max: maxPrice || 1000000000,
        },
      });
      setProducts(response.data.data);
      if (response.data.data.length === 0) {
        Alert.alert(
          'Thông báo',
          'Không tìm thấy sản phẩm nào trong khoảng giá này.',
        );
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      Alert.alert('Lỗi', 'Không thể tải sản phẩm, vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Lọc Sản Phẩm Theo Giá</Text>
        <View style={{flex: 0.7}}>
          <Customheader leftIcon={require('../../../assets/imgs/back4.png')} />
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Giá tối thiểu"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Giá tối đa"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={fetchFilteredProducts}>
            <Text style={styles.filterButtonText}>Lọc sản phẩm</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 8}}>
          <FlatList
            data={products}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.productListContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', {item})}>
                <Image
                  source={{
                    uri: item.images[0] || 'https://via.placeholder.com/150',
                  }}
                  style={styles.productImage}
                />
                <Text numberOfLines={2} style={styles.productName}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>
                  {item.price.toLocaleString()} VND
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>
                Không có sản phẩm nào trong khoảng giá này.
              </Text>
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 5,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  filterButton: {
    backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productListContainer: {
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 10,
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default FilterByPriceScreen;
