// authority/SignUp.tsx
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

const SignUp: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleNameChange = useCallback((text: string) => {
    setName(text);
  }, []);
  
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);
  
  const handlePhoneNumberChange = useCallback((text: string) => {
    setPhoneNumber(text);
  }, []);
  
  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const handleSignUp = async () => {
    try {
      // Kiểm tra xem email đã tồn tại
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);
  
      if (fetchError) {
        Alert.alert('Error', fetchError.message);
        return;
      }
  
      // Nếu email đã tồn tại, hiện thông báo
      if (existingUsers.length > 0) {
        Alert.alert('Error', 'This email already exists. Please use another email!');
        return;
      }

      else
      {
        const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, phonenumber: phoneNumber, password }]);
        navigation.navigate('HomePage');


      }

    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        navigation.navigate('HomePage');
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

        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={handleNameChange}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#ccc"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button_signup} onPress={handleSignUp}>
          <Text style={styles.button_signup_Text}>Sign Up</Text>
        </TouchableOpacity>

        {/* Thanh phân cách và nút đăng ký với Google */}
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>Or continue with</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity style={styles.button_google} onPress={handleGoogleSignUp}>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
  },
  button_signup: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: '#FCC434',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  button_signup_Text: {
    color: '#000',
    fontSize: 16,
  },
  button_google: {
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
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    zIndex: 1,
  },
  separatorContainer: {
    marginTop: 80,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default SignUp;
