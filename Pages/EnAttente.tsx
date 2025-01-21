import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { ref, get } from "firebase/database";
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Platform, Dimensions, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const {width} = Dimensions.get('window');

interface RouteParams {
  valeur: string;
  pseudo: string;
  datePartie: Date;
}

const EnAttente: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo, datePartie } = route.params as RouteParams;
  const [tempsRestant, setTempsRestant] = useState('');
  const [QRcodeVariable, setQRcodeVariable] = useState(false);
  const dateActuelle = new Date();
  const uniqueId = valeur;
  const date = datePartie;
  const qrcode = `https://quizgame-mv6pbo6mya-ew.a.run.app?id=${uniqueId}&date=${date}`;

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
      console.log("notification:",date)
    } catch (error) {
      console.error('Erreur lors de la planification de la notification :', error);
    }
  };
  
  useEffect(() => {
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
        for (let i = 0; i < tableau.length; i++) {
          const date = new Date(tableau[i]);
          const date2 = date.toString();
          const compteur = i+1;
          if (Platform.OS === 'web') {
            const intervalId = setInterval(() => {
              const nouvelleDateActuelle = new Date();
              const diff = date.getTime() - nouvelleDateActuelle.getTime(); 
              if (diff <= 0) {
                clearInterval(intervalId); // Arrêter l'intervalle
                navigation.navigate('Question', { valeur, pseudo, compteur, date2 }); 
              }
            }, 1000);
          }
          if (Platform.OS !== 'web') {
            scheduleNotification(
              `Question ${compteur}`,
              `C'est l'heure pour la question ${compteur}!`,
              date,
              { valeur,date2, pseudo,compteur }
            );
          }
        }    
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      { QRcodeVariable === false ? (
      <>
        <Text style={styles.titre2}>Félicitations, vous êtes inscrit !</Text>
        { tempsRestant !== '0 minute' ? (
          <Text style={styles.titre}>La partie commencera dans {tempsRestant}.</Text>
          ):
          <Text style={styles.titre}>La partie débutera dans moins d'une minute</Text>
        }
        { Platform.OS !== 'web' ? (
          <Text style={styles.titre}>Une notification s'affichera sur votre téléphone pour chaque question. Vous disposerez de 2 minutes maximum pour y répondre.</Text>
          ) : 
          <Text style={styles.titre}>La question s'affichera automatiquement, et vous disposerez d'un maximum de 2 minutes pour y répondre.</Text>
        }
        <Text style={styles.titre}>Chaque bonne réponse vaut 100 points ou plus en fonction de votre rapidité.</Text>
        <TouchableOpacity style={styles.bouton2} onPress={() => setQRcodeVariable(true)}>
          <Text style={styles.boutonText}>Afficher le QRcode de la partie</Text>
        </TouchableOpacity>
      </>
      ) : 
      <>
        <Text style={styles.titre}>Pour qu'un nouveau joueur rejoigne la partie, il peut scanner ce QRcode :</Text>
        <View style={styles.qrContainer}>
          <QRCode value={qrcode} size={Platform.OS === 'web' && width >= 768 ? wp('20%') :  hp('40%')} />
        </View>
        <TouchableOpacity style={styles.bouton2} onPress={() => setQRcodeVariable(false)}>
          <Text style={styles.boutonText}>Retour</Text>
        </TouchableOpacity>
      </>
      }
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
  qrContainer: {
    marginVertical: Platform.OS === 'web' && width >= 768 ? hp('1%') :  hp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bouton2: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize:  Platform.OS === 'web' && width >= 768 ? wp('1.5%') : wp('5%'),
    fontWeight: 'bold',
  },
  titre: {
    color: '#333333',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') :  wp('4%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('2%') :  hp('6%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  titre2: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('4%') :  wp('6%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('2%') :  hp('6%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
});

export default EnAttente;


