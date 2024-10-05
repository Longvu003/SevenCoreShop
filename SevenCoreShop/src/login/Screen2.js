import { Button, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Screen2 = () => {
  return (
    <View style={styles.container}>
       <ImageBackground source={require('../../src/assets/bg.png')} style={styles.bg2}>
       <View style={styles.buttonContainer}>
       <TouchableOpacity style={styles.login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signup}>
        <Text style={styles.buttonText1}>Sign Up</Text>
      </TouchableOpacity>
      </View>
      </ImageBackground>
    </View>
  )
}

export default Screen2

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 30, // Khoảng cách từ đáy màn hình
        width: '100%',
        alignItems: 'center',
    },
    login: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        borderRadius: 20,
      },
      signup: {
        backgroundColor: 'transparent',  // Màu nền trong suốt
        padding: 10,
        marginVertical: 10,
        width: '80%',
        borderRadius: 20,
        borderWidth: 2,  // Độ dày của viền
        borderColor: 'white',  // Màu viền đen
        alignItems: 'center',
        
      },
      buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
      },
      buttonText1: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
      },
  
    bg2: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },


})