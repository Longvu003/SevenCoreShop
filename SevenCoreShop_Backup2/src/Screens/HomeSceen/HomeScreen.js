import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdScreen from './AdScreen';
import HomeStyle from '../../StyleSheets/HomeStyle';
import {useCallback} from 'react';
const HomeScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API__URL}/products/`);
      const ArrayProduct = response.data.data;
      setProducts(ArrayProduct);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API__URL}/categories/`);
      const fixResponse = response.data.data;
      setCategories(fixResponse);
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
      setRefreshing(false);
    }, 1000);
  }, []);

  const getInforUser = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    if (userEmail) {
      const newUserEmail = JSON.parse(userEmail);
      try {
        const response = await axios.get(
          `${API__URL}/users/getUserEmail?email=${newUserEmail}`,
        );
        if (response.status === 200) {
          setUser(response.data.data.username);
        }
      } catch (error) {
        console.log('Error fetching user info:', error);
      }
    }
  };

  useEffect(() => {
    getInforUser();
  }, []);

  return (
    <View style={HomeStyle.container}>
      {/* Header */}
      <View style={HomeStyle.header}>
        <View>
          <Text style={HomeStyle.hello}>Xin Chào </Text>
          <Text style={HomeStyle.txt__user}>{user}</Text>
        </View>
        <TouchableOpacity
          style={HomeStyle.Search__Icon}
          onPress={() => navigation.navigate('AllProductsScreen')}>
          <Image source={require('../../../assets/imgs/search.png')} />
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <AdScreen navigation={navigation} />
        <View style={HomeStyle.categoryHeader}>
          <Text style={HomeStyle.sectionTitle}>Loại Sản Phẩm</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CategoryScreen')}>
            <Text style={HomeStyle.seeAllText}>Xem Tất Cả</Text>
          </TouchableOpacity>
        </View>
        <View style={HomeStyle.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={HomeStyle.categoryItem}
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
                    style={HomeStyle.categoryImage}
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
          <View style={HomeStyle.productHeader}>
            <Text style={HomeStyle.sectionTitle}>Sản Phẩm</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AllProductsScreen')}>
              <Text style={HomeStyle.seeAllText}>Xem Tất Cả</Text>
            </TouchableOpacity>
          </View>
          <View style={HomeStyle.productSection}>
            <FlatList
              data={products}
              keyExtractor={item => item._id}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={HomeStyle.productCard}
                    onPress={() =>
                      navigation.navigate('ProductDetail', {item})
                    }>
                    <Image
                      source={{uri: item.images[0]}}
                      style={HomeStyle.productImage}
                    />
                    <Text numberOfLines={2} style={HomeStyle.productName}>
                      {item.name}
                    </Text>
                    <Text style={HomeStyle.productPrice}>{item.price}Vnđ</Text>
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

export default HomeScreen;
