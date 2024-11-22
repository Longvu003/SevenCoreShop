import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';

const CategoryScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách các danh mục
    axios
      .get(`${API__URL}/categories/getAllCategory`)
      .then(response => {
        const fixResponse = Object.values(response.data);

        setCategories(fixResponse[1]);
      })
      .catch(error => console.log('Lỗi lấy danh mục:', error));
  }, []);

  const handleCategoryPress = category => {
    navigation.navigate('CategoryDetailScreen', {category});
  };

  return (
    <View style={styles.container}>
      {/* Header view for back button and title */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Shop by Categories</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleCategoryPress(item)}>
            <View style={styles.categoryCard}>
              <Image
                source={{uri: item.images[0]}}
                style={styles.categoryImage}
              />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30, // Adjusted margin for spacing
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 50,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 15,
  },
  categoryName: {
    fontSize: 18,
    color: 'black',
  },
});

export default CategoryScreen;
