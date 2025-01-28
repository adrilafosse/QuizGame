import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { dbFirestore } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
interface RouteParams {
    valeur: string;
}

const Score: React.FC<{ navigation: any }> = ({ navigation }) => {
    const route = useRoute();
    const { valeur } = route.params as RouteParams;
    const [dataTableau, setDataTableau] = useState([]);
    useEffect(() => {
        const Scores = async () => {
            try {
                const docRef = doc(dbFirestore, `${valeur}/score`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const scoresData = docSnap.data();
                    const dataArray = Object.entries(scoresData)
                        .map(([name, score]) => ({ name, score: Number(score) }))
                        .sort((a, b) => b.score - a.score);
                    setDataTableau(dataArray);
                } else {
                    console.log('Aucune donnée trouvée !');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des scores depuis Firestore:', error);
            }
        }
        Scores();
    }, []);

    return (
        <View style={styles.container}>
            {dataTableau.map((item, index) => (
                <View key={item.name} style={styles.rankItem}>
                    <Text style={styles.rankText}>{index + 1}. {item.name} - {item.score} pts</Text>
                </View>
            ))}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    rankItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    rankText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
});

export default Score;
