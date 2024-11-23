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
}

const EnAttente: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo } = route.params as RouteParams;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, [navigation]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, // Afficher une alerte pour les notifications en foreground
      shouldPlaySound: true, // Activer le son pour les notifications en foreground
      shouldSetBadge: true,  // Mettre à jour le badge pour les notifications en foreground
    }),
  });
  
  const scheduleNotification = async (title: string, body: string, date: Date, data: any) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
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
    get(ref(db, `${valeur}/question-temps`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tableau = Object.values(data)as string[];; // creation tableau        
        for (let i = 0; i < tableau.length; i++) {
          const date = new Date(tableau[i]);
          const compteur = i+1;
          scheduleNotification(
            `Question ${compteur}`,
            `C'est l'heure pour la question ${compteur}!`,
            date,
            { valeur, pseudo,compteur,date }
          );
        }
        
      }
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Votre profil a été crée vous allez recevoir une notification quand une question apparaitra</Text>
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
    fontSize: wp('4%'),
    paddingTop: hp('2%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
});

export default EnAttente;


