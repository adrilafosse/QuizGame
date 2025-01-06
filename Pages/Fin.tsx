import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TouchableOpacity, BackHandler, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');
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
          <Text style={styles.titre}>Bravo ! Vous avez terminé la partie. Maintenant, découvrez les bonnes réponses aux questions et le classement général</Text>
          <View style={styles.boutonsContainer}>
            <TouchableOpacity 
                style={styles.bouton} 
                onPress={() => navigation.navigate('Bilan', { valeur, pseudo })}
                >
                <Text style={styles.boutonText}>Synthèse</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.bouton2} 
                onPress={() => navigation.navigate('Scores', { valeur })}
                >
                <Text style={styles.boutonText}>Score</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.bouton3} onPress={() => navigation.navigate('Accueil')}>
            <Image
              source={require('./../assets/maison.png')}
              style={styles.image}
              resizeMode="contain"
            />
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
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') :  wp('8%'),
    paddingTop: hp('5%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  bouton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 8,
    marginTop: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  bouton2: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('14%'),
    borderRadius: 8,
    marginTop: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  bouton3: {
    position: 'absolute',
    top: hp('4%'),
    right: wp('4%'), 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: 'transparent',
  },
  image: {
    width : Platform.OS === 'web' && width >= 768 ? wp('8%') :  wp('15%'),
    height: wp('8%'),
  },
  boutonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
   boutonText: {
      color: '#FFFFFF',
      fontSize: wp('3%'),
      fontWeight: 'bold',
   },
});

export default Fin;