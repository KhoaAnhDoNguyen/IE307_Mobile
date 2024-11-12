import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface RootStackParamList {
    Profile: undefined;
}

const UserDetail: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Trạng thái để hiển thị mật khẩu

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setUsername(userData.name || '');
                setPhone(userData.phonenumber || '');
                setEmail(userData.email || '');
                setPassword(userData.password || ''); // Hiện mật khẩu hiện tại (dưới dạng ẩn)
                setShowPassword(false); // Mặc định ẩn mật khẩu
            }
        };
        fetchUser();
    }, []);

    const handleUpdate = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({ name: username, phonenumber: phone, email: email, password: password })
                .eq('id', user.id);

            if (error) {
                Alert.alert('Update Failed', error.message);
                return;
            }

            // Cập nhật lại thông tin người dùng trong AsyncStorage
            const updatedUser = { ...user, name: username, phonenumber: phone, email: email, password: password }; // Cập nhật mật khẩu mới
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            Alert.alert('Update Successful', 'Your information has been updated.', [
                { text: 'OK', onPress: () => navigation.navigate('Profile') },
            ]);
        } catch (error) {
            Alert.alert('Error', 'An error occurred while updating.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Update Information</Text>
                <View style={styles.arrowContainer}>
                    <Icon name="arrow-left" size={24} color="#000" />
                </View>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Username:</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter username"
                    placeholderTextColor="#888"
                />

                <Text style={styles.label}>Phone:</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    placeholderTextColor="#888"
                />

                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    placeholderTextColor="#888"
                />

                <Text style={styles.label}>Password:</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput} // Thay đổi style ở đây
                        value={password} // Hiện mật khẩu hiện tại
                        onChangeText={setPassword}
                        placeholder="Enter new password"
                        secureTextEntry={!showPassword} // Hiển thị hoặc ẩn mật khẩu
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Icon name={showPassword ? 'eye' : 'eye-slash'} size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    arrowContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
    formContainer: {
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#fff',
    },
    input: {
        height: 45,
        borderColor: '#444',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        color: '#fff',
        backgroundColor: '#333',
    },
    passwordInput: {
        height: 45, // Độ cao ô nhập mật khẩu
        flex: 1, // Làm cho ô nhập mật khẩu chiếm toàn bộ chiều rộng
        borderColor: '#444',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        color: '#fff',
        backgroundColor: '#333',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eyeIcon: {
        justifyContent: 'center', // Căn giữa biểu tượng mắt
        alignItems: 'center',
        padding: 10, // Thêm padding để dễ nhấn
        bottom: 10,
        left: 5
    },
});

export default UserDetail;
