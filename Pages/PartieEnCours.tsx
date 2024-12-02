import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
interface RouteParams {
  valeur: string;
}

const PartieEnCours: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [pseudo, setPseudo] = useState('');
  const route = useRoute();
  const { valeur } = route.params as RouteParams;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);
  
    const Validation = () => {
        if (pseudo) {
            get(ref(db, `${valeur}/pseudo`)).then((snapshot) => {
                if (snapshot.exists() && snapshot.child(pseudo).exists()) {
                    navigation.navigate('Score', { valeur, pseudo });
                }
                else {  
                    alert('Le pseudo n\'existe pas');
                }
            });
        }
        else{
            alert('Veuillez rentrer un pseudo');
        }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>La partie a déjà commencer, veuillez rentrer votre pseudo</Text>
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
    paddingTop: hp('28%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: wp('10%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  input: {
    height: hp('8%'),
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

export default PartieEnCours;
