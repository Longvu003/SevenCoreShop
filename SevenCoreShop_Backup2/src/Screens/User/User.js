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
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null);
  const [numberPhone, setNumberPhone] = useState(null);
  const renderUser = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const newUserEmail = JSON.parse(userEmail);
    const url = `${API__URL}/users/getUserEmail?email=${newUserEmail}`;
    try {
      if (newUserEmail) {
        const response = await axios.get(url);
        const newnew = Object.values(response.data);
        // const getDataApi = newnew[2];
        // console.log(response.data);
        setUser(newnew);
      } else {
        console.log('Lỗi không thấy email');
      }
    } catch (error) {
      console.error('lỗi nè :', error);
      setLoading(true);
    }
  };
  const Logout = async () => {
    await AsyncStorage.removeItem('userEmail');
    navigation.replace('LoginScreen');
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
                  {item.username}
                </Text>
                <Text style={UserStyleSheet.txt__header}>{item.email}</Text>
                <Text style={UserStyleSheet.txt__header}>
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
      <View style={{flex: 7}}>
        <TouchableOpacity
          style={UserStyleSheet.container__layout}
          onPress={() => navigation.navigate('ListAddress')}>
          <Text style={UserStyleSheet.txt__container}>Địa chỉ</Text>
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
