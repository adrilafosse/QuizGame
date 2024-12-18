import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');

const AttenteReponse: React.FC<{ navigation: any }> = ({ navigation }) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false,
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
      <Text style={styles.titre}>Votre réponse a bien été envoyée, vous recevrez une nouvelle notification pour la prochaine question</Text>
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
    fontSize : Platform.OS === 'web' && width >= 768 ? wp('4%') :  wp('8%'),
    paddingTop: hp('5%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
});

export default AttenteReponse;


