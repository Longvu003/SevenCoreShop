import {StyleSheet, Text, View} from 'react-native';

const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  btn_back: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'left',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#272727',
  },
  reset: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  resetText: {
    color: 'black',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  loginText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#8e8e8e',
  },
  socialButtons: {
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  icon1: {
    width: 20,
    height: 24,
    marginRight: 10,
  },
  icon2: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  icon3: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
export default LoginStyle;
