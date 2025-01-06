import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';
const PopularProductsScreen = ({navigation}) => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  const fetchPopularProducts = async () => {
    try {
      const response = await axios.get(`${API__URL}/Orders/pho-bien`, {
        params: {limit: 10}, // Lấy 10 sản phẩm phổ biến
      });
      if (response.data && Array.isArray(response.data.data)) {
        const validProducts = response.data.data.map(item => ({
          ...item,
          images: item.image || [], // Đổi từ `image` thành `images`
          description: item.description || 'Không có mô tả.', // Thêm mô tả mặc định
        }));

        setProducts(validProducts); // Lưu dữ liệu hợp lệ vào state
      } else {
        throw new Error('Dữ liệu API không hợp lệ.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm phổ biến:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải danh sách sản phẩm phổ biến, vui lòng thử lại.',
      );
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Sản Phẩm Phổ Biến</Text>
      <View style={{flex: 0.7}}>
        <Customheader leftIcon={require('../../../assets/imgs/back4.png')} />
      </View>

      {/* Trạng thái loading */}
      {loading ? (
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      ) : (
        <View style={{flex: 8}}>
          <FlatList
            data={products}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.productListContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    item, // Truyền sản phẩm đã chuẩn hóa
                  })
                }>
                <Image
                  source={{
                    uri: item.images?.[0] || 'https://via.placeholder.com/150', // Sử dụng ảnh đầu tiên, hoặc ảnh mặc định
                  }}
                  style={styles.productImage}
                />
                {/* Tên sản phẩm */}
                <Text numberOfLines={2} style={styles.productName}>
                  {item.name || 'Tên sản phẩm không có'}
                </Text>
                {/* Giá sản phẩm */}
                <Text style={styles.productPrice}>
                  Giá: {item.price?.toLocaleString() || 'Không có giá'} VND
                </Text>
                {/* Tổng số lượng bán */}
                <Text style={styles.productQuantity}>
                  Số lượng bán: {item.totalQuantity || 0}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>
                Hiện không có sản phẩm phổ biến.
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  productListContainer: {
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default PopularProductsScreen;
