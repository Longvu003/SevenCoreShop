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

const CategoryDetailScreen = ({navigation, route}) => {
  const {category} = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API__URL}/products/categoryId?id=${category._id}`)
      .then(response => {
        setProducts(response.data.data);
        console.log(response.data);
      })
      .catch(error => console.error('Lỗi lấy sản phẩm:', error));
  }, [category._id]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Category Title */}
      <Text style={styles.title}>{category.name}</Text>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        numColumns={2} // This ensures two columns
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
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
    marginTop: 50,
  },
  productCard: {
    width: '50%',
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 160,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  productPrice: {
    fontSize: 16,
    color: '#ff5722',
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default CategoryDetailScreen;
