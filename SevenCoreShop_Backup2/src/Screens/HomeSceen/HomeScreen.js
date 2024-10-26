import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import { screensEnabled } from 'react-native-screens';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Gọi API lấy sản phẩm từ MongoDB
    axios.get('http://192.168.1.3:7777/products')
      .then(response => {
        
        setProducts(response.data.data); // Lưu sản phẩm vào state, sử dụng response.data.data
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    // Gọi API lấy danh mục từ MongoDB
    axios.get('http://192.168.1.3:7777/categories')
      .then(response => {
        const fixResponse = Object.values(response.data);
        setCategories(fixResponse[1]);
        
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
   
  }, []);

    // console.log("category fetched:", products);

  return (
    <ScrollView  style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.avatar} />
      
        <TouchableOpacity >
          <Image source={{ uri: 'https://via.placeholder.com/24' }} style={styles.cartIcon} />
        </TouchableOpacity>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
      </View>

      {/* Categories */}
      <View style={styles.categoryHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryContainer}>
 
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {categories.length > 0 ? categories.map((category, index) => {
    console.log(category.images); // Kiểm tra giá trị của images
    return (
      <TouchableOpacity key={index} style={styles.categoryItem}>
        <Image 
          source={{ uri: category.images && category.images.length > 0 ? category.images[0] : 'https://via.placeholder.com/50' }}
          style={styles.categoryImage} 
        />
        <Text>{category.name}</Text>
      </TouchableOpacity>
    );
  }) : (
    <Text>No categories available</Text>
  )}
</ScrollView>


      </View>

      {/* Top Selling */}
      <View style={styles.productHeader}>
        <Text style={styles.sectionTitle}>Top Selling</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen')}>
  <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productSection}>
      
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2} // Thay đổi ở đây để hiển thị nằm ngang
          showsHorizontalScrollIndicator={true}
          scrollEnabled={false}
          renderItem={({ item }) =>{
           
            return(
            <View style={styles.productCard}>
             {/* <Image 
          source={{ uri: item.images.length > 0 ? item.images[0] : <Image source={require('../../../assets/imgs/abc.png')} />}} // Lấy ảnh đầu tiên hoặc ảnh mặc định
          style={styles.productImage}
        /> */}
        <TouchableOpacity>
        <Image 
  source={item.images.length > 0 && item.images[0] ? { uri: item.images[0] } : require('../../../assets/imgs/abc.png')}
  style={styles.productImage}
/>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </TouchableOpacity>
        </View>
       
          )}}
        />
      </View>

      {/* New In */}
      {/* <View style={styles.productHeader}>
        <Text style={styles.sectionTitle}>New In</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen')}>
  <Text style={styles.seeAllText}>See All</Text>
    </TouchableOpacity>
      </View> */}
      <View style={styles.productSection}>
        {/* Hiển thị sản phẩm mới */}
        {/* <FlatList
          data={products.slice(2, 5)} // Hiển thị sản phẩm từ 3 đến 5
          keyExtractor={(item) => item._id}
          horizontal // Thay đổi ở đây để hiển thị nằm ngang
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image
                source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
          )}
        /> */}
        
      </View>
    </ScrollView>
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
    width: 24,
    height: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    width: 342,
    height: 40,
    paddingHorizontal: 19,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
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
  },
  seeAllText: {
    fontSize: 14,
    color: '#000',
    textDecorationLine: 'underline',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryItem: {
    marginRight: 10,
    alignItems: 'center',
  },
  categoryImage: {
    width: 60,
    height: 60,
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    marginRight: 10,
    padding: 10,
  },
  productImage: {
    width: 160,
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 18, 
    marginBottom: 4,
    textAlign: 'center', 
    color: '#000', 
  },
  productPrice: {
    fontSize: 16, 
    color: '#ff5722', 
    marginTop: 2, 
    textAlign: 'center',
  },
});

export default HomeScreen;
