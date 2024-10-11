import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserStyleSheet from '../../StyleSheets/UserStyleSheet';

const User = ({navigation}) => {
  const [user, setUser] = useState(null);

  const renderUser = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const newUserId = JSON.parse(userId);
    const url = `http://192.168.2.59:3000/getid?id=${newUserId}`;
    // console.log(newUserId);

    try {
      // const cleanUserId = userInfo.trim();
      // console.log(cleanUserId);
      if (newUserId && newUserId.length >= 24) {
        const response = await axios.get(url);
        const newnew = Object.values(response.data);
        // const getDataApi = newnew[1];
        setUser(newnew);
      } else {
        console.log('Lỗi id ko đủ 24 ký tự:', getDataApi);
      }
    } catch (error) {
      console.error('lỗi nè :', error);
    }
  };
  const Logout = async () => {
    await AsyncStorage.removeItem('userId');
    navigation.replace('LoginTest');
  };
  useEffect(() => {
    renderUser();
  }, []);

  useEffect(() => {
    console.log('data đã có ', user);
  }, [user]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={UserStyleSheet.layout__Img}>
        <Image
          style={UserStyleSheet.img__User}
          source={require('../../../assets/imgs/profile.png')}
        />
      </View>
      <View style={UserStyleSheet.header__Information}>
        <View style={UserStyleSheet.header__Layout}>
          <FlatList
            data={user}
            renderItem={({item}) => (
              <TouchableOpacity>
                <Text style={[UserStyleSheet.txt__header, {color: 'black'}]}>
                  {item.nameUser}
                </Text>
                <Text style={UserStyleSheet.txt__header}>{item.phone}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text
            onPress={() => navigation.navigate('EditUser', {dataUser: user})}
            style={UserStyleSheet.btn__Edit}>
            Sửa
          </Text>
        </View>
      </View>
      <View style={{flex: 7}}>
        <TouchableOpacity
          style={UserStyleSheet.container__layout}
          onPress={() => navigation.navigate('ListAddress')}>
          <Text style={UserStyleSheet.txt__container}>Địa chỉ</Text>
          {/* <Text>{user ? user.address : 'loading'}</Text> */}
          <Image
            style={UserStyleSheet.txt__container}
            source={require('../../../assets/imgs/Vector.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity style={UserStyleSheet.container__layout}>
          <Text style={UserStyleSheet.txt__container}>Danh sách yêu thích</Text>
          <Image
            style={UserStyleSheet.txt__container}
            source={require('../../../assets/imgs/Vector.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={UserStyleSheet.container__layout}>
          <Text style={UserStyleSheet.txt__container}>Thanh toán</Text>
          <Image
            style={UserStyleSheet.txt__container}
            source={require('../../../assets/imgs/Vector.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={UserStyleSheet.container__layout}>
          <Text style={UserStyleSheet.txt__container}>Trợ giúp</Text>
          <Image
            style={UserStyleSheet.txt__container}
            source={require('../../../assets/imgs/Vector.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={UserStyleSheet.container__layout}>
          <Text style={UserStyleSheet.txt__container}>Hỗ trợ</Text>
          <Image
            style={UserStyleSheet.txt__container}
            source={require('../../../assets/imgs/Vector.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity>
          <Text style={UserStyleSheet.txt__Signout} onPress={Logout}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default User;
