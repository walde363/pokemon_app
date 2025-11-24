import getAllSets from '@/api/get/getAllSets';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Header from '../../../constants/header';

const screenWidth = Dimensions.get('window').width;
const setWidth = (screenWidth / 2) - 16;


export default function SetsScreen() {
  
  const [sets, setSets] = useState([]);
  const [searchedSets, setSearchedSets] = useState([]);
  const [searchedValue, setSearchedValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleNavigate = (item) => {
    router.push({
      pathname: '/(tabs)/explore/cardsScreen',
      params: { set: JSON.stringify(item) },
    });
  };

  const SetItem = React.memo(({ item, onPress }) => {
    const logoUri = item.logo
      ? `${item.logo}.webp`
      : 'https://www.freeiconspng.com/uploads/file-pokeball-png-0.png';

    return (
      <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
        <Image
          source={{ uri: logoUri }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  });

  const renderItem = React.useCallback(
    ({ item }) => <SetItem item={item} onPress={handleNavigate} />,
    [handleNavigate]
  );

  const updateSearch = (search) => {
    setSearchedValue(search);
    const filteredSets = sets.filter((set) =>
      set.name.toLowerCase().includes(search.toLowerCase())
    );
    setSearchedSets(filteredSets);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchSets = async () => {
      try {
        const data = await getAllSets();
        if (isMounted) {
          setSets(data);
          setSearchedSets(data);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSets();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#fff" />;
  if (error) return <Text style={{ color: 'red' }}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar
        onChangeText={updateSearch}
        value={searchedValue}
      />

      <FlatList
        data={searchedSets}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : `${item.name}-${index}`
        }
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        windowSize={5}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews
        getItemLayout={(data, index) => ({
          length: 180, // adjust based on your item height
          offset: 180 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 8,
  },
  item: {
    width: setWidth,
    height: setWidth * 0.9, // slightly taller to fit text
    margin: 4,
    borderRadius: 12,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '80%', // only fill 80% of container
  },
  text: {
    color: 'white',
    textAlign: 'center',
    marginTop: 4,
  },

});
