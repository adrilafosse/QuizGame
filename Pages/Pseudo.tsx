import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { get, ref, update } from 'firebase/database';
import { db, auth } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { Platform, Dimensions } from 'react-native';
import { signInWithCustomToken } from 'firebase/auth';

const { width } = Dimensions.get('window');
interface RouteParams {
  valeur: string;
}

const Pseudo: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [pseudo, setPseudo] = useState('');
  const route = useRoute();
  const { valeur } = route.params as RouteParams;

  const Validation = () => {
    if (pseudo) {
      get(ref(db, `${valeur}/date`)).then((snapshot) => {
        if (snapshot.exists()) {
          const date = snapshot.val()
          const datePartie = new Date(date)
          const dateActuelle = new Date();
          if (dateActuelle < datePartie) {
            get(ref(db, `${valeur}/pseudo`)).then(async (snapshot) => {
              if (snapshot.exists() && snapshot.child(pseudo).exists()) {
                alert('Ce pseudo est déjà utilisé');
              }
              else {
                update(ref(db, `${valeur}/pseudo`), {
                  [pseudo]: pseudo,
                })
                const reponse = await fetch('http://127.0.0.1:8080/CookiePseudo', {
                  //const reponse = await fetch('https://back-mv6pbo6mya-ew.a.run.app/Generer', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ pseudo })
                });

                if (reponse.ok) {
                  const data = await reponse.json();
                  const tokenPersonnnalise = data.token;
                  const uid = data.uid;
                  try {
                    // Authentifier l'utilisateur avec le token personnalisé
                    const userCredential = await signInWithCustomToken(auth, tokenPersonnnalise);
                    // recuperer le token d'authentification
                    const token = await userCredential.user.getIdToken();
                    navigation.navigate('En attente', { valeur, pseudo, datePartie, token, uid });
                  } catch (error) {
                    console.error("Erreur d'authentification :", error);
                  }
                }
              }
            });
          }
          else {
            alert('La partie a déjà commencé');
          }
        }
      });
    }
    else {
      alert('Rentrez un pseudo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Créer votre profil</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre pseudo"
        placeholderTextColor="#757575"
        value={pseudo}
        onChangeText={(text) => setPseudo(text)}
      />
      <TouchableOpacity style={styles.bouton} onPress={Validation}>
        <Text style={styles.boutonText}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('10%') : hp('28%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('6%') : wp('8%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  input: {
    height: hp('8%'),
    width: wp('80%'),
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: hp('4%'),
    color: '#333333',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('4%'),
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
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
});

export default Pseudo;
