import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Image } from 'react-native';
import Footer from './Footer'; // Giả sử bạn đã có Footer.tsx
import { supabase } from '../supabaseClient';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon

interface MovieType {
  idfilm: number;
  filmname: string;
  type: string;
  time: string;
  premiere: string;
  image: string;
  average_rating: string | number;
  total_comments: number;
}

// Đối tượng ánh xạ hình ảnh
const imageMapping: { [key: string]: any } = {
  'assets/Films/Film1.png': require('../assets/Films/Film1.png'),
  'assets/Films/Film2.png': require('../assets/Films/Film2.png'),
  'assets/Films/Film3.png': require('../assets/Films/Film3.png'),
  'assets/Films/Film4.png': require('../assets/Films/Film4.png'),
  'assets/Films/Film5.png': require('../assets/Films/Film5.png'),
  'assets/Films/Film6.png': require('../assets/Films/Film6.png'),
  'assets/Films/Film7.png': require('../assets/Films/Film7.png'),
  'assets/Films/Film8.png': require('../assets/Films/Film8.png'),
  // Thêm các hình ảnh khác vào đây
};

const Movie: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'nowPlaying' | 'comingSoon'>('nowPlaying');
  const [movies, setMovies] = useState<MovieType[]>([]);

  const fetchMovies = async () => {
    const status = selectedTab === 'nowPlaying' ? 1 : 0;

    const { data, error } = await supabase
      .from('films')
      .select(`
        idfilm,
        filmname,
        type,
        time,
        premiere,
        image,
        user_film (
          star,
          comments
        )
      `)
      .eq('status', status);

    if (error) {
      console.error('Error fetching movies:', error);
      return;
    }

    const processedMovies: MovieType[] = data.map((movie) => {
      const ratings = movie.user_film.map((uf) => uf.star);
      const comments = movie.user_film.filter((uf) => uf.comments).length;

      return {
        idfilm: movie.idfilm,
        filmname: movie.filmname,
        type: movie.type,
        time: movie.time,
        premiere: movie.premiere,
        image: movie.image,
        average_rating: ratings.length
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
          : 0,
        total_comments: comments,
      };
    });

    setMovies(processedMovies);
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedTab]);

  // Hàm để lấy hình ảnh
  const getImageSource = (uri: string) => {
    const imagePath = uri.startsWith('/') ? uri.slice(1) : uri; // Bỏ dấu "/" đầu tiên
    return imageMapping[imagePath] || require('../assets/Films/Film1.png'); // Trả về hình ảnh mặc định nếu không tìm thấy
  };

  const renderMovieItem = ({ item }: { item: MovieType }) => {
    return (
      <View style={styles.movieItem}>
        <Image source={getImageSource(item.image)} style={styles.image} />
        <Text style={styles.filmName}>{item.filmname}</Text>
        {selectedTab === 'nowPlaying' ? (
          <>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>
                {item.average_rating} ({item.total_comments})
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Icon name="clock-o" size={16} color="#fff" />
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={styles.typeContainer}>
              <Icon name="film" size={16} color="#fff" />
              <Text style={styles.type}>{item.type}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.premiereContainer}>
              <Icon name="calendar" size={16} color="#fff" />
              <Text style={styles.premiere}>{item.premiere}</Text>
            </View>
            <View style={styles.typeContainer}>
              <Icon name="film" size={16} color="#fff" />
              <Text style={styles.type}>{item.type}</Text>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'nowPlaying' && styles.activeTab]}
          onPress={() => setSelectedTab('nowPlaying')}
        >
          <Text style={[styles.tabText, selectedTab === 'nowPlaying' && styles.activeTabText]}>
            Now playing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'comingSoon' && styles.activeTab]}
          onPress={() => setSelectedTab('comingSoon')}
        >
          <Text style={[styles.tabText, selectedTab === 'comingSoon' && styles.activeTabText]}>
            Coming soon
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.idfilm.toString()}
        renderItem={renderMovieItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      {/* Đảm bảo Footer luôn nằm ở dưới cùng và không bị khuất */}
      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
    paddingBottom: 80, // Để tạo không gian cho Footer
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 20,
    alignSelf: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1A1A1A',
  },
  activeTab: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
  },
  tabText: {
    color: '#808080',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#000',
  },
  movieItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    alignItems: 'flex-start', // Canh giữa nội dung
    marginBottom: 25
  },
  filmName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center', // Căn giữa cho tên phim
  },
  image: {
    width: '100%', // Chiếm toàn bộ chiều rộng của item
    aspectRatio: 175 / 267, // Tỷ lệ chiều rộng/chiều cao
    resizeMode: 'cover', // Giữ tỷ lệ nhưng không làm biến dạng ảnh
    marginTop: -10, // Điều chỉnh vị trí ảnh nếu cần
    borderRadius: 10,
    marginLeft: -9
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  premiereContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    color: '#fff',
    marginLeft: 5,
  },
  time: {
    color: '#fff',
    marginLeft: 5,
  },
  premiere: {
    color: '#fff',
    marginLeft: 5,
  },
  type: {
    color: '#808080',
    marginLeft: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default Movie;