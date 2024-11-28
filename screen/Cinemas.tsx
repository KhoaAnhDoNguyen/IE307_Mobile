import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

interface CinemasProps {
  filmId: number; 
}

interface Cinema {
  idcinema: number;
  namecinema: string;
  address: string;
  room: string;
  start: string;
}

const Cinemas: React.FC<CinemasProps> = ({ filmId }) => {
  const [cinemaData, setCinemaData] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      setLoading(true);
      try {
        const { data: filmsCinemasData, error: filmsCinemasError } = await supabase
          .from('films_cinemas')
          .select('idcinema, room, start')
          .eq('idfilm', filmId);

        if (filmsCinemasError) throw filmsCinemasError;

        const cinemaIds = filmsCinemasData.map((item: { idcinema: number }) => item.idcinema);

        if (cinemaIds.length > 0) {
          const { data: cinemasData, error: cinemasError } = await supabase
            .from('cinemas')
            .select('idcinema, namecinema, address')
            .in('idcinema', cinemaIds);

          if (cinemasError) throw cinemasError;

          const combinedData = cinemasData.map(cinema => {
            const relatedFilmCinema = filmsCinemasData.find(fc => fc.idcinema === cinema.idcinema);
            return {
              ...cinema,
              room: relatedFilmCinema?.room,
              start: relatedFilmCinema?.start,
            };
          });

          setCinemaData(combinedData);
        }
      } catch (error) {
        console.error('Error fetching cinemas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, [filmId]);

  const handleCinemaSelect = (id: number) => {
    setSelectedCinemaId(prevId => (prevId === id ? null : id));
  };

  const navigation = useNavigation(); // Hook for navigation
  const handleContinue = () => {
      if (selectedCinemaId) {
        (navigation as any).navigate('Screen', { idfilm: filmId, idcinema: selectedCinemaId });
    };
    
  };

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.cinemaTitle}>Cinemas</Text>
      {cinemaData.map((item) => (
        <TouchableOpacity 
          key={item.idcinema} 
          style={[
            styles.cinemaItem,
            selectedCinemaId === item.idcinema && styles.selectedCinema // Apply styles if selected
          ]}
          onPress={() => handleCinemaSelect(item.idcinema)}
        >
          <Text style={styles.cinemaName}>{item.namecinema}</Text>
          <Text style={styles.cinemaDetails}>{item.start} | Room: {item.room}</Text>
          <Text style={styles.cinemaDetails}>{item.address}</Text>
        </TouchableOpacity>
      ))}

      {selectedCinemaId && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Cinemas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },
  cinemaTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 15,
  },
  cinemaItem: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedCinema: {
    borderColor: '#FCC434', // Border color for selected cinema
    borderWidth: 2,
    backgroundColor: '#261D08', // Background color for selected cinema
  },
  cinemaName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cinemaDetails: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 2,
  },
  loading: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#FCC434', // Gold background
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});