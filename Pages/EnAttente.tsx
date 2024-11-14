import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { onValue, ref } from "firebase/database";
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
  valeur: string;
  pseudo: string;
}

const EnAttente: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo } = route.params as RouteParams;
  const [lancementChamp, setLancementChamp] = useState(1);
  const [compteur, setCompteur] = useState(1);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Masque la flèche de retour
    });
  }, [navigation]);

  useEffect(() => {
    const lancementRef = ref(db, `${valeur}/lancement`);
    onValue(lancementRef, (snapshot) => {
      if (snapshot.exists() && snapshot.val() === lancementChamp) {
        navigation.navigate('Question', { valeur, pseudo, compteur });
      }
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Attendez le lancement de la partie</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: wp('8%'),
    paddingTop: hp('5%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
});

export default EnAttente;


