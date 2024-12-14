import {StyleSheet, Text, View, Dimensions} from 'react-native';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const ProductDetailStyle = StyleSheet.create({
  container__comment: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input__comment: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  img__product: {
    width: WIDTH__SCREEN * 0.9,
    height: HEIGHT__SCREEN * 0.35,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  txt__nameProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 24,
    marginHorizontal: 24,
    color: 'black',
  },
  txt__priceProduct: {
    fontSize: 18,
    color: 'A2845E',
    marginVertical: 24,
    marginHorizontal: 24,
  },
  btn__container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    backgroundColor: '#F4F4F4',
    width: WIDTH__SCREEN * 0.9,
    marginHorizontal: 20,
    borderRadius: 20,
    height: HEIGHT__SCREEN * 0.07,
  },
  quantity__Container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  btn__buy: {
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 22,
    width: WIDTH__SCREEN * 0.9,
    marginHorizontal: 20,
    height: HEIGHT__SCREEN * 0.07,
    justifyContent: 'center',
  },
  txt__btnbuy: {
    color: '#fff',
    fontWeight: 'bold',
  },
  txt__description: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  smallButton: {
    marginHorizontal: 5,
  },
  btnCmtContainer: {
    alignItems: 'center',
  },
  btnCmt: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  btnCmtText: {
    color: '#fff',
  },
});
export default ProductDetailStyle;
