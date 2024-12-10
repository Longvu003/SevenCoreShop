import React, {useState, useEffect, useCallback} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const OrderScreen = ({navigation}) => {
  const [dataOrder, setDataOrder] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const getProductDetails = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const newUserId = JSON.parse(userId);
    try {
      const response = await axios.get(
        `${API__URL}/Orders/getOrderUserById?userId=${newUserId}`,
      );
      setDataOrder(response.data);
    } catch (error) {
      console.log('Lỗi khi lấy thông tin sản phẩm:', error);
      return null;
    }
  };
  useFocusEffect(
    useCallback(() => {
      getProductDetails();
    }, []),
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Customheader title="Lịch sử giao hàng" />
        </View>
        {dataOrder.length > 0 ? (
          <View style={{flex: 1, marginHorizontal: 20}}>
            <FlatList
              scrollEnabled={false}
              data={dataOrder}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('DetailOrder', {item})}>
                    <View style={styles.layout__container}>
                      <View style={styles.item__container}>
                        <Image
                          style={{width: 40, height: 60}}
                          source={{uri: item.items[0].image[0]}}
                        />
                        <View>
                          <Text style={styles.txt__Item}>
                            Đơn hàng: {item._id}
                          </Text>
                          <Text numberOfLines={1} style={styles.txt__Item}>
                            {item.items[0].name}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text style={{marginHorizontal: 30}}>
                              {item.createdAt}
                            </Text>
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
              keyExtractor={item => item._id}
            />
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: HEIGHT__SCREEN * 0.8,
            }}>
            <Image source={require('../../../assets/imgs/cart3.png')} />
            <Text
              style={{
                fontSize: 24,
                color: 'Black',
                fontWeight: '700',
                marginTop: 24,
              }}>
              Không có đơn hàng
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginHorizontal: 10,
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
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    marginHorizontal: 20,
    width: WIDTH__SCREEN * 0.6,
  },
});

export default OrderScreen;
