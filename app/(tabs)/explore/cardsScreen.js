import { Buffer } from 'buffer';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
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
    const cameraRef = useRef(null);
    const { set } = useLocalSearchParams();
    const parsedSet = set ? JSON.parse(set) : null;

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [preview, setPreview] = useState(null);
    const [match, setMatch] = useState('');
    const [scanning, setScanning] = useState(false);

    // --- Take picture and send to backend for matching ---
    const takePicture = async () => {
        console.log('takePicture called');
        if (!cameraRef.current) {
            console.warn('Camera ref is not ready');
            return;
        }

        setScanning(true);
        console.log('Scanning started');

        try {
            const photo = await cameraRef.current.takePictureAsync({ base64: false });
            console.log('Picture taken:', photo.uri);

            setPreview(photo.uri);

            // Prepare multipart form data
            const formData = new FormData();
            formData.append('image', {
                uri: photo.uri,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
            formData.append('setId', parsedSet.id);
            console.log('FormData prepared with setId:', parsedSet.id);

            // Replace with your backend URL
            console.log('Sending image to backend...');
            const response = await fetch('http://192.168.0.170:3000/api/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            console.log('Response received from backend. Status:', response.status);

            if (!response.ok) {
                console.error('Backend returned error status');
                throw new Error('Failed to fetch match');
            }

            const result = await response.json();
            console.log('Backend response JSON:', result);

            setMatch(`${result.name} (${(result.score * 100).toFixed(1)}% match)`);
            console.log('Match state updated:', result.name, result.score);

        } catch (err) {
            console.error('Error during matching:', err);
            setMatch('Error recognizing card');
        } finally {
            setScanning(false);
            setCameraVisible(false);
            console.log('Scanning finished, camera modal closed');
        }
    };



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

            {/* Floating Scan Button */}
            <TouchableOpacity style={styles.floatingButton} onPress={() => setCameraVisible(true)}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>SCAN</Text>
            </TouchableOpacity>

            {/* Camera Modal */}
            <Modal visible={cameraVisible} animationType="slide">
                <CameraView
                    ref={cameraRef}
                    style={{
                        width: 300,
                        height: 420,
                        alignSelf: 'center',
                        borderRadius: 12,
                        overflow: 'hidden',
                    }}
                />

                <View style={styles.cameraControls}>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={scanning}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {scanning ? 'SCANNING...' : 'CAPTURE'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.captureButton, { backgroundColor: '#444' }]}
                        onPress={() => setCameraVisible(false)}
                    >
                        <Text style={{ color: 'white' }}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Preview Modal */}
            <Modal visible={!!preview} transparent animationType="fade">
                <View style={styles.previewContainer}>
                    <Image source={{ uri: preview }} style={styles.previewImage} />
                    <Text style={styles.matchText}>{match}</Text>
                    <TouchableOpacity style={styles.closePreviewButton} onPress={() => setPreview(null)}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
