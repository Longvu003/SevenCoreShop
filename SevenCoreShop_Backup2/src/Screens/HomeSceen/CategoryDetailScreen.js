    import React, { useEffect, useState } from 'react';
    import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
    import axios from 'axios';

    const CategoryDetailScreen = ({ route }) => {
    const { category } = route.params;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`http://192.168.1.3:7777/products/category/${category._id}`)
        .then(response => {
            console.log(response.data);
            // console.log(products);
            setProducts(response.data.data);
        })
        .catch(error => console.error('Lỗi lấy sản phẩm:', error));
    }, [category._id]);

    return (
        <View style={styles.container}>
        <Text style={styles.title}>{category.name}</Text>
        <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
            <View style={styles.productCard}>
                <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
            </View>
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

    export default CategoryDetailScreen;
