import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Thay đổi import

const Footer: React.FC = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.divider} />
      
      <TouchableOpacity style={styles.iconContainer}>
        
        <Icon name="home" size={20} color="#FFFFFF" />
        <Text style={styles.iconText}>Home</Text>
      
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="ticket" size={20} color="#FFFFFF" />
        <Text style={styles.iconText}>Ticket</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="film" size={20} color="#FFFFFF" />
        <Text style={styles.iconText}>Movie</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="comment" size={20} color="#FFFFFF" />
        <Text style={styles.iconText}>Chatbot</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="user" size={20} color="#FFFFFF" />
        <Text style={styles.iconText}>Profile</Text>
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
    height: 1, // Chiều cao của đường gạch
    backgroundColor: '#FFFFFF', // Màu của đường gạch
    width: '100%', // Để đường gạch rộng bằng footer
    position: 'absolute', // Để đặt nó ở trên cùng của footer
    top: 0, // Đặt ở trên cùng
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