import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import Footer from './Footer';
import { StackNavigationProp } from '@react-navigation/stack';

export interface Film {
  idfilm: number;
  filmname: string;
  type: string;
  time: string;
  country: string;
  object: string;
  premiere: string;
  content: string;
  status: number;
  image: string;
  demo: string;
  starAverage?: number;
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

interface NavigationProp {
  navigate: (screen: string, params?: { tab: string }) => void;
}

type RootStackParamList = {
  FilmDetail: { id: number };
};

type MovieScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FilmDetail'>;

const HomePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [currentFilmIndex, setCurrentFilmIndex] = useState(0);
  const [comingSoonFilms, setComingSoonFilms] = useState<Film[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const navigations = useNavigation<MovieScreenNavigationProp>();

  const handleMoviePress = (movie: Film) => {
    navigations.navigate('FilmDetail', { id: movie.idfilm });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    const fetchFilms = async () => {
      const { data: filmsData, error } = await supabase
        .from('films')
        .select('*')
        .eq('status', 1);
    
      const { data: comingSoonData, error: comingSoonError } = await supabase
        .from('films')
        .select('*')
        .eq('status', 0);
    
      if (comingSoonError) {
        console.error('Error fetching coming soon films:', comingSoonError);
      } else if (comingSoonData) {
        setComingSoonFilms(comingSoonData);
      }
    
      if (error) {
        console.error('Error fetching films:', error);
      } else if (filmsData) {
        for (const film of filmsData) {
          const { data: ratings, error: ratingError } = await supabase
            .from('user_film')
            .select('star')
            .eq('idfilm', film.idfilm);
    
          if (ratingError) {
            console.error('Error fetching film ratings:', ratingError);
          } else if (ratings) {
            const averageStar =
              ratings.length > 0
                ? ratings.reduce((sum, rating) => sum + rating.star, 0) / ratings.length
                : 0;
            film.starAverage = averageStar;
          }
        }
        setFilms(filmsData);
      }
    };
    

    fetchUser();
    fetchFilms();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFilmIndex((prevIndex) => (prevIndex + 1) % films.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [films]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentFilmIndex, animated: true });
    }
  }, [currentFilmIndex]);

  const getImageSource = (uri: string) => {
    const imagePath = uri.startsWith('/') ? uri.slice(1) : uri;
    return imageMapping[imagePath] || require('../assets/Films/Film1.png');
  };

  const renderFilmItem = ({ item, index }: { item: Film; index: number }) => {
    const isCurrent = index === currentFilmIndex;

    return (
      <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.filmItemContainer}>
        <Image
          source={getImageSource(item.image)}
          style={[styles.mainFilmImage, isCurrent ? styles.fullImage : styles.partialImage]}
          onError={() => console.log('Failed to load image')}
        />
        <Text style={styles.filmName}>{item.filmname}</Text>
        <Text style={styles.filmDetails}>{item.time} • {item.type}</Text>
        <Text style={styles.starRating}>⭐ {item.starAverage?.toFixed(1) || 'N/A'}</Text>
      </TouchableOpacity>
    );
  };


  const renderComingSoonFilmItem = ({ item }: { item: Film }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.comingSoonFilmItem}>
      <Image
        source={getImageSource(item.image)}
        style={styles.comingSoonFilmImage}
        onError={() => console.log('Failed to load image')}
      />
      <View style={styles.comingSoonFilmDetails}>
        <Text style={styles.comingSoonFilmName}>{item.filmname}</Text>
        <View style={styles.comingSoonTypeRow}>
          <Ionicons name="film-outline" size={16} color="gray" />
          <Text style={styles.comingSoonTypeText}>{item.type}</Text>
        </View>
        <View style={styles.comingSoonPremiereRow}>
          <Ionicons name="calendar-outline" size={16} color="gray" />
          <Text style={styles.comingSoonPremiereText}>{item.premiere}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFilms, setFilteredFilms] = useState<Film[]>([]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  
    if (text.trim() === '') {
      setFilteredFilms([]); // Xóa kết quả tìm kiếm nếu không có từ khóa
    } else {
      const matchingFilms = films.filter((film) =>
        film.filmname.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFilms(matchingFilms);
    }
  };

  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.topSection}>

        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hi, {user?.name} <Text style={styles.wave}>👋</Text>
          </Text>
          <View style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View style={styles.greenDot} />
          </View>
        </View>

        <Text style={styles.welcome}>Welcome back</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="gray" style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="gray"
            style={styles.searchInput}
            onChangeText={handleSearch}
          />
        </View>

        {searchQuery.length > 0 && filteredFilms.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <ScrollView>
              {filteredFilms.map((item) => (
                <TouchableOpacity
                  key={item.idfilm.toString()}
                  onPress={() => handleMoviePress(item)}
                  style={styles.searchResultItem}
                >
                  <Text style={styles.searchResultText}>{item.filmname}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.nowPlayingHeader}>
          <Text style={styles.nowPlayingText}>Now playing</Text>
          <TouchableOpacity  onPress={() => navigation.navigate('Movie')}>
            <Text style={styles.seeAllButton}>See all</Text>
          </TouchableOpacity>
        </View>

        {films.length > 0 && (
          <>
            <FlatList
              ref={flatListRef}
              data={films}
              horizontal
              pagingEnabled
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              renderItem={renderFilmItem}
              keyExtractor={(item) => item.idfilm.toString()}
              style={styles.carouselContainer}
              snapToInterval={320}
              snapToAlignment="center"
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const width = 320;
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentFilmIndex(newIndex);
              }}
            />
            <View style={styles.scrollIndicator}>
              {films.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorDot,
                    index === currentFilmIndex ? styles.activeDot : {},
                  ]}
                />
              ))}
            </View>
          </>
        )}

        <View style={styles.comingSoonHeader}>
          <Text style={styles.nowPlayingText}>Coming Soon</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Movie', { tab: 'comingSoon' })}>

            <Text style={styles.seeAllButton}>See all</Text>
          </TouchableOpacity>
        </View>

      <FlatList
      data={comingSoonFilms}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderComingSoonFilmItem}
      keyExtractor={(item) => item.idfilm.toString()}
      style={styles.comingSoonList}
      />
      </View>
      
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  scrollContentContainer: {
    paddingBottom: 50,
  },  
  topSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  greeting: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  wave: {
    fontSize: 20,
  },
  notificationIcon: {
    position: 'relative',
  },
  greenDot: {
    width: 8,
    height: 8,
    backgroundColor: '#32CD32',
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  welcome: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  nowPlayingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  comingSoonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  nowPlayingText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  seeAllButton: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
  },
  carouselContainer: {
    marginTop: 10,
  },
  filmItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 320,
    paddingHorizontal: 8,
  },
  mainFilmImage: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 12,
  },
  fullImage: {
    opacity: 1,
  },
  partialImage: {
    opacity: 0.7,
  },
  filmName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  filmDetails: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
  },
  starRating: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  scrollIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFD700',
  },


  comingSoonFilmItem: {
    width: 180,
    marginRight: 16,
    alignItems: 'center',
  },
  comingSoonFilmImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 8,
  },
  comingSoonFilmDetails: {
    alignItems: 'flex-start',
    width: '100%',
  },
  comingSoonFilmName: {
    color: 'gold',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  comingSoonTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  comingSoonTypeText: {
    color: 'gray',
    fontSize: 14,
    marginLeft: 4,
  },
  comingSoonPremiereRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comingSoonPremiereText: {
    color: 'gray',
    fontSize: 14,
    marginLeft: 4,
  },
  comingSoonList: {
    paddingVertical: 16,
  },

  searchResultsContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    maxHeight: 200,
    marginTop: -15,
    padding: 10,
    width: '100%', 
  },
  searchResultItem: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
  },
  searchResultText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomePage;