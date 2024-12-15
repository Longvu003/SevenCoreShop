import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';

const CategoryDetailScreen = ({ navigation, route }) => {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    // if (!category?._id || !/^[a-fA-F0-9]{24}$/.test(category._id)) {
    //   setError("Invalid categoryId. Must be a valid 24-character hex string.");
    //   setLoading(false);
    //   return;
    // }
    // console.log("Category ID Length:", category._id.length); 
    try {
      setLoading(true);
      console.log("Fetching products for categoryId:", category._id); 
      const response = await axios.get(`${API__URL}/products/categoryById`, {
        params: { categoryId: category._id.toString() }, 
      });
      setProducts(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
      setError("Failed to fetch products.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [category?._id]);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Customheader
        leftIcon={require('../../../assets/imgs/back4.png')} // Biểu tượng quay lại
        onLeftPress={() => navigation.goBack()} // Hành động quay lại
        title={category.name || "Danh Mục"} // Tiêu đề lấy từ category
        containerStyle={styles.customHeaderContainer}
      />

      {/* Loading or Error States */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={{ marginTop: 10 }}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.images[0] }} style={styles.productImage} />
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
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  productCard: {
    width: '48%',
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
