import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Customheader from '../../CustomHeader/Customheader';
import {useFocusEffect} from '@react-navigation/native';
import {useCart} from '../Cart/CartProdvider';
import OrderScreenStyle from '../../StyleSheets/OrderScreenStyle';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const OrderScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {getProductDetails, dataOrder} = useCart();
  const [statusOrder, setStatusOrder] = useState('');
  const [orderFilter, setOrderFilter] = useState([]);

  const getOrderBystatus = () => {
    if (statusOrder) {
      const data = dataOrder.filter(item => item.status === statusOrder);
      setOrderFilter(data);
    } else {
      setOrderFilter(dataOrder);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      getProductDetails();
    }, []),
  );
  useEffect(() => {
    getOrderBystatus();
  }, [statusOrder]);
  return (
    <View style={{flex: 1}}>
      <View style={{height: HEIGHT__SCREEN * 0.06}}>
        <Customheader title="Lịch sử giao hàng" />
      </View>
      <View style={{height: HEIGHT__SCREEN * 0.04}}>
        <TouchableOpacity
          style={{width: 50}}
          onPress={() => navigation.navigate('SearchOrder')}>
          <Image
            style={{marginHorizontal: 20}}
            source={require('../../../assets/imgs/search.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity
          style={OrderScreenStyle.btn__status}
          onPress={() => setStatusOrder('Đã hủy')}>
          <Text>Đã hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={OrderScreenStyle.btn__status}
          onPress={() => setStatusOrder('Đang xử lý')}>
          <Text>Đang xử lý</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={OrderScreenStyle.btn__status}
          onPress={() => setStatusOrder('Đã giao hàng')}>
          <Text>Đã giao hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={OrderScreenStyle.btn__status}
          onPress={() => setStatusOrder('Giao thành công')}>
          <Text>Giao thành công</Text>
        </TouchableOpacity>
      </View>
      {orderFilter.length > 0 ? (
        <ScrollView
          style={{flex: 4, marginHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          <FlatList
            scrollEnabled={false}
            data={orderFilter}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('DetailOrder', {item})}>
                  <View style={OrderScreenStyle.layout__container}>
                    <View style={OrderScreenStyle.item__container}>
                      <Image
                        style={{width: 40, height: 60}}
                        source={{uri: item.items[0].image[0]}}
                      />
                      <View>
                        <Text style={OrderScreenStyle.txt__Item}>
                          Trạng thái đơn hàng: {item.status}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={OrderScreenStyle.txt__Item}>
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
        </ScrollView>
      ) : (
        <View style={OrderScreenStyle.container__noOrder}>
          <Image source={require('../../../assets/imgs/cart3.png')} />
          <Text style={OrderScreenStyle.txt__noOder}>Không có đơn hàng</Text>
        </View>
      )}
    </View>
  );
};

export default OrderScreen;
