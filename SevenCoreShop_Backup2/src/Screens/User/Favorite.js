import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeStyle from '../../StyleSheets/HomeStyle';
import Customheader from '../../CustomHeader/Customheader';

const Favorite = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchProducts = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                setError("Không tìm thấy thông tin người dùng.");
                setLoading(false);
                return;
            }
            const newUserId = JSON.parse(userId);

            const response = await axios.get(`${API__URL}/favorite/getFavorites?userId=${newUserId}`);
            if (response.data.status) {
                setProducts(response.data.data); // Nếu có sản phẩm yêu thích
            } else {
                // Nếu danh sách trống
                setProducts([]); // Gán danh sách rỗng thay vì báo lỗi
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Đã xảy ra lỗi khi tải sản phẩm.');
        } finally {
            setLoading(false);
        }
    };


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
        fetchProducts();
        getInforUser();
    }, []);

    // Xử lý xóa sản phẩm khỏi danh sách yêu thích
    const removeFavorite = async (productId) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                setError("Không tìm thấy thông tin người dùng.");
                return;
            }
            const newUserId = JSON.parse(userId);
            const response = await axios.delete(
                `${API__URL}/favorite/removeFavorite?userId=${newUserId}&productId=${productId}`
            );

            if (response.data.status) {
                // Lọc ra danh sách sản phẩm mới sau khi xóa
                setProducts((prevProducts) =>
                    prevProducts.filter((item) => item.productId._id !== productId)
                );
            } else {
                setError("Không có sản phẩm yêu thích.");
            }
        } catch (error) {
            console.log('Error deleting favorite:', error);
            setError('Đã xảy ra lỗi khi xóa sản phẩm.');
        }
    };



    // Xử lý trường hợp không có dữ liệu hoặc đang tải
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Đang tải...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={HomeStyle.container}>
            {/* Header */}
            <Customheader
                leftIcon={require('../../../assets/imgs/back4.png')}
                onLeftPress={() => navigation.goBack()}
                title={'Sản phẩm yêu thích'}
                containerStyle={styles.customHeaderContainer}
            />

            {/* Kiểm tra nếu danh sách trống */}
            {products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có sản phẩm yêu thích nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ProductDetail', { item })}
                        >
                            <View style={HomeStyle.productCard}>
                                <TouchableOpacity
                                    style={HomeStyle.heartIcon}
                                    onPress={() => removeFavorite(item.productId._id)}
                                >
                                    <Image
                                        source={require('../../../assets/imgs/heart1.png')}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: item.images[0] }}
                                    style={HomeStyle.productImage}
                                />
                                <Text numberOfLines={2} style={HomeStyle.productName}>
                                    {item.name}
                                </Text>
                                <Text style={HomeStyle.productPrice}>{item.price} Vnđ</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

};

const styles = StyleSheet.create({
    customHeaderContainer: {
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
        paddingVertical: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
    },
});

export default Favorite;
