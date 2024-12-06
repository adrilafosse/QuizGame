import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { get, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


const Page_Accueil: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [valeur, setvaleur] = useState('');
  
  useEffect(() => {
    const notification = Notifications.addNotificationResponseReceivedListener(response => {
      const { valeur, pseudo, compteur, date2 } = response.notification.request.content.data;
      if (valeur && pseudo && compteur && date2) {
        navigation.navigate('Question', { valeur, pseudo, compteur,date2 });
      } else {
        console.log("Les données de la notification sont manquantes");
      }
    });
    //vider l'ecouteur
    return () => notification.remove();
    //aucune dépendance useEffect se déclenchera qu'une seule fois 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>QuizGame</Text>
      <Text style={styles.paragraphe}>Créer votre propre quiz en toute liberté pour animer vos soirées entre amis ou famille.</Text>
      <Text style={styles.sous_titre}>Go!</Text>
      <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate('NomPartie')}>
        <Text style={styles.boutonText}>Créer une partie</Text>
      </TouchableOpacity>
      {Platform.OS !== 'web' ? (
        <>
          <Text style={styles.ou}>----------   ou   ----------</Text>
          <TouchableOpacity style={styles.bouton2} onPress={() => navigation.navigate('RejoindrePartie')}>
            <Text style={styles.boutonText}>Rejoindre une partie</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? hp('10%') :  hp('8%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('10%') : wp('16%'),
  },
  ou:{
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('12%'),
    color: '#757575',
    fontSize: Platform.OS === 'web' ? wp('2%') : wp('4%'),
  },
  sous_titre: {
    color: '#333333',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('6%'),
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('4%'),
    fontWeight: 'bold',
  },
  paragraphe: {
    color: '#757575',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('6%'),
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('16%'),
    fontStyle: 'italic',
  },
  bouton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('20%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' ? wp('8%') : wp('16%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bouton2: {
    backgroundColor: '#757575',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('20%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' ? wp('8%') : wp('12%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});

export default Page_Accueil;
