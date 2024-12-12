import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';

const HEIGHT__SCREEN = Dimensions.get('screen').height;
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
      <View style={{height: HEIGHT__SCREEN * 0.08}}>
        <Customheader
          leftIcon={require('../../../assets/imgs/back4.png')}
          onLeftPress={() => navigation.goBack()}
          title="Sản Phẩm"
          containerStyle={styles.customHeaderContainer}
        />
      </View>

      <View style={{flex: 10}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={products}
          keyExtractor={item => item._id}
          contentContainerStyle={{marginTop: 20}}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  customHeaderContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
  },
  productCard: {
    height: 200,
    width: '48%',
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 10,
    margin: '1%',
  },
  productImage: {
    width: '100%',
    height: 100,
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
});

export default AllProductsScreen;
