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
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { valeur, pseudo, compteur, date } = response.notification.request.content.data;
      if (valeur && pseudo && compteur && date) {
        navigation.navigate('Question', { valeur, pseudo, compteur,date });
      } else {
        console.log("Les données de la notification sont manquantes");
      }
    });
  
    return () => subscription.remove();
  }, [navigation]);
  

  const Validation = async () => {
    if (Platform.OS === 'web') {
      alert('Impossible de rejoindre une partie sur le web');
    }else{
      if (valeur) {
        get(ref(db, valeur)).then(async (snapshot) => {
          if (snapshot.exists()) {
            navigation.navigate('Pseudo', { valeur });
          } else {
            alert('Le code de partie n\'est pas correct');
          }
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>QuizGame</Text>
      <Text style={styles.sous_titre}>Rejoindre une partie</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Entrez le nom de la partie"
        placeholderTextColor="#757575"
        value={valeur}
        onChangeText={(text) => setvaleur(text)}
      />
      <TouchableOpacity style={styles.bouton2} onPress={Validation}>
        <Text style={styles.boutonText}>Valider</Text>
      </TouchableOpacity>
      <Text style={styles.ou}>----------   ou   ----------</Text>
      <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate('NomPartie')}>
        <Text style={styles.boutonText}>Créer une partie</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? hp('3%') :  hp('10%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('7%') : wp('16%'),
    paddingTop: hp('1%'),
  },
  ou:{
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('12%'),
    color: '#757575',
    fontSize: Platform.OS === 'web' ? wp('2%') : wp('4%'),
  },
  sous_titre: {
    color: '#757575',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('8%'),
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('14%'),
    textDecorationLine: 'underline',
  },
  input: {
    height: hp('6%'),
    width: '80%',
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('4%'),
    marginTop: hp('2%'),
    color: '#333333',
    textAlign: 'center',
  },
  bouton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('20%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' ? wp('2%') : wp('12%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bouton2: {
    backgroundColor: '#757575',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('20%'),
    borderRadius: 8,
    marginTop: hp('2%'),
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
