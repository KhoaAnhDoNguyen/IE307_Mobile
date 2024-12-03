import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DirectorProps {
  filmId: number; 
}

interface Film {
  idfilm: number;
  type: string; 
  country: string; 
  object: string; 
  content: string; 
}

interface Director {
  iddirector: number;
  namedirector: string;
  avatardirector: string;
}

interface Actor {
  idactor: number;
  nameactor: string;
  avataractor: string;
}

const directorMapping: { [key: string]: any } = {
  '/assets/Directors/Director1.png': require('../assets/Directors/Director1.png'),
  '/assets/Directors/Director2.png': require('../assets/Directors/Director2.png'),
};

const getDirectorSource = (uri: string) => {
  const directorPath = uri;
  return directorMapping[directorPath] || require('../assets/Directors/Director1.png');
};

const actorMapping: { [key: string]: any } = {
  '/assets/Actors/Actor1.png': require('../assets/Actors/Actor1.png'),
  '/assets/Actors/Actor2.png': require('../assets/Actors/Actor2.png'),
};

const getActorSource = (uri: string) => {
  const actorPath = uri;
  return actorMapping[actorPath] || require('../assets/Actors/Actor1.png');
};

const Director: React.FC<DirectorProps> = ({ filmId }) => {
  const [movieDetails, setMovieDetails] = useState<Film | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const { data, error } = await supabase
        .from('films')
        .select('idfilm, type, country, object, content')
        .eq('idfilm', filmId)
        .single();

      if (error) {
        console.error('Error fetching movie details:', error);
      } else {
        setMovieDetails(data);
      }
    };

    const fetchDirectors = async () => {
      const { data: filmDirectorData, error: filmDirectorError } = await supabase
        .from('film_director')
        .select('iddirector')
        .eq('idfilm', filmId);

      if (filmDirectorError) {
        console.error('Error fetching film_director:', filmDirectorError);
        return;
      } 

      const directorIds = filmDirectorData.map((item: { iddirector: number }) => item.iddirector);

      if (directorIds.length > 0) {
        const { data: directorsData, error: directorsError } = await supabase
          .from('directors')
          .select('iddirector, namedirector, avatardirector')
          .in('iddirector', directorIds);

        if (directorsError) {
          console.error('Error fetching directors:', directorsError);
        } else {
          setDirectors(directorsData);
        }
      } else {
        console.log('No directors found for this film.');
        setDirectors([]);
      }
    };

    //Actors
    const fetchActors = async () => {
      const { data: filmActorData, error: filmActorError } = await supabase
        .from('film_actor')
        .select('idactor')
        .eq('idfilm', filmId);

      if (filmActorError) {
        console.error('Error fetching film_actor:', filmActorError);
        return;
      } 

      const actorIds = filmActorData.map((item: { idactor: number }) => item.idactor);

      if (actorIds.length > 0) {
        const { data: actorsData, error: actorsError } = await supabase
          .from('actors')
          .select('idactor, nameactor, avataractor')
          .in('idactor', actorIds);

        if (actorsError) {
          console.error('Error fetching actors:', actorsError);
        } else {
          setActors(actorsData);
        }
      } else {
        console.log('No actors found for this film.');
        setActors([]);
      }
    };

    fetchMovieDetails();
    fetchDirectors();
    fetchActors();
  }, [filmId]);

  const toggleContentVisibility = () => {
    setShowFullContent(!showFullContent);
  };

  const renderDirectorItem = ({ item }: { item: Director }) => (
    <View style={styles.directorItem}>
      <Image 
        source={getDirectorSource(item.avatardirector)} 
        style={styles.avatar} 
      />
      <Text style={styles.directorName}>{item.namedirector}</Text>
    </View>
  );

  const renderActorItem = ({ item }: { item: Actor }) => (
    <View style={styles.actorItem}>
      <Image 
        source={getActorSource(item.avataractor)} 
        style={styles.avatar} 
      />
      <Text style={styles.actorName}>{item.nameactor}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {movieDetails ? (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Movie Genre:</Text>
            <Text style={styles.value}>{movieDetails.type || 'Unknown'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Censorship:</Text>
            <Text style={styles.value}>{movieDetails.object || 'Unknown'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>{movieDetails.country || 'Unknown'}</Text>
          </View>

          <View style={styles.storylineContainer}>
            <Text style={styles.label_story}>Storyline</Text>
            <Text style={styles.content}>
              {showFullContent ? movieDetails.content : `${movieDetails.content.substring(0, 100)}...`}
            </Text>
            <TouchableOpacity onPress={toggleContentVisibility}>
              <Text style={styles.seeMore}>{showFullContent ? 'See Less' : 'See More'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.directorTitle}>Directors</Text>
            {directors.length > 0 ? (
              <FlatList
                data={directors}
                renderItem={renderDirectorItem}
                keyExtractor={(item) => item.iddirector.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.directorList}
              />
            ) : (
              <Text style={styles.noResults}>Results not found</Text>
            )}

            <Text style={styles.actorTitle}>Actors</Text>
            {actors.length > 0 ? (
              <FlatList
                data={actors}
                renderItem={renderActorItem}
                keyExtractor={(item) => item.idactor.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actorList}
              />
            ) : (
              <Text style={styles.noResults}>Results not found</Text>
            )}
        </>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </View>
  );
};

export default Director;

const styles = StyleSheet.create({
  container: {
    padding: 22,
    borderRadius: 10,
    top: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  label_story: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  storylineContainer: {
    marginTop: 20,
  },
  content: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  seeMore: {
    color: 'yellow',
    fontWeight: 'bold',
  },
  loading: {
    color: '#FFFFFF',
  },
  directorTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginVertical: 15,
  },
  directorList: {
    paddingVertical: 10,
  },
  directorItem: {
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  directorName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  actorTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginVertical: 15,
  },
  actorList: {
    paddingVertical: 10,
  },
  actorItem: {
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  actorName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  noResults: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  
});