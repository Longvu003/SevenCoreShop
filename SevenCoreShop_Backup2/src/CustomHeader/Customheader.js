import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const Customheader = ({leftIcon, title, rightIcon}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {leftIcon ? (
        <TouchableOpacity
          style={styles.iconSize}
          onPress={() => navigation.goBack()}>
          <Image source={leftIcon} />
        </TouchableOpacity>
      ) : (
        <View></View>
      )}

      {title ? <Text style={styles.txt__Title}>{title}</Text> : <View></View>}

      {rightIcon ? (
        <TouchableOpacity style={styles.iconSize}>
          <Image source={rightIcon} />
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default Customheader;

const styles = StyleSheet.create({
  txt__Title: {
    fontWeight: '800',
    color: 'black',
  },
  iconSize: {
    width: 20,
    height: 30,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginHorizontal: 24,
    alignItems: 'center',
  },
});
