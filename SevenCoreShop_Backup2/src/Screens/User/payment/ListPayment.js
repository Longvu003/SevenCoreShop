import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import Customheader from '../../../CustomHeader/Customheader';

import {Dimensions} from 'react-native';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const ListPayment = ({route, navigation}) => {
  //  const {dataUser}=route.params
  const ListPayment = [
    {
      id: 1,
      location: '0123123123 ',
    },
    {
      id: 2,
      location: '3123123123',
    },
  ];
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../../assets/imgs/back.png')}
          title="Thanh toán"
        />
      </View>
      <View style={{flex: 8}}>
        <Text>Thẻ</Text>
        <FlatList
          data={ListPayment}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.btn__list}
              onPress={() => navigation.navigate('EditAddress')}>
              <Text style={styles.img__list}>{item.location}</Text>
              <Image
                style={[styles.img__list, {marginRight: 20}]}
                source={require('../../../../assets/imgs/Vector.png')}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

export default ListPayment;

const styles = StyleSheet.create({
  img__list: {
    fontWeight: '700',
    marginLeft: 20,
  },

  btn__list: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#F4F4F4',
    height: HEIGHT__SCREEN * 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
