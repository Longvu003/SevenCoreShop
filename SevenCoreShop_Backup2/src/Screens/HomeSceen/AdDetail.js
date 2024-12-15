import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Customheader from '../../CustomHeader/Customheader';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const AdDetail = ({route}) => {
  const {item} = route.params;
  const [dataAD, setDataAd] = useState(item);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader leftIcon={require('../../../assets/imgs/back4.png')} />
      </View>
      <View style={{flex: 5, alignItems: 'center'}}>
        <Text style={styles.txt__title}>{item.title}</Text>
        <TouchableOpacity>
          <Text style={[styles.txt__ad, {color: 'blue', fontStyle: 'italic'}]}>
            #{item.tag}
          </Text>
        </TouchableOpacity>
        <Image style={styles.img__item} source={{uri: dataAD.image}} />
      </View>
      <View style={{flex: 2}}>
        <Text style={styles.txt__ad}>{dataAD.description}</Text>
      </View>
    </View>
  );
};

export default AdDetail;

const styles = StyleSheet.create({
  txt__title: {
    fontSize: 23,
    color: 'orange',
    fontWeight: '900',
    marginHorizontal: 10,
  },
  txt__ad: {
    fontSize: 16,
    color: 'black',
    width: WITH__Screen * 0.9,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  img__item: {
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.4,
  },
});
