import React, { useState , useEffect } from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
    uniqueId: string;
    date: any;
}

const Terminer: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute(); 
  const { uniqueId, date } = route.params as RouteParams;
  console.log("date :",date);
  const [tempsRestant, setTempsRestant] = useState('');
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const [day, month, year, hour, minute] = date.split(/[\s/:]/);
    const dateFormater = `${year}-${month}-${day}T${hour}:${minute}:00`;
    const dateFinal = new Date(dateFormater);
    const dateActuelle = new Date();
    const diff = dateFinal.getTime() - dateActuelle.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setTempsRestant(
      `${days > 0 ? `${days} jour${days > 1 ? 's' : ''}, ` : ''}${
        hours > 0 ? `${hours} heure${hours > 1 ? 's' : ''}, ` : ''
      }${minutes} minute${minutes > 1 ? 's' : ''}`
    );
  }, [date]);
  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Pour rappel :</Text>
      <Text style={styles.sous_titre}>Pour rejoindre la partie, entrer le nom suivant : {uniqueId}</Text>
      <Text style={styles.sous_titre}>La partie débutera dans {tempsRestant}</Text>         
      <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate('Accueil')}>
        <Text style={styles.boutonText}>Accueil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? hp('15%') :  hp('25%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('5%') : wp('12%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'), 
  },
  sous_titre: {
    color: '#757575',
    fontSize: wp('6%'),
    paddingTop: hp('8%'),
    textAlign: 'center', 
  },
  bouton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('15%'),
    borderRadius: 8,
    marginTop: hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});

export default Terminer;
