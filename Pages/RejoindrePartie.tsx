import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebaseConfig';
import { Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');

const RejoindrePartie: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [valeur, setvaleur] = useState('');

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => null,
        headerShown: false, // Masque la flèche de retour
      });
    }, []);

    const Validation = async () => {
        if (valeur) {
            get(ref(db, valeur)).then(async (snapshot) => {
                if (snapshot.exists()) {
                    get(ref(db, `${valeur}/date`)).then((snapshot) => {
                        if (snapshot.exists()) {
                            const date = snapshot.val()
                            const datePartie = new Date(date)
                            const dateActuelle = new Date();
                            if(dateActuelle<datePartie){
                                navigation.navigate('Pseudo', { valeur });
                            }
                            else{
                              alert('La partie a déjà commencée');
                            }
                        }
                    });
                
                } else {
                    alert('Le code de partie n\'est pas correct');
                }
            });
        }else{
            alert('Veuillez rentrer un nom de partie');
        }
    } 

    return (
        <View style={styles.container}>
          <Text style={styles.titre}>Rejoindre une partie</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrer le nom de la partie"
            placeholderTextColor="#757575"
            value={valeur}
            onChangeText={(text) => setvaleur(text)}
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
      paddingTop: Platform.OS === 'web' && width >= 768 ? hp('20%') :  hp('28%'),
    },
    titre: {
      color: '#333333',
      fontWeight: 'bold',
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('7%') : wp('8%'),
      textAlign: 'center',
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
      fontSize: wp('4%'),
      fontWeight: 'bold',
    },
});

export default RejoindrePartie;
