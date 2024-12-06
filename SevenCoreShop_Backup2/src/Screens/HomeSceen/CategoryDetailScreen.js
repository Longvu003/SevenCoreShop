import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader'; // Import CustomHeader

const CategoryDetailScreen = ({navigation, route}) => {
  const {category} = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category?._id || !/^[a-fA-F0-9]{24}$/.test(category._id)) {
      console.error(
        'Invalid categoryId. Must be a valid 24-character hex string.',
      );
      return;
    }

    axios
      .get(`${API__URL}/products/categoryById`, {
        params: {categoryId: category._id},
      })
      .then(response => {
        setProducts(response.data.data || []);
      })
      .catch(error => {
        console.error(
          'Error fetching products:',
          error.response?.data?.message || error.message,
        );
      });
  }, [category?._id]);
  console.log('category._id:', category?._id);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Customheader
        leftIcon={require('../../../assets/imgs/back4.png')} // Biểu tượng quay lại
        onLeftPress={() => navigation.goBack()} // Hành động quay lại
        title={category.name || 'Danh Mục'} // Tiêu đề lấy từ category
        containerStyle={styles.customHeaderContainer}
      />

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        numColumns={2} // Chia 2 cột
        contentContainerStyle={{marginTop: 10}} // Thêm khoảng cách trên FlatList
        renderItem={({item}) => (
          <View style={styles.productCard}>
            <Image source={{uri: item.images[0]}} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </View>
        )}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  customHeaderContainer: {
    marginBottom: 10, // Khoảng cách dưới CustomHeader
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  productCard: {
    width: '48%', // Giảm một chút để có khoảng cách giữa các card
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 140,
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  productPrice: {
    fontSize: 14,
    color: '#ff5722',
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default CategoryDetailScreen;
