import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { get, ref } from 'firebase/database';
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
  const [dataTableau, setDataTableau] = useState([]);
  const [bonneReponse, setBonneReponse] = useState('');
  const [question, setQuestion] = useState('');
  const [numeroQuestion, setNumeroQuestion] = useState(0);

    useEffect(() => {
        get(ref(db, `${valeur}/question-temps`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const dataFormatter = Object.entries(data).map(([key, value]) => ({
                    question: key,
                    date: value  
                }));
                setDateQuestion(dataFormatter);
            }
        });
    }, []);
    useEffect(() => {
        dateQuestion.forEach((dateStr) => {
            const date = new Date(dateStr.date);
            const delay = date.getTime() + 120000 - Date.now(); // 2 minutes après la date
            console.log("delay :", delay);
    
            // Fonction pour récupérer les données du score et de la question
            const recupererData = () => {
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
    
                get(ref(db, `${valeur}/question_reponse/${dateStr.question}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setNumeroQuestion(dateStr.key)
                        setQuestion(data.question);
                        setBonneReponse(data.reponse1);
                    }
                });
            };
    
            if (delay > 0) {
                // Planification avec setTimeout si la date n'est pas encore passée
                setTimeout(() => {
                    recupererData(); // Exécute la fonction lorsque le délai arrive à 0
                }, delay);
            } else {
                recupererData();
            }
        });
    }, [dateQuestion]);
    

      return (
        <View style={styles.container}>
            {question !== '' && bonneReponse !== '' ? (
                <>
                    <Text style={styles.sous_titre}>Question {numeroQuestion} : {question}</Text>
                    <Text style={styles.sous_titre2}>La bonne réponse : {bonneReponse}</Text>
                </>
            ) : null}
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
    sous_titre: {
        color: '#757575',
        textAlign: 'center',
        fontSize: wp('5%'),
        paddingTop: wp('2%'),
        paddingBottom : wp('2%'),
        textDecorationLine: 'underline',
    },
    sous_titre2: {
        color: '#4CAF50',
        textAlign: 'center',
        fontSize: wp('4%'),
        paddingTop: wp('2%'),
        paddingBottom : wp('2%'),
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
