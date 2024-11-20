import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;
const UserStyleSheet = StyleSheet.create({
  txt__Signout: {
    fontSize: 20,
    color: 'red',
    fontWeight: '700',
  },
  txt__container: {
    marginHorizontal: 20,
    color: 'black',
    fontWeight: '700',
  },

  container__layout: {
    marginTop: 8,
    backgroundColor: '#F4F4F4',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: WIDTH__SCREEN * 0.2,
    width: WIDTH__SCREEN * 0.9,
    marginHorizontal: 20,
  },
  header__Layout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F4',
    height: HEIGHT__SCREEN * 0.1,
    width: WIDTH__SCREEN * 0.9,
    marginHorizontal: 20,
  },
  btn__Edit: {
    marginRight: 20,
    color: 'black',
    fontSize: 15,
    fontWeight: '700',
  },

  txt__header: {
    color: 'black',
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 20,
  },
  header__Information: {
    backgroundColor: 'white',
    flex: 2,
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  layout__Img: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img__User: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4F4F4',
  },
});
export default UserStyleSheet;
