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

const AllProductsScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // Gọi API lấy tất cả sản phẩm
    axios
      .get(`${API__URL}/products/all`)
      .then(response => {
        setProducts(response.data.data);
      })
      .catch(error => console.log('Error fetching products:', error));
  }, []);

  return (
    <View style={styles.container}>
      {/* Header view for back button and title */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Products</Text>
      </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50, // Adjusted margin for spacing
  },
  backButton: {
    position: 'absolute',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 50,
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
});

export default AllProductsScreen;
