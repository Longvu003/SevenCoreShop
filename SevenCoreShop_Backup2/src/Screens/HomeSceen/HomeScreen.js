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
import HomeStyle from '../../StyleSheets/HomeStyle';
const HomeScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios
      .get(`${API__URL}/products/all`)
      .then(response => {
        const ArrayProduct = response.data.data;
        setProducts(ArrayProduct);
      })
      .catch(error => {
        console.log('Error fetching products:', error);
      });
    axios
      .get(`${API__URL}/categories/getAllCategory`)
      .then(response => {
        const fixResponse = response.data.data;
        setCategories(fixResponse);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <AdScreen navigation={navigation} /> */}
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
                    <Text style={HomeStyle.productPrice}>${item.price}</Text>
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
