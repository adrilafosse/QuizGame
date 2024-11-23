import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import { get, ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
interface RouteParams {
  valeur: string;
}

const Pseudo: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [pseudo, setPseudo] = useState('');
  const route = useRoute();
  const { valeur } = route.params as RouteParams;
  const [date,setDate] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, [navigation]);
  
  const Validation = () => {
    if (pseudo) {
      get(ref(db, valeur)).then((snapshot) => {
        if (snapshot.exists()) {
          setDate(snapshot.val())
          const datePartie = new Date(date)
          const dateActuelle = new Date();
          if(dateActuelle<datePartie){
            get(ref(db, `${valeur}/pseudo`)).then((snapshot) => {
              if (snapshot.exists() && snapshot.child(pseudo).exists()) {
                  alert('Ce pseudo est déjà utilisé');
              }
              else {
                update(ref(db,`${valeur}/pseudo`),{
                  [pseudo] : pseudo,
                })      
                navigation.navigate('En attente', { valeur, pseudo });
                }
            });
          }
          else{
            alert('La partie a déjà commencé');
          }
        }
      });
    }
    else{
      alert('Rentrez un pseudo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Créez votre profil</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre pseudo"
        placeholderTextColor="#757575"
        value={pseudo}
        onChangeText={(text) => setPseudo(text)}
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
    paddingTop: hp('5%'),
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

export default Pseudo;
