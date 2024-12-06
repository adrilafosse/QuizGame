import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { Platform } from 'react-native';

interface RouteParams {
  uniqueId: string;
  nombrePages: number;
  durer: number;
}

const DateHeure: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { uniqueId, nombrePages, durer } = route.params as RouteParams;
  const [dateInput, setDateInput] = useState('');

  const formatDateToString = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);
  
  const CommencementMin = (minute) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minute)
    const formattedDate = formatDateToString(date);
    Validation(formattedDate)
  }

  const Validation = (date) => {
    if (date) {
      const regex = /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d\s([01][0-9]|2[0-3]):([0-5][0-9])$/;
      const verification = regex.test(date);
      
      if (verification) {
        // Extraction des parties de la date
        const [day, month, year, hours, minutes] = date.match(/\d+/g) || [];
        const dateFormate = new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
        const currentDate = new Date();
        //date de la partie doit être 2 minutes après la date actuelle donc les joeur ont 2 min pour s'inscire a la partie
        currentDate.setMinutes(currentDate.getMinutes() + 1)
        if(currentDate < dateFormate){
          let tableau: Date[] = [];
          for (let i = 0; i < nombrePages+1; i++) {
            const nouvelleDateWithRandomMinutes = new Date(dateFormate);
            //On ajoute des minutes durer * un nombre entre 0 et 1[ et on prend la partie entiere
            nouvelleDateWithRandomMinutes.setMinutes(nouvelleDateWithRandomMinutes.getMinutes() + Math.floor(Math.random() * durer)); 
            let dateValide = true;
            for (let j = 0; j < tableau.length; j++) {
            //on parcourt le tableau si la nouvelle date n'a pas 2 minutes alors on ne la sauvegarde pas
              const diff = Math.abs(nouvelleDateWithRandomMinutes.getTime() - tableau[j].getTime()); // Comparer en ms
              if (diff < 120000) {
                dateValide = false;
                break;
              }
            }
            if (dateValide) {
              tableau.push(nouvelleDateWithRandomMinutes);
            } else {
              i--;
            }
          }
          tableau.sort((a, b) => a.getTime() - b.getTime());
          for(let k=1;k<tableau.length;k++){
            const dateUTC = tableau[k].toISOString();
            update(ref(db,`${uniqueId}/question-temps`),{
              [k] : dateUTC,
            })
            update(ref(db, uniqueId), {
              date: dateFormate,
            });
          }
          navigation.navigate('Terminer', { uniqueId, date });
        }else{
          alert("La date doit être supérieur de 2 minutes à la date actuelle");
        }
      } else {
        alert("Le format de la date n'est pas correct. Utilisez jj/mm/aaaa hh:mm.");
      }
    }else{
      alert("Vous devez rentrer une date");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Définir le démarrage de la partie</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrer la date et l'heure (jj/mm/aaaa hh:mm)"
        placeholderTextColor="#757575"
        value={dateInput}
        onChangeText={(text) => setDateInput(text)}
      />
      <TouchableOpacity style={styles.bouton2} onPress={() => Validation(dateInput)}>
        <Text style={styles.boutonText}>Créer</Text>
      </TouchableOpacity>
      <Text style={styles.ou}>--------------  ou  --------------</Text>
      <Text style={styles.sous_titre}>Démarrer la partie dans :</Text>
      <View style={styles.container2}>
        <TouchableOpacity style={styles.bouton} onPress={() => CommencementMin(2)}>
          <Text style={styles.boutonText2}>2 minutes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouton} onPress={() => CommencementMin(5)}>
          <Text style={styles.boutonText2}>5 minutes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouton} onPress={() => CommencementMin(10)}>
          <Text style={styles.boutonText2}>10 minutes</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.paragraphe}>Chaque joueur doit s'inscrire avant le démarrage de la partie</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? hp('5%') :  hp('13%'),
  },
  paragraphe: {
    color: '#757575',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('5%'),
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('16%'),
    fontStyle: 'italic',
  },
  bouton2: {
    backgroundColor: '#757575',
    paddingVertical: hp('2%'),
    paddingHorizontal: Platform.OS === 'web' ? wp('5%') : wp('20%'),
    borderRadius: 8,
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sous_titre: {
    color: '#757575',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('5%'),
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('14%'),
    textDecorationLine: 'underline',
  },
  ou:{
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('12%'),
    color: '#757575',
    fontSize: Platform.OS === 'web' ? wp('2%') : wp('4%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('5%') : wp('8%'),
    textAlign: 'center',
    marginHorizontal: wp('5%')
  },
  input: {
    height: hp('8%'),
    width: wp('80%'),
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: hp('6%'),
    textAlign: 'center',
    color: '#333333',
    fontSize: Platform.OS === 'web' ? wp('2%') : wp('4%'),
  },
  bouton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'web' ? wp('2%') : wp('12%'),
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? wp('2%') : wp('4%'),
    fontWeight: 'bold',
  },
  boutonText2: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? wp('2%') : wp('3%'),
    fontWeight: 'bold',
  },
});

export default DateHeure;
function formatDateToString(date: Date) {
  throw new Error('Function not implemented.');
}

