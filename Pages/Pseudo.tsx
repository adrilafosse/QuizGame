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
  const [switchEtat, setSwitchEtat] = useState(false);
  const SwitchFct = () => setSwitchEtat((previousState) => !previousState);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Masque la flèche de retour
    });
  }, [navigation]);

  const Validation = () => {
    if (pseudo) {
      get(ref(db, `${valeur}/lancement`)).then((snapshot) => {
        if (snapshot.exists()) {
            alert('La partie a déjà commencé');
            navigation.navigate('PageAccueil');
            return;
        }
      });
      get(ref(db, `${valeur}/pseudo`)).then((snapshot) => {
        if (snapshot.exists() && snapshot.child(pseudo).exists()) {
            alert('Ce pseudo est déjà utilisé');
        }
        else {
          update(ref(db, `${valeur}/pseudo`), {
              [pseudo]: pseudo,
          });
          if(switchEtat){
            navigation.navigate('CodeAdmin', { valeur, pseudo });
          }
          else{
            navigation.navigate('En attente', { valeur, pseudo });
          }
        }
      });
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
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Êtes-vous admin ?</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={switchEtat ? '#4CAF50' : '#f4f3f4'}
          onValueChange={SwitchFct}
          value={switchEtat}
        />
      </View>
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
  sous_titre: {
    color: '#757575',
    textAlign: 'center',
    fontSize: wp('5%'),
    paddingTop: hp('2%'),
    textDecorationLine: 'underline',
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  switchText: {
    fontSize: wp('2%'),
    color: '#757575',
    marginRight: wp('3%'),
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
