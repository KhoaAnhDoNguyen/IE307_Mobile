import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CompositeNavigationProp, NavigationProp, useNavigation as useNavigationTyped } from '@react-navigation/native';

type RootStackParamList = {
  HomePage: undefined;
  Movie: undefined;
  // Thêm các trang khác nếu cần
};

type NavigationProps = CompositeNavigationProp<
  NavigationProp<RootStackParamList>,
  NavigationProp<any> 
>;

const Footer: React.FC = () => {
  const navigation = useNavigationTyped<NavigationProps>(); // Chỉ định kiểu cho navigation
  const currentRoute = navigation.getState().routes[navigation.getState().index].name; // Lấy tên trang hiện tại

  return (
    <View style={styles.footerContainer}>
      <View style={styles.divider} />

      {/* Home Icon */}
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('HomePage')}>
        <Icon name="home" size={20} color={currentRoute === 'HomePage' ? '#FFD700' : '#FFFFFF'} />
        <Text style={[styles.iconText, { color: currentRoute === 'HomePage' ? '#FFD700' : '#FFFFFF' }]}>Home</Text>
      </TouchableOpacity>

      {/* Movie Icon */}
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Movie')}>
        <Icon name="film" size={20} color={currentRoute === 'Movie' ? '#FFD700' : '#FFFFFF'} />
        <Text style={[styles.iconText, { color: currentRoute === 'Movie' ? '#FFD700' : '#FFFFFF' }]}>Movie</Text>
      </TouchableOpacity>

      {/* Các icon khác */}
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('TicketPage')}>
        <Icon name="ticket" size={20} color={currentRoute === 'TicketPage' ? '#FFD700' : '#FFFFFF'} />
        <Text style={[styles.iconText, { color: currentRoute === 'TicketPage' ? '#FFD700' : '#FFFFFF' }]}>Ticket</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ChatbotPage')}>
        <Icon name="comment" size={20} color={currentRoute === 'ChatbotPage' ? '#FFD700' : '#FFFFFF'} />
        <Text style={[styles.iconText, { color: currentRoute === 'ChatbotPage' ? '#FFD700' : '#FFFFFF' }]}>Chatbot</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ProfilePage')}>
        <Icon name="user" size={20} color={currentRoute === 'ProfilePage' ? '#FFD700' : '#FFFFFF'} />
        <Text style={[styles.iconText, { color: currentRoute === 'ProfilePage' ? '#FFD700' : '#FFFFFF' }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  divider: {
    height: 2,
    backgroundColor: '#262626',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    marginTop: 5,
  },
});

export default Footer;
