// HomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://192.168.1.3:7777/products')
      .then(response => {
        setProducts(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    axios.get('http://192.168.1.3:7777/categories')
      .then(response => {
        const fixResponse = Object.values(response.data);
        setCategories(fixResponse[1]);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleSearch = () => {
    if (searchKey.trim() === '') {
      axios.get('http://192.168.1.3:7777/products')
        .then(response => {
          setProducts(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    } else {
      axios.get(`http://192.168.1.3:7777/products/tim-kiem?key=${searchKey}`)
        .then(response => {
          setProducts(response.data.data);
        })
        .catch(error => {
          console.error('Error searching products:', error);
        });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          {/* Placeholder for cart icon */}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search" 
          value={searchKey} 
          onChangeText={(text) => setSearchKey(text)} 
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoryHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Category')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.length > 0 ? categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.categoryItem} 
              onPress={() => navigation.navigate('CategoryDetail', { category })}
            >
              <Image 
                source={{ uri: category.images && category.images.length > 0 ? category.images[0] : 'https://via.placeholder.com/50' }}
                style={styles.categoryImage} 
              />
              <Text>{category.name}</Text>
            </TouchableOpacity>
          )) : (
            <Text>No categories available</Text>
          )}
        </ScrollView>
      </View>

      {/* Top Selling */}
      <View style={styles.productHeader}>
        <Text style={styles.sectionTitle}>Top Selling</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productSection}>
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <TouchableOpacity>
                <Image 
                  source={item.images && item.images.length > 0 ? { uri: item.images[0] } : require('../../../assets/imgs/abc.png')}
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
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
    color:  'black',
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
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
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
