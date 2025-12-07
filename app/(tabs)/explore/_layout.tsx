import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function ExploreLayout() {

  return (
      <Stack>
        <Stack.Screen name="setsScreen" options={{ headerShown: false }}/>
        <Stack.Screen name="cardsScreen" options={{ headerShown: false }}/>
        <Stack.Screen name="cardDetailsScreen" options={{ headerShown: false }}/>
      </Stack>
  );
}