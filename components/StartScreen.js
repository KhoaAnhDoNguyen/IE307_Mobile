import React from 'react';
import { StatusBar } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function StartScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
      />

      <Image
        source={require('../assets/Logo/Logo.png')}
        style={styles.logo}
      />

      <Image
        source={require('../assets/Logo/Start_Film.png')}
        style={styles.start_film}
      />

      <Text style={styles.start_text}>
        <Text style={styles.text_1}>MBooking hello!{'\n'}</Text>
        <Text style={styles.text_2}>Enjoy your favorite movies</Text>
      </Text>

      <TouchableOpacity
        style={styles.button_login}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.button_login_Text}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button_signup}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.button_signup_Text}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.term}>
        By signing in or signing up, you agree to our Terms of Service {'\n'}and Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  logo: {
    position: 'absolute',
    top: height * 0.1,
    left: 15,
  },
  start_film: {
    marginLeft: 33,
    width: 310,
    height: 310,
    borderRadius: 10,
    position: 'absolute',
    top: height * 0.2,
  },
  start_text: {
    color: 'white',
    marginTop: height * 0.4,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 20,
    marginTop: 400
  },
  text_1: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text_2: {
    fontSize: 13,
    fontWeight: 'normal',
  },
  button_login: {
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: '#FCC434',
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  button_login_Text: {
    color: '#000000',
    fontSize: 16,
  },
  button_signup: {
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: '#000',
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  button_signup_Text: {
    color: '#ffffff',
    fontSize: 16,
  },
  term: {
    position: 'absolute',
    bottom: 30, // Cách đáy màn hình 20px
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 8,
    textAlign: 'center',
  },
});
