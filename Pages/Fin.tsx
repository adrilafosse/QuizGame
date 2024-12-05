import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
interface RouteParams {
  valeur: string;
  pseudo: string;
}

const Fin: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { valeur, pseudo } = route.params as RouteParams;
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => null,
        headerShown: false, // Masque la flèche de retour
      });
    }, [navigation]);
    
    useEffect(() => {
      const backAction = () => {
        navigation.navigate("PageAccueil");
        return true;
      };
    
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
    
      // Nettoie l'écouteur lorsque le composant est démonté
      return () => backHandler.remove();
    }, [navigation]);
  
    
    return (
        <View style={styles.container}>
          <Text style={styles.titre}>Fin</Text>
          <TouchableOpacity 
                style={styles.bouton} 
                onPress={() => navigation.navigate('Bilan', { valeur, pseudo })}
                >
                <Text style={styles.boutonText}>Bilan</Text>
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

export default Fin;