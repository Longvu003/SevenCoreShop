import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
import API__URL from '../../../config';

const AdScreen = ({ navigation }) => {
  const [listAds, setListAd] = useState([]);
  const [indexActive, setIndexActive] = useState(0);
  const flalitRef = useRef(null);

  const getItemLayout = (data, index) => ({
    length: WITH__Screen, // Kích thước mỗi mục là chiều rộng màn hình
    offset: WITH__Screen * index, // Vị trí của mục trong danh sách
    index: index, // Chỉ mục của phần tử
  });

  const getAd = async () => {
    try {
      const response = await axios.get(`${API__URL}/ads/`);
      if (response.status === 200) {
        setListAd(response.data);
      } else {
        console.log('Lỗi khi lấy quảng cáo');
      }
    } catch (error) {
      console.log('Lỗi mạng hoặc API', error);
    }
  };

  useEffect(() => {
    getAd();
  }, []);

  const scrollItem = (event) => {
    const indexScroll = event.nativeEvent.contentOffset.x;
    const index = Math.round(indexScroll / WITH__Screen);
    setIndexActive(index);
  };

  const indicatePage = () => {
    return listAds.map((item, index) => {
      if (indexActive === index) {
        return (
          <View
            key={index}
            style={{
              backgroundColor: 'green',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 10,
            }}
          />
        );
      } else {
        return (
          <View
            key={index}
            style={{
              backgroundColor: 'orange',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 10,
            }}
          />
        );
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (listAds.length > 0) {
        if (indexActive === listAds.length - 1) {
          flalitRef.current.scrollToIndex({
            index: 0,
            animated: true,
          });
        } else {
          flalitRef.current.scrollToIndex({
            index: indexActive + 1,
            animated: true,
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [indexActive, listAds]); // Chạy lại useEffect khi indexActive hoặc listAds thay đổi

  return (
    <View>
      {listAds.length === 0 ? (
        <Text>Loading...</Text> // Hiển thị khi dữ liệu chưa được tải xong
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          horizontal={true}
          data={listAds}
          onScroll={scrollItem}
          ref={flalitRef}
          getItemLayout={getItemLayout}
          renderItem={({ item }) => {
            return (
              <View>
                <TouchableOpacity onPress={() => navigation.navigate('AdDetail', { item })}>
                  <Image
                    style={{ width: WITH__Screen, height: 200 }}
                    source={{
                      uri: item.image,
                    }}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item) => item._id}
        />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
        {indicatePage()}
      </View>
    </View>
  );
};

export default AdScreen;

const styles = StyleSheet.create({});
