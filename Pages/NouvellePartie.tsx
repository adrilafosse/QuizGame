import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
  uniqueId: string;
  dateFormate: Date;
}

const NouvellePartie: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { uniqueId, dateFormate } = route.params as RouteParams;
  const [nombrePages, setcompteur] = useState(1);
  const [durer, setDurer] = useState(10);
  

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);

  function Compteur (compteur){
    if(compteur < 1){
      compteur = 1;
    }
    else if(compteur >20){
      compteur = 20
    }
    setcompteur(compteur)
  }
  function Temps (frequence){
    if(frequence < 10){
      frequence = 10
    }
    else if(frequence > 180){
      frequence = 180;
    }
    setDurer(frequence)
  }
  
  async function Firebase(){

    update(ref(db, uniqueId),{
      nombrePages : nombrePages,
      durer : durer,
    })

    let tableau: Date[] = [];
    let ecart = durer / nombrePages;
    //il faut 10 minutes entre chaque question minimum
    if (ecart >= 10) {
      ecart = 10;
      for (let i = 0; i < nombrePages+1; i++) {
        const nouvelleDateWithRandomMinutes = new Date(dateFormate);
        //On ajoute des minutes durer * un nombre entre 0 et 1[ et on prend la partie entiere
        nouvelleDateWithRandomMinutes.setMinutes(nouvelleDateWithRandomMinutes.getMinutes() + Math.floor(Math.random() * durer)); 
        let dateValide = true;
        for (let j = 0; j < tableau.length; j++) {
          //on parcourt le tableau si la nouvelle date n'a pas 5 minutes alors on ne la sauvegarde pas
          const diff = Math.abs(nouvelleDateWithRandomMinutes.getTime() - tableau[j].getTime()); // Comparer en ms
          console.log("tableau : "+tableau)
          if (diff < 300000) {
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
      navigation.navigate('Questions réponses', { uniqueId,nombrePages })
    }else{
      alert("Il doit y avoir au moins 10 minutes entre chaque question");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Combien de temps la partie va durer /min  ?</Text>
      <View style={styles.container2}>
        <TouchableOpacity style={styles.bouton1} onPress={() => Temps(durer + 10)}>
          <Text style={styles.boutonText1}>+</Text>
        </TouchableOpacity>
        <Text style={styles.chiffre}>{durer}</Text>
        <TouchableOpacity style={styles.bouton2} onPress={() => Temps(durer - 10)}>
          <Text style={styles.boutonText1}>-</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.titre}>Combien de questions vous voulez poser ?</Text>
      <View style={styles.container2}>
        <TouchableOpacity style={styles.bouton1} onPress={() => Compteur(nombrePages + 1)}>
          <Text style={styles.boutonText1}>+</Text>
        </TouchableOpacity>
        <Text style={styles.chiffre}>{nombrePages}</Text>
        <TouchableOpacity style={styles.bouton2} onPress={() => Compteur(nombrePages - 1)}>
          <Text style={styles.boutonText1}>-</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.bouton3} onPress={Firebase}>
          <Text style={styles.boutonText2}>Valider</Text>
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
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('7%'),
    paddingTop: Platform.OS === 'web' ? hp('2%') :  hp('6%'),
    paddingHorizontal: wp('3%')
  },
  bouton1: {
    backgroundColor: '#72825e',
    paddingVertical: Platform.OS === 'web' ? hp('1%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' ? wp('2.5%') : wp('10%'), 
    marginLeft: wp('2%'),
    marginRight: wp('10%'),
    borderRadius: 20,
    marginTop: Platform.OS === 'web' ? hp('2%') : hp('5%'),
  },
  bouton2: {
    backgroundColor: '#72825e',
    paddingVertical: Platform.OS === 'web' ? hp('1%') : hp('3%'), 
    paddingHorizontal: Platform.OS === 'web' ? wp('2.5%') : wp('10%'),
    marginRight: wp('2%'),
    marginLeft: wp('10%'),
    borderRadius: 20,
    marginTop: Platform.OS === 'web' ? hp('2%') : hp('5%'),
  },
  boutonText1: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? wp('4%') : wp('8%'),
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
  selectedDate: {
    fontSize: 16,
    marginBottom: 10,
  },
  boutonText2: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? wp('4%') : wp('6%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:5,
  },
});
export default NouvellePartie;
