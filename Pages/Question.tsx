import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { get, ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface RouteParams {
  valeur: string;
  pseudo: string;
  compteur: number;
  date2: string;
  token: string;
  uid: string;
}

const Question: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo, compteur, date2, token, uid } = route.params as RouteParams;
  const [nombreQuestions, setNombreQuestions] = useState(0);
  const [nombreReponses, setNombreReponses] = useState(0);
  const [question, setQuestion] = useState('');

  const [reponse, setReponse] = useState('');
  const [timer, setTimer] = useState(60);
  let tableau = [];
  const [tableauFinal, setTableauFinal] = useState<string[]>([]);
  const [redirection, setRedirection] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);

  //reinitialisation des champs
  useFocusEffect(
    React.useCallback(() => {
      setTimer(60);
      setQuestion('');
      setReponse('');
      setRedirection(false);
    }, [compteur])
  );

  useEffect(() => {
    const dateActuelle = new Date();
    const dateComparaison = new Date(date2)
    dateComparaison.setMinutes(dateComparaison.getMinutes() + 2)
    if (!reponse) {
      //Si la notification est apparue il y a plus de 2 minutes ou si le compteur est arrivé à 0
      if (dateActuelle > dateComparaison) {
        if (compteur < nombreQuestions) {
          update(ref(db, `${valeur}/reponses/${pseudo}`), {
            [`${compteur}`]: '',
          });
          navigation.navigate('ReponseTropLongue');
        }
        else if (compteur == nombreQuestions) {
          update(ref(db, `${valeur}/reponses/${pseudo}`), {
            [`${compteur}`]: '',
          });
          navigation.navigate('Retour', { valeur, pseudo });
        }
      }
    }
  }, [timer, date2, reponse, compteur])

  useEffect(() => {
    if (redirection == false) {
      if (timer > 0) {
        // Utilisation de setInterval pour décrémenter le timer toutes les secondes
        const intervalId = setInterval(() => {
          setTimer(prev => prev - 1);
        }, 1000);

        // Nettoyer l'intervalle lors du démontage ou de la mise à jour du timer
        return () => clearInterval(intervalId);
      }
      if (!reponse) {
        if (compteur < nombreQuestions && timer == 0) {
          update(ref(db, `${valeur}/reponses/${pseudo}`), {
            [`${compteur}`]: '',
          });
          navigation.navigate('ReponseTropLongue');
          setRedirection(true)
        }
        else if (compteur == nombreQuestions && timer == 0) {
          update(ref(db, `${valeur}/reponses/${pseudo}`), {
            [`${compteur}`]: '',
          });
          navigation.navigate('Retour', { valeur, pseudo });
          setRedirection(true)
        }
      }
    }
  }, [timer, date2, reponse, compteur]);

  useEffect(() => {
    get(ref(db, `${valeur}/nombreDeQuestions`)).then((snapshot) => {
      if (snapshot.exists()) {
        setNombreQuestions(snapshot.val());
      }
    });
    get(ref(db, `${valeur}/question_reponse/${compteur}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setNombreReponses(data.nombreDeReponses);
        setQuestion(data.question);
        if (data.nombreDeReponses === 2) {
          tableau = [data.reponse1, data.reponse2]
        }
        if (data.nombreDeReponses === 3) {
          tableau = [data.reponse1, data.reponse2, data.reponse3]
        }
        if (data.nombreDeReponses === 4) {
          tableau = [data.reponse1, data.reponse2, data.reponse3, data.reponse4]
        }
        const tableauMelange = melangerTableau(tableau);
        setTableauFinal(tableauMelange);
      }
    });
  }, [compteur]);

  const melangerTableau = (tableau) => {
    const taille = tableau.length;
    for (let i = 0; i < taille; i++) {
      const a = Math.floor(Math.random() * taille);
      const temp = tableau[i];
      tableau[i] = tableau[a];
      tableau[a] = temp;
    }
    return tableau;
  };

  const Validation = async (reponse: string) => {
    try {
      const reponseAPI = await fetch('https://back-mv6pbo6mya-ew.a.run.app/Score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, uid, reponse, pseudo, valeur, compteur, timer })
      });
      if (reponseAPI.ok) {
        update(ref(db, `${valeur}/reponses/${pseudo}`), {
          [compteur]: reponse,
        });
        if (compteur < nombreQuestions) {
          navigation.navigate('AttenteReponse');
          return;
        } else {
          navigation.navigate('Retour', { valeur, pseudo });
          return;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération de contenu:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timer}s</Text>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.reponseContainer}>
        <TouchableOpacity style={[styles.button, styles.color1]} onPress={() => Validation(tableauFinal[0])}>
          <Text style={styles.texte}>{tableauFinal[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.color2]} onPress={() => Validation(tableauFinal[1])}>
          <Text style={styles.texte}>{tableauFinal[1]}</Text>
        </TouchableOpacity>
        {nombreReponses === 3 ? (
          <TouchableOpacity style={[styles.button, styles.color3]} onPress={() => Validation(tableauFinal[2])}>
            <Text style={styles.texte}>{tableauFinal[2]}</Text>
          </TouchableOpacity>
        ) : nombreReponses === 4 ? (
          <>
            <TouchableOpacity style={[styles.button, styles.color3]} onPress={() => Validation(tableauFinal[2])}>
              <Text style={styles.texte}>{tableauFinal[2]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.color4]} onPress={() => Validation(tableauFinal[3])}>
              <Text style={styles.texte}>{tableauFinal[3]}</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
      <Text style={styles.nombreDeQuestion}>{`${compteur}/${nombreQuestions}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('5%') : hp('12%'),
  },
  nombreDeQuestion: {
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('8%'),
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('8%'),
  },
  question: {
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('8%'),
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('8%'),
  },
  reponseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('8%'),
  },
  button: {
    width: '48%',
    margin: '1%',
    paddingVertical: hp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  texte: {
    color: '#FFFFFF',
    fontSize: wp('2%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timer: {
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('4%') : wp('10%'),
    fontWeight: 'bold',
    color: '#333',
  },
  color1: { backgroundColor: '#FF4500' },
  color2: { backgroundColor: '#32CD32' },
  color3: { backgroundColor: '#1E90FF' },
  color4: { backgroundColor: '#FFA500' },
});

export default Question;
