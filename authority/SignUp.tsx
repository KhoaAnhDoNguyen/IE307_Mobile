// authority/SignUp.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SignUp: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Sign Up</Text>
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

export default SignUp;
