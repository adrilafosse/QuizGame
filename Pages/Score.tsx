import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
interface RouteParams {
  valeur: string;
}

const Score: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur } = route.params as RouteParams;
  const [dataTableau, setDataTableau] = useState([]);

    useEffect(() => {
        get(ref(db, `${valeur}/score`)).then((snapshot) => {
            if (snapshot.exists()) {
                const nouvelleDonnee = snapshot.val();
                const dataArray = Object.entries(nouvelleDonnee)
                    .map(([name, score]) => ({ name, score: Number(score) }))
                    .sort((a, b) => b.score - a.score);
                setDataTableau(dataArray);
            } else {
                console.log('Aucune donnée trouvée !');
            }
        });
    });
    
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
