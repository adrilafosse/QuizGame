import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { get, ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';

interface RouteParams {
  valeur: string;
  pseudo: string;
  compteur2: number;
  frequence: number;
}

const AttenteReponse: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo, compteur2, frequence } = route.params as RouteParams;
  const [timer, setTimer] = useState(0);
  const[compteur,setcompteur] = useState(0);
  const [bonneReponse,setBonneReponse] = useState('');
  const [question,setQuestion] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Masque la flèche de retour
    });
  }, [navigation]);

  useEffect(() => {
    console.log(compteur2)
    setcompteur(compteur2);
  }, [compteur2]);

  useEffect(() => {
    get(ref(db, `${valeur}/question_reponse/question_reponse_${compteur}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setQuestion(data.question);
        setBonneReponse(data.reponse1);
      }
    })
    get(ref(db, `${valeur}/compteur`)).then((snapshot) => {
      if (snapshot.exists() && snapshot.val() === compteur2) {
        navigation.navigate('Question', { valeur, pseudo, compteur, frequence });
      }
    });
    if(timer<(frequence/2)){
      const intervalId = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
    else{
      update(ref(db, `${valeur}`), {
        compteur: compteur2,
      });
      navigation.navigate('Question', { valeur, pseudo, compteur, frequence });
    }
  })
  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timer}s</Text>
      {timer <= 10 ? (
        <>
          <Text style={styles.titre}>Votre réponse a bien été envoyée</Text>
        </>
        ):(
        <>
          <Text style={styles.sous_titre}>{question}</Text>
          <Text style={styles.reponse}>La bonne réponse était : {bonneReponse}</Text>
         </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
  },
  sous_titre: {
    color: '#757575',
    textAlign: 'center',
    fontSize: wp('5%'),
    paddingTop: hp('4%'),
    textDecorationLine: 'underline',
  },
  reponse: {
    color: '#757575',
    textAlign: 'center',
    fontSize: wp('5%'),
    paddingTop: hp('4%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: wp('8%'),
    paddingTop: hp('5%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  timer: {
    position: 'absolute',
    top: hp('3%'),
    right: wp('5%'),
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AttenteReponse;


