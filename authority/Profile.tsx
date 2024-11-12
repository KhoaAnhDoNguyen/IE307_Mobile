import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';

interface RootStackParamList {
    StartScreen: undefined;
    UserDetail: undefined;
    Ticket: undefined;
    Payment: undefined;
}

const Profile: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [user, setUser] = useState<any>(null);

    const fetchUser = async () => {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchUser();
        }, [])
    );

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        navigation.navigate('StartScreen');
    };

    return (
        <View style={styles.container}>
            {/* Profile Information */}
            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    {user?.avatar ? (
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    ) : (
                        <Icon name="user" size={80} color="#fff" />
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{user?.name || 'Anonymous'}</Text>
                    <View style={styles.contactRow}>
                        <Icon name="phone" size={20} color="#fff" />
                        <Text style={styles.contactText}>{user?.phonenumber || 'No phone'}</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <Icon name="envelope" size={20} color="#fff" />
                        <Text style={styles.contactText}>{user?.email || 'No email'}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('UserDetail')}
                >
                    <Icon name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Options */}
        <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Ticket')}>
                <Icon name="ticket" size={28} color="#fff" />
                <Text style={styles.optionText}>My ticket</Text>
                <Icon name="chevron-right" size={24} color="#fff" style={styles.arrow} />
            </TouchableOpacity>
            <View style={styles.divider} />

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Payment')}>
                <Icon name="shopping-cart" size={28} color="#fff" />
                <Text style={styles.optionText}>Payment history</Text>
                <Icon name="chevron-right" size={24} color="#fff" style={styles.arrow} />
            </TouchableOpacity>
            <View style={styles.divider} />

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('UserDetail')}>
                <Icon name="lock" size={28} color="#fff" />
                <Text style={styles.optionText}>Change password</Text>
                <Icon name="chevron-right" size={24} color="#fff" style={styles.arrow} />
            </TouchableOpacity>
            <View style={styles.divider} />

            {/* Log Out Option */}
            <TouchableOpacity style={styles.option} onPress={handleLogout}>
                <Icon name="sign-out" size={28} color="#fff" />
                <Text style={styles.optionText}>Log out</Text>
            </TouchableOpacity>
        </View>




            {/* Footer */}
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'space-between',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#555',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 20,
    },
    name: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    contactText: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 10,
    },
    editButton: {
        position: 'absolute',
        right: 20,
        top: 25,
    },
    optionsContainer: {
        marginBottom: 340,
        paddingHorizontal: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    optionText: {
        flex: 1,
        fontSize: 18,
        color: '#fff',
        marginLeft: 15,
    },
    arrow: {
        marginLeft: 'auto',
    },
    divider: {
        height: 1,
        backgroundColor: '#fff',
        opacity: 0.3,
    },
    logoutText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 15,
    },
});

export default Profile;
