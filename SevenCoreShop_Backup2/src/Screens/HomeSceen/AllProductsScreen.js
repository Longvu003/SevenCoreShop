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
const AllProductsScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Gọi API lấy tất cả sản phẩm
    axios
      .get(`${API__URL}/products/all`)
      .then(response => {
        setProducts(response.data.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Products</Text>
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.productCard}>
            <Image
              source={{
                uri:
                  item.images && item.images[0]
                    ? item.images[0]
                    : 'https://via.placeholder.com/100',
              }}
              style={styles.productImage}
            />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </View>
        )}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  productSection: {
    marginBottom: 40,
  },
  productCard: {
    height: 200,
    width: 190,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginTop: 20,
  },
  productImage: {
    width: 160,
    height: 90,
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
});

export default AllProductsScreen;
