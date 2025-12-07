import { useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import getAllCards from '@/api/get/getAllSetCards';
import Header from '../../../constants/header';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2 - 45;

export default function CardsScreen() {
    const router = useRouter();
    const { set } = useLocalSearchParams();
    const parsedSet = set ? JSON.parse(set) : null;

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();

    // --- Fetch cards for displaying ---
    useEffect(() => {
        const fetchCards = async () => {
            try {
                const data = await getAllCards(parsedSet.id);
                setCards(data.cards);
            } catch (err) {
                setError(err.message);
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    const handleNavigate = (item) => {
        router.push({
            pathname: '/(tabs)/explore/cardDetailsScreen',
            params: { card: JSON.stringify(item) },
        });
    };

    if (!permission) return <Text>Requesting camera permission...</Text>;
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                    Camera access is required to scan cards.
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={{ color: 'white' }}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) return <ActivityIndicator size="large" color="#00f" style={{ flex: 1 }} />;
    if (error) return <Text style={{ color: 'red' }}>Error: {error}</Text>;

    return (
        <View style={{ flex: 1 }}>
            <Header />

            <FlatList
                data={cards}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => handleNavigate(item)}>
                        <Image
                            source={{ uri: `${item.image}/high.png` }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Text style={styles.name}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        margin: 8,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#123',
        borderRadius: 8,
        padding: 8,
    },
    image: {
        width: cardWidth,
        height: cardWidth * 1.4,
        borderRadius: 8,
        alignSelf: 'center',
    },
    name: {
        color: 'white',
        textAlign: 'left',
        marginTop: 6,
        fontSize: 16,
        fontWeight: 'bold',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007bff',
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3,
    },
    cameraControls: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    captureButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    permissionButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: 250,
        height: 350,
        borderRadius: 8,
        marginBottom: 20,
    },
    matchText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 16,
    },
    closePreviewButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
});
