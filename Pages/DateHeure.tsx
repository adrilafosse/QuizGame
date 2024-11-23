import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
  uniqueId: string;
}

const DateHeure: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { uniqueId } = route.params as RouteParams;
  const [date, setDate] = useState('');

  const Validation = () => {
    if (date) {
      const regex = /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d\s([01][0-9]|2[0-3]):([0-5][0-9])$/;
      const verification = regex.test(date);
      
      if (verification) {
        // Extraction des parties de la date
        const [day, month, year, hours, minutes] = date.match(/\d+/g) || [];
        const dateFormate = new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
        const currentDate = new Date();
        //date de la partie doit être 15 minutes après la date actuelle donc l'utilisateur à 15 min pour creer ses questions
        currentDate.setMinutes(currentDate.getMinutes() + 15)
        if(currentDate < dateFormate){
          update(ref(db, uniqueId), {
            date: dateFormate,
          });
          navigation.navigate('Nouvelle partie', { uniqueId, dateFormate });
        }else{
          alert("La date doit être supérieur de 15 minutes à la date actuelle");
        }
      } else {
        alert("Le format de la date n'est pas correct. Utilisez jj/mm/aaaa hh:mm.");
      }
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Quand est ce que la partie va commencer ?</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez la date (jj/mm/aaaa hh:mm)"
        placeholderTextColor="#757575"
        value={date}
        onChangeText={(text) => setDate(text)}
      />
      <TouchableOpacity style={styles.bouton} onPress={Validation}>
        <Text style={styles.boutonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('5%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: wp('8%'),
    paddingTop: hp('1%'),
    textAlign: 'center',
  },
  input: {
    height: hp('8%'),
    width: '80%',
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('4%'),
    marginTop: hp('3%'),
    color: '#333333',
  },
  bouton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('15%'),
    borderRadius: 8,
    marginTop: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});

export default DateHeure;
