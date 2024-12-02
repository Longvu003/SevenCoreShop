import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdScreen from './AdScreen';
import AdDetail from './AdDetail';
const HomeScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    // Gọi API lấy sản phẩm từ MongoDB
    axios
      .get(`${API__URL}/products/all`)
      .then(response => {
        // const getidProduct = JSON.stringify(response.data);
        const ArrayProduct = response.data.data;
        setProducts(ArrayProduct);
      })
      .catch(error => {
        console.log('Error fetching products:', error);
      });

    // Gọi API lấy danh mục từ MongoDB
    axios
      .get(`${API__URL}/categories/getAllCategory`)
      .then(response => {
        const fixResponse = Object.values(response.data);
        setCategories(fixResponse[1]);
      })
      .catch(error => {
        console.log('Error fetching categories:', error);
      });
  }, []);
  const handleSearch = () => {
    if (searchKey.trim() === '') {
      axios
        .get(`${API__URL}/products/all`)
        .then(response => {
          setProducts(response.data.data);
        })
        .catch(error => {
          console.log('Error fetching products:', error);
        });
    } else {
      axios
        .get(`${API__URL}/products/tim-kiem?key=${searchKey}`)
        .then(response => {
          setProducts(response.data.data);
        })
        .catch(error => {
          console.log('Error searching products:', error);
        });
    }
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.hello}>Xin Chào</Text>

        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Image
            source={require('../../../assets/imgs/cart2.png')}
            style={styles.cartIcon}
          />
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm Kiếm"
          value={searchKey}
          onChangeText={text => setSearchKey(text)}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>
      {/* <AdScreen navigation={navigation} /> */}
      <View>
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Loại Sản Phẩm</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CategoryScreen')}>
            <Text style={styles.seeAllText}>Xem Tất Cả</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryItem}
                  onPress={() =>
                    navigation.navigate('CategoryDetailScreen', {category})
                  }>
                  <Image
                    source={{
                      uri:
                        category.images && category.images.length > 0
                          ? category.images[0]
                          : 'https://via.placeholder.com/50',
                    }}
                    style={styles.categoryImage}
                  />
                  <Text>{category.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No categories available</Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.productHeader}>
          <Text style={styles.sectionTitle}>Sản Phẩm</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllProductsScreen')}>
            <Text style={styles.seeAllText}>Xem Tất Cả</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productSection}>
          <FlatList
            data={products}
            keyExtractor={item => item._id}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetail', {item})}>
                  <Image
                    source={{uri: item.images[0]}}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>${item.price}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
      <View style={styles.productSection}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  hello: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  genderSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  arrowDown: {
    marginLeft: 5,
  },
  cartIcon: {
    width: 50,
    height: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  searchButton: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  seeAllText: {
    fontSize: 14,
    color: '#000',
    textDecorationLine: 'underline',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryItem: {
    marginRight: 10,
    alignItems: 'center',
  },
  categoryImage: {
    width: 67,
    height: 67,
    borderRadius: 30,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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

export default HomeScreen;
