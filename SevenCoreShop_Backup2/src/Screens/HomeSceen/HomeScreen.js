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
  Dimensions,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdScreen from './AdScreen';
import AdDetail from './AdDetail';

const HomeScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
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

  const getInforUser = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const newUserEmail = JSON.parse(userEmail);
    try {
      const respone = await axios.get(
        `${API__URL}/users/getUserEmail?email=${newUserEmail}`,
      );
      if (respone.status === 200) {
        setUser(respone.data.result.username);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getInforUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Xin Chào </Text>
          <Text style={styles.txt__user}>{user}</Text>
        </View>
        <TouchableOpacity
          style={styles.Search__Icon}
          onPress={() => navigation.navigate('AllProductsScreen')}>
          <Image source={require('../../../assets/imgs/search.png')} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <AdScreen navigation={navigation} /> */}
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
              <Text>Không có danh mục sản phẩm</Text>
            )}
          </ScrollView>
        </View>
        <View showsVerticalScrollIndicator={false}>
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
                    onPress={() =>
                      navigation.navigate('ProductDetail', {item})
                    }>
                    <Image
                      source={{uri: item.images[0]}}
                      style={styles.productImage}
                    />
                    <Text numberOfLines={2} style={styles.productName}>
                      {item.name}
                    </Text>
                    <Text style={styles.productPrice}>${item.price}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  txt__user: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  hello: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  Search__Icon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
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
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryItem: {
    marginRight: 30,
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
