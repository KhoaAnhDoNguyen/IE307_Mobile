import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Footer from './Footer';

interface NavigationProp {
  navigate: (screen: string) => void;
}

const HomePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('StartScreen');
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between', // Đảm bảo Footer ở dưới cùng
  },
});

export default HomePage;
