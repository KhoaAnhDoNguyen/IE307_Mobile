// components/StartScreen.tsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { useNavigation } from '@react-navigation/native'; // Hook để điều hướng

export default function StartScreen() {
  const [users, setUsers] = useState([]); // State để lưu thông tin user
  const navigation = useNavigation(); // Khởi tạo hook điều hướng

  useEffect(() => {
    // Hàm để lấy dữ liệu từ bảng Users trong Supabase
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users') // Tên bảng Users
        .select('*'); // Lấy tất cả các cột

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data); // Lưu dữ liệu user vào state
      }
    };

    fetchUsers(); // Gọi hàm để lấy dữ liệu ngay khi component được render
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách Users:</Text>

      {/* Hiển thị danh sách users */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>ID: {item.id}</Text>
            <Text>Name: {item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Phone: {item.phonenumber}</Text>
          </View>
        )}
      />

      {/* Nút điều hướng đến màn hình SignIn */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Nút điều hướng đến màn hình SignUp */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
