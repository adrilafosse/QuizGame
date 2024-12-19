import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebaseConfig';
import { Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');


const NomPartie: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [uniqueId, setUniqueId] = useState('');
    const [tiroir, setTiroir] = useState(false);
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => null,
        headerShown: false, // Masque la flèche de retour
      });
    }, []);

    const toggleSwitch = () => setTiroir((previousState) => !previousState);

    const Validation = () => {
        if (uniqueId) {
            get(ref(db)).then((snapshot) => {
                if (snapshot.exists() && snapshot.child(uniqueId).exists()){
                    alert('Ce nom de partie existe déjà');
                }
                else {
                  if(tiroir){
                    navigation.navigate('Questions réponsesIA', { uniqueId });
                  }else{
                    navigation.navigate('Questions réponses', { uniqueId });
                  }
                }
            });
        }else{
          alert('Vous devez rentrer un nom de partie');
        }
    }

    return (
        <View style={styles.container}>
          <Text style={styles.titre}>Créer votre partie</Text>
          <TextInput
            style={styles.input}
            placeholder="Creer le nom de la partie"
            placeholderTextColor="#757575"
            value={uniqueId}
            onChangeText={(text) => setUniqueId(text)}
          />
          <Text style={styles.sous_titre}>Ecriver votre quiz manuellement ou utiliser l'IA</Text>
          <View style={styles.container2}>
            <Text style={[styles.choix1, { color: tiroir ? '#757575' : '#4CAF50', fontWeight: tiroir ? 'normal' : 'bold' }]}>Classique</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={tiroir ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={tiroir}
            />
            <Text style={[styles.choix2, {color: tiroir ? '#81b0ff' : '#757575', fontWeight: tiroir ? 'bold' : 'normal'}]}>IA          </Text>
          </View>
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
      paddingTop: Platform.OS === 'web' && width >= 768 ? hp('10%') :  hp('28%'),
    },
    container2:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    choix1:{
      marginRight:hp('10%'),
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : hp('1%'),
      color: '#757575',
    },
    choix2:{
      marginLeft:hp('10%'),
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : hp('1%'),
    },
    titre: {
      color: '#333333',
      fontWeight: 'bold',
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('7%') : wp('8%'),
      textAlign: 'center',
    },
    sous_titre: {
      color: '#333333',
      textAlign: 'center',
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('6%'),
      paddingTop: Platform.OS === 'web' && width >= 768 ? wp('4%') : wp('4%'),
      paddingBottom: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('4%'),
      fontWeight: 'bold',
      textDecorationLine: 'underline',
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
      marginTop: hp('7%'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    boutonText: {
      color: '#FFFFFF',
      fontSize: wp('3%'),
      fontWeight: 'bold',
    },
});

export default NomPartie;
