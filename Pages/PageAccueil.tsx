import React, {useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Platform, Dimensions } from 'react-native';


const {width} = Dimensions.get('window');

const Page_Accueil: React.FC<{ navigation: any }> = ({ navigation }) => {
  
  useEffect(() => {
    const notification = Notifications.addNotificationResponseReceivedListener(response => {
      const { valeur, pseudo, compteur, date2 } = response.notification.request.content.data;
      if (valeur && pseudo && compteur && date2) {
        navigation.navigate('Question', { valeur, pseudo, compteur,date2 });
      } else {
        console.log("Les données de la notification sont manquantes");
      }
    });
    return () => notification.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>QuizGame</Text>
      <Text style={styles.paragraphe}>Créer votre propre quiz en toute liberté pour animer vos soirées entre amis ou en famille.</Text>
      <Text style={styles.sous_titre}>Top départ !</Text>
      <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate('NomPartie')}>
        <Text style={styles.boutonText}>Créer une partie</Text>
      </TouchableOpacity>
          <Text style={styles.ou}>----------   ou   ----------</Text>
          <TouchableOpacity style={styles.bouton2} onPress={() => navigation.navigate('RejoindrePartie')}>
            <Text style={styles.boutonText}>Rejoindre une partie</Text>
          </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('1%') :  hp('8%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('8%') : wp('16%'),
  },
  ou:{
    paddingTop: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('8%'),
    color: '#757575',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('4%'),
  },
  sous_titre: {
    color: '#333333',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('6%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('4%'),
    fontWeight: 'bold',
  },
  paragraphe: {
    color: '#757575',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('6%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('16%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('4%') : wp('2%'),
    fontStyle: 'italic',
  },
  bouton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' && width >= 768 ? wp('4%') : wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bouton2: {
    backgroundColor: '#757575',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('15%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize:  Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('5%'),
    fontWeight: 'bold',
  },
});

export default Page_Accueil;
