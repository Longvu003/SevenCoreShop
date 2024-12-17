import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WITH__Screen = Dimensions.get('screen').width;
const AllProductsScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  const handleSearch = async key => {
    setSearchKey(key);
    if (!key) {
      await axios
        .get(`${API__URL}/products/`)
        .then(response => {
          setProducts(response.data.data);
        })
        .catch(error => {
          console.log('Lỗi lấy sản phẩm:', error);
        });
    }

    await axios
      .post(`${API__URL}/products/tim-kiem`, {key})
      .then(response => {
        setProducts(response.data.data);
      })
      .catch(error => {
        console.log('Lỗi khi tìm sản phẩm', error);
      });
  };
  useEffect(() => {
    handleSearch();
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm Kiếm"
          value={searchKey}
          onChangeText={text => handleSearch(text)}
        />
      </View>
      <View style={{flex: 8}}>
        {products.length >= 1 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            keyExtractor={item => item._id}
            contentContainerStyle={{marginTop: 20}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetail', {item})}
                style={styles.productCard}>
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
              </TouchableOpacity>
            )}
            numColumns={2}
          />
        ) : (
          <View>
            <Text>Không tìm thấy sản phẩm "{searchKey}"</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    fontSize: 16,
    paddingHorizontal: 15,
  },
  searchContainer: {
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    width: WITH__Screen * 0.9,
    marginHorizontal: 20,
    height: HEIGHT__SCREEN * 0.07,
  },
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
