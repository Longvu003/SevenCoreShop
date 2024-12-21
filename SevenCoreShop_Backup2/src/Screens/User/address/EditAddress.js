import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import React from 'react';
import Customheader from '../../../CustomHeader/Customheader';
import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API__URL from '../../../../config';
import {useFocusEffect} from '@react-navigation/native';
const WITH__Screen = Dimensions.get('screen').width;
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const EditAddress = ({navigation}) => {
  const [addressInformation, setAddressInformation] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  // console.log(addressInformation);
  const getEmailUser = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const newUserEmail = JSON.parse(userEmail);
      const url = `${API__URL}/users/getUserEmail?email=${newUserEmail}`;
      if (newUserEmail) {
        const respone = await axios.get(url);
        setAddressInformation(respone.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const changeAddress = async (inputData, value) => {
    setAddressInformation(oldData => ({
      ...oldData,
      [inputData]: value,
    }));
  };

  const updateUser = async e => {
    const userId = await AsyncStorage.getItem('userId');
    const newUserId = JSON.parse(userId);
    const url2 = `${API__URL}/users/${newUserId}/updateuserbyid`;

    try {
      if (addressInformation.address.length < 5) {
        setErrorMessage('Địa chỉ phải có ít nhất 10 ký tự');
      } else {
        await axios.post(url2, addressInformation, {
          headers: 'application/x-www-form-urlencoded',
        });
        Alert.alert('Thông báo', 'Sửa thành công');
        navigation.navigate('ListAddress');
        setErrorMessage(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEmailUser();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Customheader
          leftIcon={require('../../../../assets/imgs/back.png')}
          title="Thêm địa chỉ"
        />
      </View>
      <View style={{flex: 8}}>
        <FlatList
          data={addressInformation}
          renderItem={({item}) => {
            console.log(item);
            return (
              <TextInput
                style={styles.input}
                placeholder="phường, xã, huyện,TP "
                onChangeText={text => changeAddress('address', text)}
                value={item.address}
                keyboardType="email-address"
              />
            );
          }}
        />

        {errorMessage ? (
          <Text style={styles.txt__error}>{errorMessage}</Text>
        ) : null}
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <TouchableOpacity style={styles.btn__Save} onPress={() => updateUser()}>
          <Text style={styles.txt__btn}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default EditAddress;
const styles = StyleSheet.create({
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
    width: WITH__Screen * 0.8,
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
