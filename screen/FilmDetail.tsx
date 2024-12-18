import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Director from './Director';
import Cinemas from './Cinemas';
import { Video, ResizeMode } from 'expo-av';

type RootStackParamList = {
  FilmDetail: { id: number; userId: string };
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

const videoMapping: { [key: string]: any } = {
  '../assets/Films/Film1.mp4': require('../assets/Films/Film3.mp4'),
  '../assets/Films/Film2.mp4': require('../assets/Films/Film3.mp4'),
  '../assets/Films/Film3.mp4': require('../assets/Films/Film3.mp4'),
  '../assets/Films/Film4.mp4': require('../assets/Films/Film3.mp4'),
  '../assets/Films/Film5.mp4': require('../assets/Films/Film3.mp4'),
  '../assets/Films/Film6.mp4': require('../assets/Films/Film3.mp4'),
  '../assets/Films/Film7.mp4': require('../assets/Films/Film3.mp4'),
  '../assets/Films/Film8.mp4': require('../assets/Films/Film3.mp4'),
};

type FilmDetailRouteProp = RouteProp<RootStackParamList, 'FilmDetail'>;

interface MovieType {
  idfilm: number;
  filmname: string;
  type: string;
  time: string;
  country: string;
  object: string;
  content: string;
  premiere: string;
  image: string;
  demo: string;
  average_rating: string | number;
  total_comments: number;
}

const FilmDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<FilmDetailRouteProp>();
  const { id } = route.params;
  const [movieDetails, setMovieDetails] = useState<MovieType | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const videoRef = React.useRef(null);

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
    const fetchMovieDetails = async () => {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .eq('idfilm', id)
        .single();

      if (error) {
        console.error('Error fetching movie details:', error);
      } else {
        setMovieDetails(data);
      }
    };

    const fetchUserRating = async () => {
      if (!user) return;
  
      const { data, error } = await supabase
        .from('user_film')
        .select('star')
        .eq('idfilm', id)
        .eq('iduser', user.id)
        .single();
  
      if (error) {
        console.error('Error fetching user rating:', error);
      } else {
        setUserRating(data?.star || null);
      }
    };

    fetchMovieDetails();
    fetchAverageRating();
    fetchUserRating(); // Gọi để tải số sao người dùng đã đánh giá
  }, [id, user]);

  const fetchAverageRating = async () => {
    const { data, error } = await supabase
      .from('user_film')
      .select('star')
      .eq('idfilm', id);

    if (error) {
      console.error('Error fetching average rating:', error);
    } else if (data.length > 0) {
      const totalStars = data.reduce((sum, record) => sum + record.star, 0);
      const avgStars = totalStars / data.length;
      setAverageRating(avgStars);
    } else {
      setAverageRating(0);
    }
  };

  const handleStarPress = async (rating: number) => {
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để đánh giá phim.');
      return;
    }

    setUserRating(rating);
    
    const { error } = await supabase
      .from('user_film')
      .upsert({ idfilm: id, iduser: user.id, star: rating });

    if (error) {
      console.error('Error saving rating:', error);
      Alert.alert('Lỗi', 'Không thể lưu đánh giá, vui lòng thử lại.');
    } else {
      Alert.alert('Thành công', 'Đánh giá phim của bạn đã được lưu thành công!');
      fetchAverageRating();
    }
  };

  if (!movieDetails) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18, color: '#555', textAlign: 'center', margin: 20, fontWeight: 'bold' }}>
          Loading...
        </Text>
      </View>
    );
  }

  const getImageSource = (uri: string) => {
    const imagePath = uri.startsWith('/') ? uri.slice(1) : uri;
    return imageMapping[imagePath] || require('../assets/Films/Film1.png');
  };

  const getVideoSource = (uri: string) => {
    const videoPath = uri;
    return videoMapping[videoPath] || require('../assets/Films/Film3.mp4');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Image source={getImageSource(movieDetails.image)} style={styles.image} />
        <View style={styles.infoBox}>
          <Text style={styles.title}>{movieDetails.filmname}</Text>
          <View style={styles.detailContainer}>
            <Text style={styles.detail}>{movieDetails.time}</Text>
            <Text style={styles.detail}>{movieDetails.premiere}</Text>
          </View>
          <View style={styles.reviewContainer}>
            <Text style={styles.reviewText}>Review:</Text>
            <FontAwesome name="star" size={16} color="gold" />
            <Text style={styles.reviewText}>{averageRating ? averageRating.toFixed(1) : 'N/A'}</Text>
          </View>
          <View style={styles.starsAndTrailerContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                    <FontAwesome 
                      name="star" 
                      size={24} 
                      color={userRating && userRating >= star ? "gold" : "gray"} 
                      style={styles.starIcon} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            <TouchableOpacity style={styles.trailerButton} onPress={() => setIsTrailerVisible(true)}>
              <FontAwesome name="play" size={16} color="#FFFFFF" />
              <Text style={styles.trailerText}>Watch Trailer</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          visible={isTrailerVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsTrailerVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Video
                ref={videoRef}
                source={getVideoSource(movieDetails.demo)}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsTrailerVisible(false)}>
                <FontAwesome name="times" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Director filmId={movieDetails.idfilm} />
        <Cinemas filmId={movieDetails.idfilm} />
      </ScrollView>
    </View>
  );
};

export default FilmDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContentContainer: {
    paddingBottom: 20, // Thêm khoảng cách dưới cùng để cuộn dễ dàng hơn
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 200, // Thay đổi chiều cao để dễ cuộn
    resizeMode: 'cover',
    borderRadius: 10,
  },
  infoBox: {
    marginTop: -60, // Thêm khoảng cách phía trên
    marginHorizontal: 20,
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  detail: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  reviewText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 5,
    marginRight: 10,
  },
  starsAndTrailerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5733',
    borderRadius: 5,
    padding: 10,
    marginLeft: 23
  },
  trailerText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});