import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Customheader from '../../CustomHeader/Customheader';
import {Dimensions} from 'react-native';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const Order = ({route}) => {
  const [dataOrder, setDataOrder] = useState();
  const [productDetails, setProductDetails] = useState([]);
  const getProductDetails = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const newUserId = JSON.parse(userId);
    try {
      const response = await axios.get(
        `${API__URL}/Orders/getOrderUser?id=${newUserId}`,
      );
      setDataOrder(response.data.userId);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      return null;
    }
  };
  const dataFake = [
    {
      id: '#1231231',
      imgs: require('../../../assets/imgs/Order.png'),
      day: '22/10/2024',
    },
    {
      id: '#2231231',
      imgs: require('../../../assets/imgs/Order.png'),
      day: '25/10/2024',
    },
    {
      id: '#3231231',
      imgs: require('../../../assets/imgs/Order.png'),
      day: '29/10/2024',
    },
  ];
  useEffect(() => {
    getProductDetails();
    // const fetchProductDetails = async () => {
    //   if (order && order.items && order.items.length > 0) {
    //     const details = await Promise.all(
    //       order.items.map(async item => {
    //         const product = await getProductDetails(item.productId);
    //         return {...item, product}; // Kết hợp thông tin sản phẩm và số lượng trong đơn hàng
    //       }),
    //     );
    //     setProductDetails(details);
    //   }
    // };

    // if (order) {
    //   fetchProductDetails();
    // }
  }, []);
  // console.log(dataOrder);
  return (
    <ScrollView style={styles.container}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Customheader title="Lịch sử giao hàng" />
        </View>
        <View style={{flex: 1}}>
          <FlatList
            scrollEnabled={false}
            data={dataFake}
            renderItem={({item}) => {
              // console.log(item);
              return (
                <TouchableOpacity>
                  <View style={styles.layout__container}>
                    <View style={styles.item__container}>
                      <View>
                        <Text style={styles.txt__Item}>
                          Đơn hàng: {item.id}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Image source={item.imgs} />
                          <Text style={{marginHorizontal: 20}}>{item.day}</Text>
                        </View>
                      </View>

                      <Image
                        source={require('../../../assets/imgs/Vector.png')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item__container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 36,
    alignItems: 'center',
  },
  layout__container: {
    backgroundColor: '#f4f4f4',
    marginVertical: 12,
    width: WIDTH__SCREEN * 0.9,
    height: HEIGHT__SCREEN * 0.1,
    justifyContent: 'center',
  },
  txt__Item: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    marginHorizontal: 30,
  },
});

export default Order;
