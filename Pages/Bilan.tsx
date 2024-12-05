import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { get, ref, onValue  } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
interface RouteParams {
  valeur: string;
  pseudo: string;
}

const Score: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo } = route.params as RouteParams;
  const [reponseTableau, setReponseTableau] = useState<any[]>([]);
  const [questions, setQuestions] = useState<{ indice: string; question: string; reponse: string }[]>([]);
  const [tableauFinal, setTableauFinal] = useState<any[]>([]);

    useEffect(() => {
        const dbRef = ref(db, `${valeur}/reponses/${pseudo}`);
        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              setReponseTableau(data)
            } else {
              console.log('Aucune donnée disponible pour cette référence.');
            }
          });
    }, []);
    useEffect(() => {
        get(ref(db, `${valeur}/question_reponse`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val() as { [key: string]: { question: string , reponse1: string } };
                const questionArray = Object.entries(data).map(([key, value]) => ({
                    indice: key,
                    question: value.question,
                    reponse: value.reponse1,
                }));
                setQuestions(questionArray);    
            }
        });
    }, []);

    
    useEffect(() => { 
        setTableauFinal(questions.map((questionItem, index) => {
            return {
                indice: questionItem.indice,
                question: questionItem.question,
                reponse: reponseTableau[index+1] || 'Aucune réponse',
                bonneReponse: questionItem.reponse,
            };
        }));
        
        
    }, [questions]);
    return (
        <View style={styles.container}>
            <FlatList
                data={tableauFinal}
                keyExtractor={(item) => item.indice}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>Question {item.indice}: {item.question}</Text>
                        <Text style={styles.itemText}>Votre réponse: {item.reponse}</Text>
                        <Text style={styles.itemText}>La bonne réponse: {item.bonneReponse}</Text>
                    </View>
                )}
            />
            <TouchableOpacity 
                style={styles.bouton} 
                onPress={() => navigation.navigate('Score', { valeur, pseudo })}
            >
                <Text style={styles.boutonText}>Score</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    itemContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    bouton: {
        backgroundColor: '#4CAF50',
        paddingVertical: hp('2.5%'),
        paddingHorizontal: wp('15%'),
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
     boutonText: {
        color: '#FFFFFF',
        fontSize: wp('4%'),
        fontWeight: 'bold',
     },
});

export default Score;
