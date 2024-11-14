import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { get, ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
  uniqueId: string;
}

const NouvellePartie: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { uniqueId } = route.params as RouteParams;
  const [nombrePages, setcompteur] = useState(1);
  const [frequence, setfrequence] = useState(1);
  const idAdmin = uuidv4().substring(0, 8);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Masque la flèche de retour
    });
  }, [navigation]);

  function Compteur (compteur){
    if(compteur < 1){
      compteur = 1;
    }
    else if(compteur >20){
      compteur = 20
    }
    setcompteur(compteur)
  }
  function Frequence (frequence){
    if(frequence < 1){
      frequence = 1
    }
    else if(frequence == 11){
      frequence = 10;
    }
    else if(frequence > 180){
      frequence = 180;
    }
    setfrequence(frequence)
  }
  
  async function Firebase(){
    
    update(ref(db, uniqueId),{
      nombrePages : nombrePages,
      frequence : frequence,
      idAdmin : idAdmin,
  })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Combien de questions vous voulez poser ?</Text>
      <View style={styles.container2}>
        <TouchableOpacity style={styles.bouton1} onPress={() => Compteur(nombrePages + 1)}>
          <Text style={styles.boutonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.chiffre}>{nombrePages}</Text>
        <TouchableOpacity style={styles.bouton2} onPress={() => Compteur(nombrePages - 1)}>
          <Text style={styles.boutonText}>-</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.titre}>A quelle fréquence /min ?</Text>
      <View style={styles.container2}>
        <TouchableOpacity style={styles.bouton1} onPress={() => Frequence(frequence + 10)}>
          <Text style={styles.boutonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.chiffre}>{frequence}</Text>
        <TouchableOpacity style={styles.bouton2} onPress={() => Frequence(frequence - 10)}>
          <Text style={styles.boutonText}>-</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.bouton3} onPress={() => {navigation.navigate('Questions réponses', { uniqueId,nombrePages,idAdmin }); Firebase()}}>
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
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('7%'),
    paddingTop: Platform.OS === 'web' ? hp('5%') : hp('7%'),
  },
  bouton1: {
    backgroundColor: '#72825e',
    paddingVertical: Platform.OS === 'web' ? hp('1%') : hp('3%'), 
    paddingHorizontal: Platform.OS === 'web' ? wp('2%') : wp('10%'),
    borderRadius: 20,
    marginTop: Platform.OS === 'web' ? hp('2%') : hp('5%'),
  },
  bouton2: {
    backgroundColor: '#72825e',
    paddingVertical: Platform.OS === 'web' ? hp('1%') : hp('3%'), 
    paddingHorizontal: Platform.OS === 'web' ? wp('2.5%') : wp('10%'),
    borderRadius: 20,
    marginTop: Platform.OS === 'web' ? hp('2%') : hp('5%'),
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? wp('4%') : wp('6%'),
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
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('10%'),
    paddingTop: Platform.OS === 'web' ? wp('0%') : wp('10%'),
    marginLeft: Platform.OS === 'web' ? wp('3%') : wp('10%'),
    marginRight:Platform.OS === 'web' ? wp('3%') : wp('10%'),
    color: '#757575',
  },
  bouton3: {
    backgroundColor: '#4CAF50',
    paddingVertical: Platform.OS === 'web' ? hp('2%') : hp('3%'), 
    paddingHorizontal: Platform.OS === 'web' ? wp('15%') : wp('20%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' ? hp('10%') : hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default NouvellePartie;
