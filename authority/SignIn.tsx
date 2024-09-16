// authority/SignIn.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SignIn: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Sign In</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SignIn;
