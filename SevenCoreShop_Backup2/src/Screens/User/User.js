import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import React, {useCallback} from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserStyleSheet from '../../StyleSheets/UserStyleSheet';
import {useFocusEffect} from '@react-navigation/native';
import API__URL from '../../../config';
const User = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const renderUser = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const newUserEmail = JSON.parse(userEmail);
    const url = `${API__URL}/users/getUserEmail/?email=${newUserEmail}`;
    try {
      if (newUserEmail) {
        const response = await axios.get(url);
        const newnew = Object.values(response.data);
        setUser(newnew);
      } else {
        console.log('Lỗi không thấy email');
      }
    } catch (error) {
      console.log('lỗi nè :', error);
      setLoading(true);
    }
  };
  const Logout = () => {
    Alert.alert('Đăng xuất', 'Bạn có muốn đăng xuất không ?', [
      {text: 'Trở lại ', onPress: () => console.log('Xác nhận trở lại')},
      {
        text: 'xác nhận',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('userEmail');
            navigation.replace('LoginScreen');
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };
  useFocusEffect(
    useCallback(() => {
      renderUser();
    }, []),
  );
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={UserStyleSheet.layout__Img}>
        <Image
          style={UserStyleSheet.img__User}
          source={require('../../../assets/imgs/logo.png')}
        />
      </View>
      <View style={UserStyleSheet.header__Information}>
        <View style={UserStyleSheet.header__Layout}>
          <FlatList
            data={user}
            renderItem={({item}) => (
              <TouchableOpacity>
                <Text style={UserStyleSheet.txt__header}>{item.username}</Text>
                <Text style={[UserStyleSheet.txt__header, {fontWeight: '300'}]}>
                  {item.email}
                </Text>
                <Text style={[UserStyleSheet.txt__header, {fontWeight: '300'}]}>
                  {item.numberphone}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text
            onPress={() => navigation.navigate('EditUser')}
            style={UserStyleSheet.btn__Edit}>
            Sửa
          </Text>
        </View>
      </View>
      <View style={{flex: 2}}>
        <TouchableOpacity
          style={UserStyleSheet.container__layout}
          onPress={() => navigation.navigate('ListAddress')}>
          <Text style={UserStyleSheet.txt__container}>Địa chỉ</Text>
          <Image
            style={UserStyleSheet.txt__container}
            source={require('../../../assets/imgs/Vector.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={UserStyleSheet.container__layout}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={UserStyleSheet.txt__container}>Đổi mật khẩu</Text>
          <Image
            style={UserStyleSheet.txt__container}
            source={require('../../../assets/imgs/Vector.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={UserStyleSheet.container__btnLogout}>
        <TouchableOpacity onPress={Logout}>
          <Text style={UserStyleSheet.txt__Signout}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default User;
