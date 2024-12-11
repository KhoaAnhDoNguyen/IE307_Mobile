import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  TicketDetail: {
    film: { filmname: string; type: string; time: string; image: string };
    showtime: { dateshow: string; monthshow: string; yearshow: string; timeshow: string };
    cinema: { namecinema: string; address: string; seats: string };
    order: { idorder: number; total_price: number };
  };
  Ticket: undefined;
};

type TicketDetailRouteProp = RouteProp<RootStackParamList, 'TicketDetail'>;

type NavigationProp = {
  navigate: (screen: string) => void;
};

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

const TicketDetail = () => {
  const route = useRoute<TicketDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { film, showtime, cinema, order } = route.params;

  const getImageSource = (uri: string) => {
    const imagePath = uri.startsWith('/') ? uri.slice(1) : uri;
    return imageMapping[imagePath] || require('../assets/Films/Film1.png');
  };

  const formattedTotalPrice = order.total_price.toLocaleString('it-IT') + ' VND';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Ticket')}>
          <Ionicons name="arrow-back" size={33} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Ticket</Text>
      </View>

      {/* Ticket Details Card */}
      <View style={styles.card}>
        {/* Film Information */}
        <View style={styles.row}>
          <Image source={getImageSource(film.image)} style={styles.filmImage} />
          <View style={styles.column}>
            <Text style={styles.filmName}>{film.filmname}</Text>
            <View style={styles.rowWithIcon}>
              <Ionicons name="time-outline" size={20} color="black" />
              <Text style={styles.filmTime}>{film.time}</Text>
            </View>
            <View style={styles.rowWithIcon}>
              <Ionicons name="film-outline" size={20} color="black" />
              <Text style={styles.filmType}>{film.type}</Text>
            </View>
          </View>
        </View>

        {/* Showtime and Seats Information */}
        <View style={styles.infoRow}>
          <View style={styles.showtimeContainer}>
            <View style={styles.rowWithIcon}>
              <Ionicons name="calendar-outline" size={40} color="black" />
              <View style={styles.column_showtime}>
                <Text style={styles.showtimeText}>{showtime.timeshow}</Text>
                <Text style={styles.showtimeDate}>
                  {`${showtime.dateshow}/${showtime.monthshow}/${showtime.yearshow}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.seatInfo}>
            <Ionicons name="person-outline" size={40} color="black" />
            <Text style={styles.seatCount}>{cinema.seats}</Text>
          </View>
        </View>

        {/* Horizontal Line */}
        <View style={styles.separator} />

        {/* Total Price */}
        <View style={styles.rowWithIcon2}>
          <Ionicons name="cash-outline" size={25} color="black" />
          <Text style={styles.totalPrice}>{formattedTotalPrice}</Text>
        </View>

        {/* Cinema Name */}
        <View style={styles.rowWithIcon2}>
          <Ionicons name="business-outline" size={25} color="black" />
          <Text style={styles.cinemaName}>{cinema.namecinema}</Text>
        </View>

        {/* Cinema Address */}
        <View style={styles.rowWithIcon2}>
          <Ionicons name="location-outline" size={25} color="black" />
          <Text style={styles.cinemaAddress}>{cinema.address}</Text>
        </View>

        {/* QR Code Message */}
        <View style={styles.rowWithIcon2}>
          <Ionicons name="qr-code-outline" size={25} color="black" />
          <Text style={styles.qrCodeMessage}>Show this QR code to the ticket counter to receive your ticket</Text>
        </View>

        {/* Dashed Line */}
        <View style={styles.dashedLine} />

        {/* Barcode Image */}
        <Image source={require('../assets/barcode.png')} style={styles.barcodeImage} />

        {/* Order ID */}
        <View style={styles.rowWithIcon2}>
          <Text style={styles.orderIdText}>Order ID: {order.idorder}</Text>
        </View>

      </View>
    </View>
  );
};

export default TicketDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginLeft: 16,
  },
  column_showtime: {
    flex: 1,
    marginLeft: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  showtimeContainer: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 10
  },
  rowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: -5
  },
  rowWithIcon2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  seatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginRight: 10,
  },
  filmImage: {
    width: 125,
    height: 177,
    borderRadius: 10,
  },
  filmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  filmTime: {
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
  },
  filmType: {
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
  },
  showtimeText: {
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
  },
  showtimeDate: {
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
  },
  seatCount: {
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
  },
  totalPrice: {
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
  },
  cinemaName: {
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
  },
  cinemaAddress: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
    marginRight: 10
  },
  qrCodeMessage: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 8,
    marginRight: 15
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  dashedLine: {
    height: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 16,
    marginTop: 20
  },
  barcodeImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 0,
    marginTop: -10,
  },
  orderIdText: {
    fontSize: 17,
    color: '#000000',
    marginLeft: 120,
  },
});