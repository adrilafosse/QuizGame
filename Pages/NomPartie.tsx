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
          alert('Vous devez créer un nom de partie');
        }
    }

    return (
        <View style={styles.container}>
          <Text style={styles.titre}>Créer votre partie</Text>
          <TextInput
            style={styles.input}
            placeholder="Créez le nom de la partie"
            placeholderTextColor="#757575"
            value={uniqueId}
            onChangeText={(text) => setUniqueId(text)}
          />
          <Text style={styles.sous_titre}>Ecrivez votre quiz avec ou sans IA</Text>
          <View style={styles.container2}>
            <Text style={[styles.choix1, { color: tiroir ? '#757575' : '#4CAF50', fontWeight: tiroir ? 'normal' : 'bold' }]}>Humain</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={tiroir ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={tiroir}
            />
            <Text style={[styles.choix2, {color: tiroir ? '#81b0ff' : '#757575', fontWeight: tiroir ? 'bold' : 'normal'}]}>IA      </Text>
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
      paddingTop: Platform.OS === 'web' && width >= 768 ? hp('10%') :  hp('15%'),
    },
    container2:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    choix1:{
      marginRight: Platform.OS === 'web' && width >= 768 ? hp('10%') : hp('5%'),
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : hp('3%'),
      color: '#757575',
    },
    choix2:{
      marginLeft: Platform.OS === 'web' && width >= 768 ? hp('10%') : hp('5%'),
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : hp('3%'),
    },
    titre: {
      color: '#333333',
      fontWeight: 'bold',
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('7%') : wp('10%'),
      textAlign: 'center',
    },
    sous_titre: {
      color: '#333333',
      textAlign: 'center',
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('5%'),
      paddingTop: Platform.OS === 'web' && width >= 768 ? wp('4%') : wp('10%'),
      paddingBottom: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('10%'),
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('5%'),
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
      fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('5%'),
      fontWeight: 'bold',
    },
});

export default NomPartie;
