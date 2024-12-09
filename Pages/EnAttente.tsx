import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { ref, get } from "firebase/database";
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

interface RouteParams {
  valeur: string;
  pseudo: string;
  datePartie: Date;
}

const EnAttente: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo, datePartie } = route.params as RouteParams;
  const [tempsRestant, setTempsRestant] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, // Afficher une alerte pour les notifications en foreground
      shouldPlaySound: true, // Activer le son pour les notifications en foreground
      shouldSetBadge: true,  // Mettre à jour le badge pour les notifications en foreground
    }),
  });
  
  const scheduleNotification = async (title: string, body: string, date: Date, data: any) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data
        },
        trigger: date, // Date spécifique pour la notification
      });
    } catch (error) {
      console.error('Erreur lors de la planification de la notification :', error);
    }
  };

  useEffect(() => {
    const dateActuelle = new Date();
    const diff = datePartie.getTime() - dateActuelle.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setTempsRestant(
      `${days > 0 ? `${days} jour${days > 1 ? 's' : ''}, ` : ''}${
        hours > 0 ? `${hours} heure${hours > 1 ? 's' : ''}, ` : ''
      }${minutes} minute${minutes > 1 ? 's' : ''}`
    );
  }, [datePartie]);

  useEffect(() => {
    get(ref(db, `${valeur}/question-temps`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tableau = Object.values(data)as string[]; // creation tableau
        console.log("tableau :",tableau)        
        for (let i = 0; i < tableau.length; i++) {
          const date = new Date(tableau[i]);
          const date2 = date.toString();
          const compteur = i+1;
          scheduleNotification(
            `Question ${compteur}`,
            `C'est l'heure pour la question ${compteur}!`,
            date,
            { valeur,date2, pseudo,compteur }
          );
        }    
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Félicitation, vous êtes inscrit ! La partie commencera dans {tempsRestant}</Text>
      <Text style={styles.titre}>Une notification s'affichera sur votre téléphone pour chaque question. Vous disposerez de 2 minutes maximum pour y répondre</Text>
      <Text style={styles.titre}>Chaque bonne réponse vaut 100 points ou plus en fonction de votre rapidité</Text>
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
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: wp('5%'),
    paddingTop: hp('6%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
});

export default EnAttente;


