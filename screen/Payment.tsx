import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import PaymentMethod from "./PaymentMethod";
import { FontAwesome } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Payment: {
    idfilm: number;
    idshowtime: number;
    idcinema: number;
    totalprice: number;
    seats: string[];
  };
  Ticket: undefined;
  TicketDetail: {
    film: { filmname: string; type: string; time: string; image: string };
    showtime: { dateshow: string; monthshow: string; yearshow: string; timeshow: string };
    cinema: { namecinema: string; address: string; seats: string };
    order: { idorder: number; total_price: number };
  };
};

interface Order {
  idorder: number;
  id: number;
  idfilm: number;
  idshowtime: number;
  idcinema: number;
  totalprice: number;
  paymentdate: string
}

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

type PaymentRouteProp = RouteProp<RootStackParamList, "Payment">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Payment">;

const Payment = () => {
  const route = useRoute<PaymentRouteProp>();
  const { idfilm, idshowtime, idcinema, totalprice, seats } = route.params;
  const navigation = useNavigation<NavigationProps>();

  const [user, setUser] = useState<any>(null);
  const [film, setFilm] = useState<{ filmname: string; type: string; time: string; image: string } | null>(null);
  const [cinema, setCinema] = useState<string | null>(null);
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Thêm trạng thái xử lý

  const [showtime, setShowtime] = useState<any>(null);
  const [cinemaAddress, setCinemaAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Fetch film
        const { data: filmData, error: filmError } = await supabase
          .from('films')
          .select('filmname, type, time, image')
          .eq('idfilm', idfilm)
          .single();
        if (filmData) setFilm(filmData);
        if (filmError) console.error('Error fetching film:', filmError);

        // Fetch cinema
        const { data: cinemaData, error: cinemaError } = await supabase
          .from('cinemas')
          .select('namecinema, address')
          .eq('idcinema', idcinema)
          .single();
        if (cinemaData) {
          setCinema(cinemaData.namecinema);
          setCinemaAddress(cinemaData.address);
        }
        if (cinemaError) console.error('Error fetching cinema:', cinemaError);

        // Fetch showtime
        const { data: showtimeData, error: showtimeError } = await supabase
          .from('showtimes')
          .select('dateshow, monthshow, yearshow, timeshow')
          .eq('idshowtime', idshowtime)
          .single();
        if (showtimeData) setShowtime(showtimeData);
        if (showtimeError) console.error('Error fetching showtime:', showtimeError);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [idfilm, idcinema, idshowtime]);

  const createOrder = async () => {
    if (isProcessing) return; 
    setIsProcessing(true); 

    if (!user) {
      Alert.alert("Error", "User information is not available.");
      setIsProcessing(false);
      return;
    }

    if (!film) {
      Alert.alert("Error", "Film information is not available.");
      setIsProcessing(false);
      return;
    }
  
    // Lấy ngày thanh toán hiện tại
    const paymentDate = new Date().toISOString(); // Định dạng ISO cho ngày

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('Order')
        .insert([{ id: user.id, idfilm, idshowtime, idcinema, totalprice, paymentdate: paymentDate }])
        .select('*') // Ensure that Supabase returns the inserted row
        .single();
  
      if (orderError) throw orderError;
  
      if (!orderData) {
        throw new Error("Order data is null");
      }
  
      const idOrder = orderData.idorder;
      if (!idOrder) {
        throw new Error("Order ID not returned");
      }
  
      const seatPromises = seats.map((seat) =>
        supabase.from('orderdetail').insert([{ idorder: idOrder, seat }])
      );
  
      await Promise.all(seatPromises);

      await fetch('http://10.0.2.2:3000/send-ticket-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          filmName: film.filmname,
          seats,
          cinema,
          totalPrice: totalprice,
          time: film.time,
        }),
      });

      Alert.alert("Success", "Ticket purchased successfully!");
      if (!cinema) {
        Alert.alert("Error", "Cinema information is missing.");
        return;
      }
      
      navigation.navigate('TicketDetail', {
        film: { filmname: film?.filmname, type: film?.type, time: film?.time, image: film?.image },
        showtime: showtime ?? { dateshow: 'N/A', monthshow: 'N/A', yearshow: 'N/A', timeshow: 'N/A' },
        cinema: { namecinema: cinema ?? 'N/A', address: cinemaAddress ?? 'N/A', seats: seats.join(', ') },
        order: { idorder: idOrder, total_price: totalprice },
      });
        
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Error", "Something went wrong, please try again.");
    } finally {
      setIsProcessing(false); // Đánh dấu kết thúc xử lý
    }
  };
  

  if (!film) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const formattedTotalPrice = totalprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePaymentComplete = (isSelected: boolean) => {
    setIsPaymentMethodSelected(isSelected);
  };

  const getImageSource = (uri: string) => {
    const imagePath = uri.startsWith('/') ? uri.slice(1) : uri;
    return imageMapping[imagePath] || require('../assets/Films/Film1.png');
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <View style={styles.infoContainer}>
        <Image source={getImageSource(film.image)} style={styles.filmImage} />
        <View style={styles.infoText}>
          <Text style={styles.filmName}>{film.filmname}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="film" size={20} color="#fff" />
            <Text style={styles.infoTextStyle}>{film.type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-sharp" size={20} color="#fff" />
            <Text style={styles.infoTextStyle}>{cinema}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#fff" />
            <Text style={styles.infoTextStyle}>{film.time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.seatContainer}>
        <Text style={styles.seatLabel}>Seat:</Text>
        <Text style={styles.seatList}>{seats.join(', ')}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>{formattedTotalPrice} VND</Text>
      </View>

      <PaymentMethod onPaymentComplete={handlePaymentComplete} />

      {isPaymentMethodSelected && (
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={createOrder}
          disabled={isProcessing} 
        >
          <Text style={styles.paymentButtonText}>
            {isProcessing ? 'Processing...' : 'Payment'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginBottom: 16,
    position: "relative", 
    paddingVertical: 10,
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center", 
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    marginTop: 5,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },
  filmImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 10,
  },
  filmName: {
    color: "#FCC434",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
  },
  infoTextStyle: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  seatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },
  seatLabel: {
    color: "#fff",
    fontSize: 16,
  },
  seatList: {
    color: "#fff",
    fontSize: 16,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 15,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginTop: -5
  },
  totalLabel: {
    color: "#fff",
    fontSize: 16,
  },
  totalPrice: {
    color: "#FCC434",
    fontSize: 25,
    fontWeight: 'bold'
  },
  paymentButton: {
    backgroundColor: '#FCC434',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Payment;