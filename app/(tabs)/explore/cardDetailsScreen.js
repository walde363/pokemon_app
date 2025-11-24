import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../../constants/header';

export default function CardDetailsScreen() {
  const { card } = useLocalSearchParams();
  const parsedCard = card ? JSON.parse(card) : null;

  if (!parsedCard) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>Card data not found.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: `${parsedCard.image}/high.png` || 'https://www.freeiconspng.com/uploads/file-pokeball-png-0.png' }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <Text style={styles.cardTitle}>{parsedCard.name}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  cardContainer: {
    backgroundColor: '#1e1e1e',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: 250,
    height: 350,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});
