import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';
const CategoryDetailScreen = ({navigation, route}) => {
  const {category} = route.params;
  const [products, setProducts] = useState([]);
  const id = category._id;
  const getProduct = () => {
    axios
      .get(`${API__URL}/products/getProductBycategory/${id}`)
      .then(response => {
        setProducts(response.data.data || []);
      })
      .catch(error => {
        console.log(
          'Error fetching products:',
          error.response?.data?.message || error.message,
        );
      });
  };
  useEffect(() => {
    getProduct();
  }, []);
  return (
    <View style={styles.container}>
      <Customheader
        leftIcon={require('../../../assets/imgs/back4.png')}
        onLeftPress={() => navigation.goBack()}
        title={category.name || 'Danh Mục'}
        containerStyle={styles.customHeaderContainer}
      />

      {/* Loading or Error States */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Product List */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={{marginTop: 10}}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', {item})}>
            <Image source={{uri: item.images[0]}} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </TouchableOpacity>
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
