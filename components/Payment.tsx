import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Footer from '../components/Footer';

const Payment = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment History</Text>
      <View style={styles.content}>
        <Text style={styles.text}>This is where your payment history will be displayed.</Text>
      </View>
      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
}

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full screen height
    backgroundColor: '#000', // Optional: Background color for the page
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
