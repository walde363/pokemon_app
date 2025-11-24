import { StyleSheet, Text, View } from 'react-native';
import Header from '../../constants/header';

export default function ComingSoon() {
  return (
    <View>
      <Header />
      <Text style={styles.title}>🚧 Coming Soon!</Text>
      <Text style={styles.message}>
        This page is under construction. Check back later!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
