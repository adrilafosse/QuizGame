import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { get, ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

interface RouteParams {
    valeur : string;
    pseudo : string;
  }
const Admin: React.FC<{ navigation: any }> = ({ navigation }) => {
    const route = useRoute(); 
    const { valeur,pseudo } = route.params as RouteParams;
    const [lancement, setLancement] = useState(1);
    const [compteur, setCompteur] = useState(1);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => null, // Masque la flèche de retour
      });
    }, [navigation]);

    const Lancement  = () => {
        update(ref(db, valeur),{
            lancement : 1,
        })
    }

    const LancementPartie = () => {
        get(ref(db, `${valeur}/lancement`)).then((snapshot) => {
          if (snapshot.exists() && snapshot.val() === lancement) {
            navigation.navigate('Question', { valeur, pseudo, compteur });
          }
        });
      }
    useEffect(() => {
        const intervalId = setInterval(LancementPartie, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.titre}>Lancer la partie</Text>
        <TouchableOpacity style={styles.bouton} onPress={Lancement}>
        <Text style={styles.boutonText}>Lancer !</Text>
      </TouchableOpacity>
      </View>
    )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: wp('8%'),
    paddingTop: hp('5%'),
    textAlign: 'center',
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: 'bold',
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
});
export default Admin;