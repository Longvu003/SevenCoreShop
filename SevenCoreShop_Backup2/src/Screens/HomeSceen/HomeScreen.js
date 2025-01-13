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
  Alert,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdScreen from './AdScreen';
import HomeStyle from '../../StyleSheets/HomeStyle';
import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
const HomeScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');

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
    await Promise.all([fetchProducts(), fetchCategories()]);
    setRefreshing(false);
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

  const addFavorite = async item => {
    try {
      const getuserId = await AsyncStorage.getItem('userId');
      const userId = JSON.parse(getuserId);

      if (!userId) {
        Alert.alert(
          'Yêu cầu đăng nhập',
          'Bạn cần đăng nhập để thêm vào yêu thích.',
          [
            {
              text: 'Hủy',
              style: 'cancel',
            },
            {
              text: 'Đăng nhập',
              onPress: () => navigation.replace('LoginScreen'),
            },
          ],
        );
        return; // Ngừng xử lý nếu chưa đăng nhập
      }
      const product = {
        userId,
        productId: item._id,
        images: item.images[0],
        nameProduct: item.name,
        price: item.price,
      };
      // Gửi yêu cầu thêm sản phẩm vào yêu thích
      const response = await axios.post(
        `${API__URL}/favorite/addFavorite`,
        product,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.data) {
        Alert.alert('Thông báo!', 'Thêm sản phẩm thành công');
      }
    } catch (error) {
      console.log('Lỗi:', error);
      Alert.alert(
        'Lỗi',
        'Không thể thêm sản phẩm vào yêu thích. Vui lòng thử lại.',
      );
    }
  };
  useFocusEffect(
    useCallback(() => {
      getInforUser();
    }, []),
  );
  return (
    <View style={HomeStyle.container}>
      <View style={HomeStyle.header}>
        <View>
          <Text style={HomeStyle.hello}>Xin chào</Text>
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
        <View style={HomeStyle.buttonContainer}>
          <TouchableOpacity
            style={[
              HomeStyle.button,
              activeFilter === 'BestSelling' && HomeStyle.activeButton,
            ]}
            onPress={() => {
              setActiveFilter('BestSelling');
              navigation.navigate('BestSellingScreen');
            }}>
            <Text style={HomeStyle.buttonText}>Bán Chạy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              HomeStyle.button,
              activeFilter === 'Popular' && HomeStyle.activeButton,
            ]}
            onPress={() => {
              setActiveFilter('Popular');
              navigation.navigate('PopularScreen');
            }}>
            <Text style={HomeStyle.buttonText}>Phổ Biến</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              HomeStyle.button,
              activeFilter === 'FilterByPrice' && HomeStyle.activeButton,
            ]}
            onPress={() => {
              setActiveFilter('FilterByPrice');
              navigation.navigate('FilterByPriceScreen');
            }}>
            <Text style={HomeStyle.buttonText}>Lọc Theo Giá</Text>
          </TouchableOpacity>
        </View>

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
                    <TouchableOpacity
                      style={HomeStyle.heartIcon}
                      onPress={() => addFavorite(item)}>
                      <Image
                        source={require('../../../assets/imgs/heart.png')}
                        style={{width: 24, height: 24}}
                      />
                    </TouchableOpacity>
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
