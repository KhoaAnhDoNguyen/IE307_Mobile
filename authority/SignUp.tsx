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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../supabaseClient'; // Import client Supabase
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

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
  const [loading, setLoading] = useState<boolean>(false);

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

  const validateEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);

      if (fetchError) {
        Alert.alert('Error', fetchError.message);
        return;
      }

      if (existingUsers.length > 0) {
        Alert.alert('Error', 'This email already exists. Please use another email!');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, phonenumber: phoneNumber, password }])
        .select(); // Select the inserted data to get the user's information

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data && data.length > 0) {
        const user = data[0];

        // Save user information in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(user));

        Alert.alert('Success', 'Sign up successful!');
        navigation.navigate('HomePage');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
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

        <TouchableOpacity 
          style={styles.button_signup} 
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.button_signup_Text}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>Or continue with</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity 
          style={styles.button_google} 
          onPress={handleGoogleSignUp}
          disabled={loading}
        >
          <FontAwesome name="google" size={20} color="#fff" />
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.button_google_Text}> Google</Text>}
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
    top: 15,
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