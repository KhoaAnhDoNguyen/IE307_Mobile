import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Footer from '../components/Footer';

const ChatBot = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>ChatBot</Text>
      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
}

export default ChatBot;

const styles = StyleSheet.create({
    container: {
        flex: 1, // Full screen height
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        backgroundColor: '#000', // Optional: Set a background color
    },
    content: {
        fontSize: 20,
        color: '#fff',
    },
    footerWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
