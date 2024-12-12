import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React from 'react';
import API__URL from '../../../config';
import axios from 'axios';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
import Customheader from '../../CustomHeader/Customheader';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SearchOrder = ({navigation}) => {
  const [dataOrder, setDataOrder] = useState([]);
  const [seacrh, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async query => {
    setSearch(query);
    const respone = await axios.post(`${API__URL}/orders/searchOrder`, {
      query,
    });
    setDataOrder(respone.data);
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     setLoading(true);
  //     getProductDetails();
  //   }, []),
  // );
  useEffect(() => {
    setLoading(true);
    handleSearch();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{height: HEIGHT__SCREEN * 0.06}}>
        <Customheader
          leftIcon={require('../../../assets/imgs/back4.png')}
          title="Lịch sử giao hàng"
        />
      </View>
      <View style={{height: HEIGHT__SCREEN * 0.1}}>
        <TextInput
          style={styles.input__search}
          placeholder="Tìm kiếm "
          value={seacrh}
          onChangeText={text => handleSearch(text)}
          autoCapitalize="none"
        />
      </View>

      {dataOrder.length > 0 ? (
        <ScrollView
          style={{flex: 4, marginHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
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
        </ScrollView>
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
  );
};

const styles = StyleSheet.create({
  input__search: {
    borderColor: 'black',
    borderWidth: 1,
    width: WIDTH__SCREEN * 0.9,
    marginHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
  },
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

export default SearchOrder;
