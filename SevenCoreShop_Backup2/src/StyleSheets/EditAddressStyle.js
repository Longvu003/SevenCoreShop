import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const EditAddressStyle = StyleSheet.create({
  btn__radioCheck: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'orange',
    marginHorizontal: 10,
  },

  container__radiobutton: {
    width: WITH__Screen * 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: 'orange',
  },
  btn__setIsDefault: {
    backgroundColor: 'black',
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 30,
    marginTop: 30,
  },
  input: {
    borderRadius: 30,
    width: WITH__Screen * 0.9,
    marginHorizontal: 20,
    height: HEIGHT__SCREEN * 0.1,
  },
  txt__error: {
    marginHorizontal: 10,
    color: 'red',
  },
  txt__btn: {
    color: 'white',
    fontWeight: '800',
  },
  btn__Save: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.07,
    borderRadius: 20,
  },
  input: {
    width: WITH__Screen * 0.9,
    height: HEIGHT__SCREEN * 0.08,
    backgroundColor: '#F4F4F4',
    marginTop: 20,
    marginHorizontal: 20,
  },
});
export default EditAddressStyle;
