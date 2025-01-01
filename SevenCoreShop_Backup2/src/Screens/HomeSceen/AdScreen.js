import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
import API__URL from '../../../config';
const AdScreen = ({navigation}) => {
  const [listAds, setListAd] = useState([]);
  const getItemlayout = (data, index) => ({
    length: WITH__Screen,
    offset: WITH__Screen * index,
    index: index,
  });
  const getAd = async () => {
    const response = await axios.get(`${API__URL}/ads/`);
    if (response.status === 200) {
      setListAd(response.data);
    } else {
      console.log('lỗi lấy quảng cáo');
    }
  };
  useEffect(() => {
    getAd();
  }, []);

  const flalitRef = useRef();
  const [indexActive, setIndexActive] = useState(0);
  const scrollItem = event => {
    const indexScroll = event.nativeEvent.contentOffset.x;
    // console.log('tọa độ roll', indexScroll);
    const index = Math.round(indexScroll / WITH__Screen);
    // console.log('vị trí ', index);
    setIndexActive(index);
  };

  const indicatePage = () => {
    return listAds.map((item, index) => {
      if (indexActive === index) {
        // console.log('Đây là index nè', index);
        return (
          <View
            key={index}
            style={{
              backgroundColor: 'green',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 10,
            }}></View>
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
            }}></View>
        );
      }
    });
  };
  useEffect(() => {
    const intervral = setInterval(() => {
      if (indexActive === listAds.length - 1) {
        flalitRef.current.scrollToIndex({
          index: 0,
          animation: true,
        });
      } else {
        flalitRef.current.scrollToIndex({
          index: indexActive + 1,
          animation: true,
        });
      }
    }, 3000);
    return () => clearInterval(intervral);
  });
  return (
    <View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        horizontal={true}
        data={listAds}
        onScroll={scrollItem}
        ref={flalitRef}
        getItemLayout={getItemlayout}
        renderItem={({item}) => {
          return (
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('AdDetail', {item})}>
                <Image
                  style={{width: WITH__Screen, height: 200}}
                  source={{
                    uri: item.image,
                  }}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={item => item._id}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30,
        }}>
        {indicatePage()}
      </View>
    </View>
  );
};

export default AdScreen;

const styles = StyleSheet.create({});
