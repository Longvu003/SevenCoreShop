import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import API__URL from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Customheader from '../../CustomHeader/Customheader';

const WIDTH__SCREEN = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;

const ChangePassword = () => {
  const [newPass, setNewPass] = useState();

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader leftIcon={require('../../../assets/imgs/back4.png')} />
        <Text style={styles.txt__changePassword}>Đổi mật khẩu</Text>
      </View>

      <View style={{flex: 1, alignItems: 'center'}}>
        <TextInput
          style={styles.btn__input}
          placeholder="Nhập mật khẩu mới"
          onChangeText={text => setNewPass(text)}
        />
      </View>

      <View style={{flex: 8, alignItems: 'center'}}>
        <TouchableOpacity style={styles.btn__accept}>
          <Text style={styles.txt__accept}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  btn__input: {
    width: WIDTH__SCREEN * 0.9,
    height: HEIGHT__SCREEN * 0.08,
    backgroundColor: '#f4f4f4',
    marginVertical: 20,
  },
  txt__accept: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
  btn__accept: {
    backgroundColor: 'black',
    width: WIDTH__SCREEN * 0.9,
    height: HEIGHT__SCREEN * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 20,
  },
  txt__changePassword: {
    fontSize: 32,
    fontWeight: '700',
    color: 'black',
    marginLeft: 27,
    marginTop: 20,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
