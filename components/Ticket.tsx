import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';

const Ticket = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>Ticket page</Text>
      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
}

export default Ticket;

const styles = StyleSheet.create({
    container: {
        flex: 1, // makes the container take full height
        justifyContent: 'center', // center the content vertically
        alignItems: 'center', // center the content horizontally
        backgroundColor: '#000', // optional, set a background color
    },
    content: {
        // Style for your content in the Ticket page
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
