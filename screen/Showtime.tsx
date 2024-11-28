import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type ShowtimeProps = {
  idfilm: number;
  idcinema: number;
  onShowtimeSelect: (showtime: number | null) => void; // Callback để gửi showtime
};

const Showtime = ({ idfilm, idcinema, onShowtimeSelect }: ShowtimeProps) => {
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const { data, error } = await supabase
          .from("showtimes")
          .select("*")
          .eq("idfilm", idfilm)
          .eq("idcinema", idcinema);

        if (error) {
          console.error("Error fetching showtimes:", error);
        } else {
          setShowtimes(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [idfilm, idcinema]);

  const handleTimeSelect = (timeId: number | null) => {
    setSelectedTime((prev) => (prev === timeId ? null : timeId));
    onShowtimeSelect(selectedTime === timeId ? null : timeId);  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading showtimes...</Text>
      </View>
    );
  }

  if (showtimes.length === 0) {
    return (
      <View style={styles.noShowtimesContainer}>
        <Text style={styles.noShowtimesText}>No showtimes available.</Text>
      </View>
    );
  }

  const uniqueDates = [
    ...new Map(
      showtimes.map((item) => [
        `${item.dateshow}/${item.monthshow}`,
        item,
      ])
    ).values(),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Date & Time</Text>

      {/* Date Picker */}
      <ScrollView
        horizontal
        style={styles.datePicker}
        contentContainerStyle={styles.dateList}
        showsHorizontalScrollIndicator={false}
      >
        {uniqueDates.map((date) => (
          <TouchableOpacity
            key={`${date.dateshow}-${date.monthshow}`}
            style={[
              styles.dateItem,
              selectedDate === date.dateshow && styles.selectedDateItem,
            ]}
            onPress={() =>
              setSelectedDate((prev) =>
                prev === date.dateshow ? null : date.dateshow
              )
            }
          >
            <Text
              style={[
                styles.dateMonth,
                selectedDate === date.dateshow && styles.selectedText,
              ]}
            >
              Dec
            </Text>
            <Text
              style={[
                styles.dateNumber,
                selectedDate === date.dateshow && styles.selectedText,
              ]}
            >
              {date.dateshow}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Picker */}
      <ScrollView
        horizontal
        style={styles.timePicker}
        contentContainerStyle={styles.timeList}
        showsHorizontalScrollIndicator={false}
      >
        {showtimes
          .filter((time) => time.dateshow === selectedDate)
          .map((time) => (
            <TouchableOpacity
              key={time.idshowtime}
              style={[
                styles.timeItem,
                selectedTime === time.idshowtime && styles.selectedTimeItem,
              ]}
              onPress={() => handleTimeSelect(time.idshowtime)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time.idshowtime && styles.selectedText,
                ]}
              >
                {time.timeshow}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default Showtime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    fontSize: 16,
    color: "#FFD700",
    marginTop: 10,
  },
  noShowtimesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  noShowtimesText: {
    fontSize: 18,
    color: "#FF6F61",
  },
  datePicker: {
    marginBottom: 20,
  },
  dateList: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateItem: {
    width: 70,
    height: 100,
    borderRadius: 35,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  selectedDateItem: {
    backgroundColor: "#FFD700",
  },
  dateMonth: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 5,
  },
  dateNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  selectedText: {
    color: "#000",
  },
  timePicker: {
    marginTop: 10,
  },
  timeList: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#333",
    marginHorizontal: 10,
  },
  selectedTimeItem: {
    backgroundColor: "#FFD700",
  },
  timeText: {
    fontSize: 18,
    color: "#FFF",
  },
});