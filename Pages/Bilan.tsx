import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, FlatList } from 'react-native';
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
  const [dateQuestion, setDateQuestion] = useState([]);
  const [reponseTableau, setReponseTableau] = useState<any[]>([]);
  const [bonneReponseTableau, setBonneReponseTableau] = useState([]);
  const [questions, setQuestions] = useState<{ indice: string; question: string }[]>([]);
  const [tableauFinal, setTableauFinal] = useState<any[]>([]);

    useEffect(() => {
        get(ref(db, `${valeur}/question_reponse`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setBonneReponseTableau(data.reponse1);
            } else {
                console.log('La date est déjà passée');
            }
        });
      }, []);
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
                const data = snapshot.val() as { [key: string]: { question: string } };
                const questionArray = Object.entries(data).map(([key, value]) => ({
                    indice: key,
                    question: value.question,
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
                bonneReponse: bonneReponseTableau[index] || '',
            };
        }));
        
        
    }, [bonneReponseTableau, questions]);
    return (
        <View style={styles.container}>
            <Text style={styles.titre}>Bilan</Text>
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
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    titre: {
        color: '#333333',
        fontWeight: 'bold',
        fontSize: wp('8%'),
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
});

export default Score;
