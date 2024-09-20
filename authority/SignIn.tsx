import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../supabaseClient'; // Import client Supabase

interface NavigationProp {
  navigate: (screen: string) => void;
  goBack: () => void;
}

const SignIn: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isFocusedEmail, setIsFocusedEmail] = useState<boolean>(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState<boolean>(false);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password);
  
      if (error) {
        Alert.alert('Error', error.message);
      } else if (data && data.length > 0) {
        navigation.navigate('HomePage');
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* Mũi tên quay lại */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Sign In</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input]}
            placeholder="Email"
            placeholderTextColor={isFocusedEmail ? '#FCC434' : '#ccc'}
            value={email}
            onChangeText={handleEmailChange}
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
            keyboardType="email-address"
          />
          <View style={[styles.underline, { backgroundColor: isFocusedEmail ? '#FCC434' : '#fff' }]} />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={isFocusedPassword ? '#FCC434' : '#ccc'}
            value={password}
            onChangeText={handlePasswordChange}
            onFocus={() => setIsFocusedPassword(true)}
            onBlur={() => setIsFocusedPassword(false)}
            secureTextEntry
          />
          <View style={[styles.underline, { backgroundColor: isFocusedPassword ? '#FCC434' : '#fff' }]} />
        </View>

        <TouchableOpacity style={styles.button_login} onPress={handleLogin}>
          <Text style={styles.button_login_Text}>Log In</Text>
        </TouchableOpacity>

        {/* Thanh phân cách và nút Login with Google */}
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>Or continue with</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity style={styles.button_google} onPress={() => {/* Xử lý đăng nhập bằng Google */}}>
          <FontAwesome name="google" size={20} color="#fff" />
          <Text style={styles.button_google_Text}> Google</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 250,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#000',
    borderRadius: 25,
    paddingHorizontal: 15,
    color: '#fff',
  },
  underline: {
    height: 2,
    width: '95%',
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  button_login: {
    position: 'absolute',
    bottom: 350,
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: '#FCC434',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  button_login_Text: {
    color: '#000',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 85,
    left: 20,
    zIndex: 1,
  },
  separatorContainer: {
    position: 'absolute',
    bottom: 180,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  separator: {
    height: 1,
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 10,
  },
  separatorText: {
    color: '#fff',
    fontSize: 13,
  },
  button_google: {
    position: 'absolute',
    bottom: 120,
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_google_Text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SignIn;
