import React from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface RouteParams {
    uniqueId: string;
    idAdmin: string;
}

const Terminer: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute(); 
  const { uniqueId, idAdmin } = route.params as RouteParams;
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Masque la flèche de retour
    });
  }, [navigation]);
  
    return(
        <View style={styles.container}>
            <Text style={styles.titre}>Enregistrez le code de la partie :</Text>
            <Text selectable style={styles.sous_titre}>{uniqueId}</Text>
            <Text style={styles.titre}>Enregistrez votre code admin :</Text>
            <Text selectable style={styles.sous_titre}>{idAdmin}</Text>
            <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate('Page d\'accueil')}>
              <Text style={styles.boutonText}>Page d'accueil</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
    },
    titre: {
      color: '#333333',
      fontWeight: 'bold',
      fontSize: Platform.OS === 'web' ? wp('5%') : wp('9%'),
      paddingTop: Platform.OS === 'web' ? hp('5%') : hp('15%'),
    },
    sous_titre: {
      color: '#4CAF50',
      fontSize: Platform.OS === 'web' ? wp('3%') : wp('6%'),
      paddingTop: Platform.OS === 'web' ? hp('5%') : hp('8%'),
    },
    bouton: {
      backgroundColor: '#4CAF50',
      paddingVertical: hp('2.5%'),
      paddingHorizontal: wp('20%'),
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
})

export default Terminer;