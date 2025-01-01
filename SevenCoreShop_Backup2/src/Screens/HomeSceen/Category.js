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
import Customheader from '../../CustomHeader/Customheader'; // Đường dẫn tới Customheader

const CategoryScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${API__URL}/categories/`)
      .then(response => {
        const fixResponse = response.data.data;
        setCategories(fixResponse);
      })
      .catch(error => console.log('Lỗi lấy danh mục:', error));
  }, []);

  const handleCategoryPress = category => {
    navigation.navigate('CategoryDetailScreen', {category});
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Customheader
        leftIcon={require('../../../assets/imgs/back4.png')}
        onLeftPress={() => navigation.goBack()}
        title="Loại Sản Phẩm"
        containerStyle={styles.customHeaderContainer}
      />

      {/* Danh sách danh mục */}
      <FlatList
        data={categories}
        keyExtractor={item => item._id}
        contentContainerStyle={{marginTop: 20}}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#fff',
  },
  customHeaderContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 10,
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
