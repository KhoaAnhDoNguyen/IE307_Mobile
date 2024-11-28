import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import Showtime from "./Showtime";

// Define the route params type
type RootStackParamList = {
  Screen: { idfilm: number; idcinema: number };
};

type Seat = {
  idseat: number;
  idcinema: number;
  numcol: number;
  numrow: number;
  price: string; // Price as a string to handle the money type properly
};

// Function to generate seats list
const generateSeats = (numcol: number, numrow: number) => {
  const seats = [];
  for (let row = 0; row < numrow; row++) {
    const rowLabel = String.fromCharCode(65 + row); // A, B, C,... (row labels)
    for (let col = 1; col <= numcol; col++) {
      seats.push(`${rowLabel}${col}`); // Example: A1, B2, C3,...
    }
  }
  return seats;
};

const Screen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Screen">>();
  const { idfilm, idcinema } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<number | null>(null); // Save selected showtime
  const [price, setPrice] = useState<number>(0); // Default ticket price

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("seat")
          .select("*")
          .eq("idcinema", idcinema)
          .single();

        if (error) {
          console.error(error.message);
        } else if (data) {
          const { numcol, numrow, price } = data as Seat;
          // Clean the price (remove $ and any non-numeric characters)
          const cleanedPrice = price?.replace(/[^0-9.-]+/g, "");
          const parsedPrice = parseFloat(cleanedPrice || "0");
          setPrice(isNaN(parsedPrice) ? 0 : parsedPrice); // Set ticket price
          setSeats(generateSeats(numcol, numrow)); // Generate seats based on numcol and numrow
        }
      } catch (err) {
        console.error("Error fetching seats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [idcinema]);

  const handleSeatPress = (seat: string) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  const totalPrice = selectedSeats.length * price;

  // Function to format price with thousands separators (3.000, 15.000, etc.)
  const formatPrice = (price: number) => {
    return price.toLocaleString("de-DE"); // Use 'de-DE' for European format (3.000)
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={35} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select seat</Text>
        </View>

        {/* Linear Gradient Shadow */}
        <LinearGradient
          colors={["#FCC434", "#000000"]}
          style={styles.screenShadow}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* Seat Selection */}
        <View style={styles.seatContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FCC434" />
              <Text style={styles.loadingText}>Loading seats...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.seatGrid}>
              {seats.map((seat, index) => {
                const isSelected = selectedSeats.includes(seat);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.seat, isSelected && styles.selectedSeat]}
                    onPress={() => handleSeatPress(seat)}
                  >
                    <Text
                      style={[styles.seatText, isSelected && styles.selectedSeatText]}
                    >
                      {seat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Showtime Component */}
        <Showtime
          idfilm={idfilm}
          idcinema={idcinema}
          onShowtimeSelect={setSelectedShowtime} // Callback for selecting showtime
        />
        
        {/* Divider Line and Buy Ticket Section */}
        {selectedShowtime && selectedSeats.length > 0 && (
          <View style={styles.pricelinecontain}>
            <View style={styles.dividerLine} />

          <View style={styles.buyTicketContainer}>
            <View style={styles.PriceContainer}>
            <Text style={styles.totalPriceText}>
              Total
            </Text>
            <Text style={styles.priceText}>
              {formatPrice(totalPrice)} VND
            </Text>
            </View>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy Ticket</Text>
            </TouchableOpacity>
          </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 20,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  topBar: {
    height: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  topBarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  screenShadow: {
    height: 50,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  seatContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  seatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  seat: {
    width: 40,
    height: 40,
    margin: 5,
    backgroundColor: "#1C1C1C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  selectedSeat: {
    backgroundColor: "#FCC434",
  },
  seatText: {
    color: "#BFBFBF",
    fontWeight: "bold",
    fontSize: 12,
  },
  selectedSeatText: {
    color: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#FFFFFF",
  },
  // New styles for the divider and "Total" section
  buyTicketContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between", // Align "Total" and button on opposite sides
    alignItems: "center", // Center vertically
  },
  PriceContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "flex-start", // Corrected this line
    justifyContent: "center",
  },
  dividerLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#FFFFFF", // White line
    marginVertical: 10,
  },
  totalPriceText: {
    color: "#FFFFFF", // "Total" in white
    fontSize: 18,
    fontWeight: "bold",
  },
  priceText: {
    color: "#FFD700", // Price in yellow color
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  buyButton: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginTop: 15,
  },
  buyButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
  pricelinecontain: {
   flexDirection: "column", // Đặt thành "column" để sắp xếp các phần theo chiều dọc
   justifyContent: "space-between", // Giữ khoảng cách đều giữa các phần
   alignItems: "stretch",
   marginTop: 20
  }
});

