import {StyleSheet, Dimensions} from 'react-native';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const CartStyle = StyleSheet.create({
  txt__nodata: {fontSize: 24, color: 'Black', fontWeight: '700', marginTop: 24},
  container__nodata: {
    alignItems: 'center',
    justifyContent: 'center',
    height: HEIGHT__SCREEN * 0.8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  removeAllBtn: {
    marginTop: 10,
    paddingRight: 20,
    alignSelf: 'flex-end',
  },
  txt__remove: {
    fontSize: 18,
    color: '#FF0000',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgProduct: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: WIDTH__SCREEN * 0.5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#555555',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemActions: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    width: WIDTH__SCREEN * 0.2,
  },
  totalPriceContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  btnCheckout: {
    backgroundColor: '#333',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCheckoutText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CartStyle;
