import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for the navigation params
type TicketDetailParams = {
  film: {
    filmname: string;
    type: string;
    time: string;
    image: string;
  };
  showtime: {
    dateshow: string;
    monthshow: string;
    yearshow: string;
    timeshow: string;
  };
  cinema: {
    namecinema: string;
    address: string;
    seats: string;  // seats as a string of joined seats
  };
  order: {
    idorder: number;
    total_price: number;
  };
};

// Define the navigation prop type
type NavigationProp = StackNavigationProp<{
  TicketDetail: TicketDetailParams;
}>;

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
  const navigation = useNavigation<NavigationProp>();

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
          idorder,
          idfilm,
          idcinema,
          idshowtime,
          films(filmname, type, time, image),
          cinemas(namecinema, address),
          showtimes(dateshow, monthshow, yearshow, timeshow),
          totalprice,
          orderdetail(seat)  // Join with orderdetail to get seats
        `)
        .eq('id', user.id);

      if (error) {
        console.error('Error fetching tickets:', error);
        return;
      }

      setTickets(data ? data.reverse() : []);
    };

    fetchTickets();
  }, [user]);

  const getImageSource = (uri: string) => {
    const imagePath = uri.startsWith('/') ? uri.slice(1) : uri;
    return imageMapping[imagePath] || require('../assets/Films/Film1.png');
  };

  const handleTicketPress = (ticket: any) => {
    navigation.navigate('TicketDetail', {
      film: {
        filmname: ticket.films?.filmname,
        type: ticket.films?.type,
        time: ticket.films?.time,
        image: ticket.films?.image,
      },
      showtime: ticket.showtimes ?? { 
        dateshow: 'N/A', 
        monthshow: 'N/A', 
        yearshow: 'N/A', 
        timeshow: 'N/A' 
      },
      cinema: {
        namecinema: ticket.cinemas?.namecinema ?? 'N/A',
        address: ticket.cinemas?.address ?? 'N/A',
        seats: ticket.orderdetail.map((detail: any) => detail.seat).join(', ')  // Join seats into a string
      },
      order: {
        idorder: ticket.idorder,
        total_price: ticket.totalprice
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Ticket</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {tickets.length === 0 ? (
          <Text style={styles.noTicketsText}>There are no tickets available</Text>
        ) : (
          tickets.map((ticket, index) => (
            <TouchableOpacity key={index} style={styles.ticketItem} onPress={() => handleTicketPress(ticket)}>
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
            </TouchableOpacity>
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
    paddingBottom: 80,
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
