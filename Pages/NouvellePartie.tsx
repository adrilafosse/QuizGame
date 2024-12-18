import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import 'react-native-get-random-values';
import { ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');

interface RouteParams {
  uniqueId: string;
  page2: number;
}

const NouvellePartie: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { uniqueId, page2 } = route.params as RouteParams;
  const [durer, setDurer] = useState(10);
  const [durerMinimum, setDurerMinimum] = useState(10);
  

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);

  useEffect(() => {
    //math.ceil arrondie au superieur un nombre à virgule
    const durerMinimum = Math.ceil((page2 * 3) / 10) * 10;
    setDurerMinimum(durerMinimum)
    setDurer(durerMinimum)  
  }, []);

  function Temps1 (frequence){
   if(frequence >= 180){
      frequence = 180;
    }
    else{
      frequence = frequence + 10;
    }
    setDurer(frequence)
  }

  function Temps2 (frequence){
    if(frequence <= durerMinimum){
      frequence = durerMinimum
    }
    else {
      frequence = frequence - 10;
    }
    setDurer(frequence)
  }
  
  async function Firebase(){
    update(ref(db, uniqueId),{
      durer : durer,
    })
    navigation.navigate('DateHeure', { uniqueId, durer, page2})
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Définir la durée de la partie (de {durerMinimum} à 180 minutes) ?</Text>
      <View style={styles.container2}>
        <TouchableOpacity style={styles.bouton1} onPress={() => Temps1(durer)}>
          <Text style={styles.boutonText1}>+</Text>
        </TouchableOpacity>
        <Text style={styles.chiffre}>{durer}</Text>
        <TouchableOpacity style={styles.bouton2} onPress={() => Temps2(durer)}>
          <Text style={styles.boutonText1}>-</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.bouton3} onPress={Firebase}>
          <Text style={styles.boutonText2}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: hp('10%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('4%') : wp('7%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('4%') :  hp('15%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('6%') :  wp('3%'),
  },
  bouton1: {
    backgroundColor: '#72825e',
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('1%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('2.5%') : wp('10%'), 
    marginLeft: wp('2%'),
    marginRight: Platform.OS === 'web' && width >= 768 ? wp('8%') : wp('10%'),
    borderRadius: 20,
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('5%') : hp('5%'),
  },
  bouton2: {
    backgroundColor: '#72825e',
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('1%') : hp('3%'), 
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('2.5%') : wp('10%'),
    marginRight: wp('2%'),
    marginLeft: wp('10%'),
    borderRadius: 20,
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('5%') : hp('5%'),
  },
  boutonText1: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('4%') : wp('8%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:5,
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  chiffre: {
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('10%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('10%'),
    color: '#757575',
  },
  bouton3: {
    backgroundColor: '#4CAF50',
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('3%'), 
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('15%') : wp('20%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('10%') : hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDate: {
    fontSize: 16,
    marginBottom: 10,
  },
  boutonText2: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('6%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:5,
  },
});
export default NouvellePartie;
