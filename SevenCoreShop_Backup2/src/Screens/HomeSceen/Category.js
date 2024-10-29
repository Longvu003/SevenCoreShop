import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Gọi API để lấy danh sách các danh mục
    axios.get('http://192.168.1.3:7777/categories')
      .then(response => {
        // Chuyển đổi dữ liệu nếu cần và lưu vào state
        const fixResponse = Object.values(response.data);
        setCategories(fixResponse[1]);
      })
      .catch(error => console.error('Lỗi lấy danh mục:', error));
  }, []);

  const handleCategoryPress = (category) => {
    // Điều hướng tới màn hình chi tiết danh mục (CategoryDetail), truyền danh mục qua navigation
    navigation.navigate('CategoryDetail', { category });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategoryPress(item)}>
            <View style={styles.categoryCard}>
              <Image source={{ uri: item.images[0] }} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', 
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  categoryName: {
    fontSize: 18,
    color: 'black',
  },
});

export default CategoryScreen;
