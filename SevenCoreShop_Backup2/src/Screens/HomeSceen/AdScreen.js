import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const AdScreen = () => {
  const getItemlayout = (data, index) => ({
    length: WITH__Screen,
    offset: WITH__Screen * index,
    index: index,
  });

  const listAd = [
    {
      id: 1,
      title: 'Áo siêu mỏng',
      tag: 'Áo',
      description: 'Cái áo này rất là mỏng',
      image: require('../../../assets/imgs/abc.png'),
    },
    {
      id: 2,
      title: 'Áo siêu dày',
      tag: 'Áo',
      description: 'Cái áo này rất là dày',
      image: require('../../../assets/imgs/logo.png'),
    },
    {
      id: 3,
      title: 'Quần sort đi biển',
      tag: 'Áo',
      description: 'Quần sort đi biển  này dùng để đi biển thì tuyệt vời lắm',
      image: require('../../../assets/imgs/bg.png'),
    },
  ];
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
    return listAd.map((item, index) => {
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
      if (indexActive === listAd.length - 1) {
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
    }, 2000);
    return () => clearInterval(intervral);
  });
  return (
    <View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        horizontal={true}
        data={listAd}
        onScroll={scrollItem}
        ref={flalitRef}
        getItemLayout={getItemlayout}
        renderItem={({item}) => {
          return (
            <View>
              <Image
                style={{width: WITH__Screen, height: 200}}
                source={item.image}
              />
            </View>
          );
        }}
        keyExtractor={item => item.id}
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
