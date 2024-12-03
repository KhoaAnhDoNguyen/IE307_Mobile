import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imageMapping: { [key: string]: any } = {
  'assets/Films/Film1.png': require('../assets/Films/Film1.png'),
  'assets/Films/Film2.png': require('../assets/Films/Film2.png'),
  'assets/Films/Film3.png': require('../assets/Films/Film3.png'),
  'assets/Films/Film4.png': require('../assets/Films/Film4.png'),
  'assets/Films/Film5.png': require('../assets/Films/Film5.png'),
  'assets/Films/Film6.png': require('../assets/Films/Film6.png'),
  'assets/Films/Film7.png': require('../assets/Films/Film7.png'),
  'assets/Films/Film8.png': require('../assets/Films/Film8.png'),
};

const Ticket = () => {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('Order')
        .select(`
          idfilm,
          idcinema,
          films(filmname, type, time, image),
          cinemas(namecinema)
        `)
        .eq('id', user.id);

      if (error) {
        console.error('Error fetching tickets:', error);
        return;
      }

      setTickets(data || []);
    };

    fetchTickets();
  }, [user]);

  const getImageSource = (uri: string) => {
    const imagePath = uri.startsWith('/') ? uri.slice(1) : uri;
    return imageMapping[imagePath] || require('../assets/Films/Film1.png');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Ticket</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {tickets.length === 0 ? (
          <Text style={styles.noTicketsText}>There are no tickets available</Text>
        ) : (
          tickets.map((ticket, index) => (
            <View key={index} style={styles.ticketItem}>
              <Image
                source={getImageSource(ticket.films.image)}
                style={styles.ticketImage}
              />
              <View style={styles.ticketDetails}>
                <Text style={styles.filmName}>{ticket.films.filmname}</Text>
                <View style={styles.row}>
                  <Icon name="film" size={16} color="white" style={styles.icon} />
                  <Text style={styles.text}>{ticket.films.type}</Text>
                </View>
                <View style={styles.row}>
                  <Icon name="map-marker" size={16} color="white" style={styles.icon} />
                  <Text style={styles.text}>{ticket.cinemas.namecinema}</Text>
                </View>
                <View style={styles.row}>
                  <Icon name="clock-o" size={16} color="white" style={styles.icon} />
                  <Text style={styles.text}>{ticket.films.time}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
};

export default Ticket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 80, // Add padding to avoid footer overlapping content
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    color: '#fff',
    marginVertical: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  noTicketsText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 150,
  },
  ticketItem: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ticketImage: {
    width: 120,
    height: 160,
    borderRadius: 4,
  },
  ticketDetails: {
    marginLeft: 16,
    flex: 1,
  },
  filmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: '#fff',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
