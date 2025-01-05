import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;

const OrderScreenStyle = StyleSheet.create({
  container__noOrder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: HEIGHT__SCREEN * 0.8,
  },
  txt__noOder: {
    fontSize: 24,
    color: 'Black',
    fontWeight: '700',
    marginTop: 24,
  },
  btn__status: {
    width: 90,
    height: 40,
    borderRadius: 30,
    // backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
export default OrderScreenStyle;
