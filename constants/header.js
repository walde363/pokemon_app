import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
    return (
        <SafeAreaView style={styles.header}>
            <Text style={styles.headerText}>W&J Pokémon TCG Sets App</Text>
            <Image
                source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
                style={styles.headerIcon}
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffcb05',
        paddingVertical: 20,
    },
    headerText: {
        color: '#3b4cca',
        fontSize: 24,
        fontWeight: '900',
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    headerIcon: {
        width: 40,
        height: 40,
        marginLeft: 10,
    },
});