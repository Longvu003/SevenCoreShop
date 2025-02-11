import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const Welcome1 = ({navigation}) => {
  useEffect(() => {
    // Hẹn giờ 3 giây (3000 ms) rồi chuyển sang Screen2
    const timer = setTimeout(() => {
      navigation.replace('Welcome2'); // `replace` không cho phép quay lại Screen1
    }, 3000);

    // Dọn dẹp khi component unmount (hủy timer)
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/imgs/logo.png')}
        style={styles.bg1}
      />
    </View>
  );
};

export default Welcome1;

const styles = StyleSheet.create({
  bg1: {
    width: '100%',
    height: '100%',
  },
});
