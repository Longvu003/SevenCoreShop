import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Customheader from '../../../CustomHeader/Customheader';
import {useState} from 'react';
import {Dimensions} from 'react-native';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const EditAddress = () => {
  const [addressInformation, setAddressInformation] = useState('');
  const [addressCity, setAddressCity] = useState('');
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../../assets/imgs/back.png')}
          title="Thêm địa chỉ"
        />
      </View>
      <View style={{flex: 8}}>
        <TextInput
          style={styles.input}
          placeholder="phường, xã, huyện "
          onChangeText={text => setAddressInformation(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Thành phố "
          onChangeText={text => setAddressCity(text)}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <TouchableOpacity style={styles.btn__Save}>
          <Text style={styles.txt__btn}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default EditAddress;
const styles = StyleSheet.create({
  txt__btn: {
    color: 'white',
    fontWeight: '800',
  },
  btn__Save: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: WITH__Screen * 0.8,
    height: HEIGHT__SCREEN * 0.07,
    borderRadius: 40,
  },
  input: {
    width: WITH__Screen * 1,
    height: HEIGHT__SCREEN * 0.07,
    backgroundColor: '#F4F4F4',
    marginTop: 20,
  },
});
