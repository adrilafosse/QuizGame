import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';

const NomPartie: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [uniqueId, setUniqueId] = useState('');

    const Validation = () => {
        if (uniqueId) {
            get(ref(db)).then((snapshot) => {
                if (snapshot.exists() && snapshot.child(uniqueId).exists()){
                    alert('Ce nom de partie existe déjà');
                }
                else {
                    set(ref(db, uniqueId), true)
                    navigation.navigate('Nouvelle partie', { uniqueId });
                }
            });
        }
    }
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: () => null, // Masque la flèche de retour
        });
      }, [navigation]);

    return (
        <View style={styles.container}>
          <Text style={styles.titre}>Créez votre partie</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le nom de la partie"
            placeholderTextColor="#757575"
            value={uniqueId}
            onChangeText={(text) => setUniqueId(text)}
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

export default NomPartie;
