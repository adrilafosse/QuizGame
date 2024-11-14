import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { get, ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useFocusEffect, useRoute } from '@react-navigation/native';

interface RouteParams {
  valeur: string;
  pseudo: string;
  compteur: number;
}

const Question: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo, compteur } = route.params as RouteParams;
  const [nombreQuestions, setNombreQuestions] = useState(0);
  const [nombreReponses, setNombreReponses] = useState(0);
  const [question, setQuestion] = useState('');
  const [reponse1, setReponse1] = useState('');
  const [reponse2, setReponse2] = useState('');
  const [reponse3, setReponse3] = useState('');
  const [reponse4, setReponse4] = useState('');
  const [compteur2, setCompteur2] = useState(compteur + 1);
  const [timer, setTimer] = useState(60);
  const [frequence, setFrequence] = useState(0);
  let tableau;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Masque la flèche de retour
    });
  }, [navigation]);

  //reinitialisation des champs
  useFocusEffect(
    React.useCallback(() => {
      setTimer(60);
      setQuestion('');
      setReponse1('');
      setReponse2('');
      setReponse3('');
      setReponse4('');
      setCompteur2(compteur + 1);
    }, [compteur])
  );

  useEffect(() => {
    if (timer > 0) {
      // Utilisation de setInterval pour décrémenter le timer toutes les secondes
      const intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);

      // Nettoyer l'intervalle lors du démontage ou de la mise à jour du timer
      return () => clearInterval(intervalId);
    }
    if (compteur < nombreQuestions && timer == 0) {     
      update(ref(db, `${valeur}/reponses/${pseudo}`), {
        [`reponseQuestion${compteur}`]: '',
      });
      
      update(ref(db, `${valeur}`), {
        lancement: 2,
      });
      navigation.navigate('AttenteReponse', { valeur, pseudo, compteur2, frequence });
    }
    else if(compteur == nombreQuestions && timer == 0){
      update(ref(db, `${valeur}/reponses/${pseudo}`), {
        [`reponseQuestion${compteur}`]: '',
      });
      
      update(ref(db, `${valeur}`), {
        lancement: 2,
      });
      navigation.navigate('Fin', { valeur, pseudo });
    }
  }, [timer]);

  useEffect(() => {
    if (nombreQuestions == 0) {
      get(ref(db, `${valeur}/nombrePages`)).then((snapshot) => {
        if (snapshot.exists()) {
          setNombreQuestions(snapshot.val());
        }
      });
      get(ref(db, `${valeur}/frequence`)).then((snapshot) => {
        if (snapshot.exists()) {
          setFrequence(snapshot.val()*60);
        }
      });
    }

    if (question == '') {
      get(ref(db, `${valeur}/question_reponse/question_reponse_${compteur}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setNombreReponses(data.nombreDeReponses);
          setQuestion(data.question);
          setReponse1(data.reponse1);
          setReponse2(data.reponse2);
          if (data.nombreDeReponses >= 3) setReponse3(data.reponse3);
          if (data.nombreDeReponses === 4) setReponse4(data.reponse4);
          console.log("Nombre de réponses :", data.nombreDeReponses);
        }
      })

    }
    if(nombreReponses == 2){
      tableau = [reponse1,reponse2];
      tableau = tableau.sort(() => Math.random() - 0.5);
      setReponse1(tableau[0]);
      setReponse2(tableau[1]);
    }
    else if(nombreReponses == 3){
      tableau = [reponse1,reponse2,reponse3];
      tableau = tableau.sort(() => Math.random() - 0.5);
      setReponse1(tableau[0]);
      setReponse2(tableau[1]);
      setReponse3(tableau[2]);
    }
    else if(nombreReponses == 4){
      tableau = [reponse1,reponse2,reponse3,reponse4];
      tableau = tableau.sort(() => Math.random() - 0.5);
      setReponse1(tableau[0]);
      setReponse2(tableau[1]);
      setReponse3(tableau[2]);
      setReponse4(tableau[3]);
    }
    
  }, [compteur, question, valeur]);

  const Validation = (reponse: string) => {
    update(ref(db, `${valeur}/reponses/${pseudo}`), {
      [`reponseQuestion${compteur}`]: reponse,
    });
    
    update(ref(db, `${valeur}`), {
      lancement: 2,
    });
    
    if (compteur < nombreQuestions) {
      navigation.navigate('AttenteReponse', { valeur, pseudo, compteur2,frequence });
      return;
    } else {
      navigation.navigate('Fin', { valeur, pseudo });
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timer}s</Text>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.reponseContainer}>
        <TouchableOpacity style={[styles.button, styles.color1]} onPress={() => Validation(reponse1)}>
          <Text style={styles.texte}>{reponse1}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.color2]} onPress={() => Validation(reponse2)}>
          <Text style={styles.texte}>{reponse2}</Text>
        </TouchableOpacity>
        {nombreReponses === 3 ? (
          <TouchableOpacity style={[styles.button, styles.color3]} onPress={() => Validation(reponse3)}>
            <Text style={styles.texte}>{reponse3}</Text>
          </TouchableOpacity>
        ) : nombreReponses === 4 ? (
          <>
            <TouchableOpacity style={[styles.button, styles.color3]} onPress={() => Validation(reponse3)}>
              <Text style={styles.texte}>{reponse3}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.color4]} onPress={() => Validation(reponse4)}>
              <Text style={styles.texte}>{reponse4}</Text>
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
    paddingTop: hp('5%'),
  },
  nombreDeQuestion: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  question: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: '#222222',
    marginVertical: hp('4%'),
    textAlign: 'center',
    paddingHorizontal: wp('4%'),
  },
  reponseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
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
    fontSize: wp('5%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timer: {
    position: 'absolute',
    top: hp('3%'),
    right: wp('5%'),
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#333',
  },
  color1: { backgroundColor: '#FF4500' },
  color2: { backgroundColor: '#32CD32' },
  color3: { backgroundColor: '#1E90FF' },
  color4: { backgroundColor: '#FFA500' },
});

export default Question;
