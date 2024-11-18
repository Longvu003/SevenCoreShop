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
const OrderScreen = () => {
  const [dataOrder, setDataOrder] = useState();
  const [productDetails, setProductDetails] = useState([]);
  const getProductDetails = async () => {
    try {
      const response = await axios.get(`${API__URL}/Orders/getOrderUser`);
      setDataOrder(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      return null;
    }
  };
  useFocusEffect(
    useCallback(() => {
      getProductDetails();
    }, []),
  );
  return (
    <ScrollView style={styles.container}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Customheader title="Lịch sử giao hàng" />
        </View>
        <View style={{flex: 1}}>
          <FlatList
            scrollEnabled={false}
            data={dataOrder}
            renderItem={({item}) => {
              return (
                <TouchableOpacity>
                  <View style={styles.layout__container}>
                    <View style={styles.item__container}>
                      <Image
                        style={{width: 40, height: 60}}
                        source={{uri: item.items[0].images[0]}}
                      />
                      <View>
                        <Text style={styles.txt__Item}>
                          Đơn hàng: {item._id}
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
    marginHorizontal: 2,
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

export default OrderScreen;
