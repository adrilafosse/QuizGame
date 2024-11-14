import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
    valeur: string;
    pseudo: string;
}

const CodeAdmin: React.FC<{ navigation: any }> = ({ navigation }) => {
    const route = useRoute();
    const { valeur, pseudo } = route.params as RouteParams;
    const [codeAdmin, setCodeAdmin] = useState('');

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => null, // Masque la flèche de retour
      });
    }, [navigation]);

    const Validation = () => {
        if (codeAdmin) {
          get(ref(db, `${valeur}/idAdmin`)).then((snapshot) => {
            if (snapshot.exists() && snapshot.val() === codeAdmin) {
              navigation.navigate('Admin', { valeur, pseudo });
            } else {
              alert("Le code admin n'est pas correct");
            }
          });
        }
      };

    return (
        <View style={styles.container}>
          <Text style={styles.titre}>Entrez votre admin</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Entrez votre code admin"
            placeholderTextColor="#757575"
            value={codeAdmin}
            onChangeText={(text) => setCodeAdmin(text)}
          />
          <TouchableOpacity style={styles.bouton2} onPress={Validation}>
            <Text style={styles.boutonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      );
    
}
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
    input: {
        height: hp('6%'),
        width: '85%',
        borderColor: '#757575',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: wp('4%'),
        marginTop: hp('2%'),
        fontSize: wp('4%'),
        color: '#333333',
      },
      bouton2: {
        backgroundColor: '#757575',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('20%'),
        borderRadius: 8,
        marginTop: hp('2%'),
        alignItems: 'center',
        justifyContent: 'center',
      },
      boutonText: {
        color: '#FFFFFF',
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
      },
})
export default CodeAdmin;

