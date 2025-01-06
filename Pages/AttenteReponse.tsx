import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, BackHandler, Image } from 'react-native';
import React, { useEffect, useState  } from 'react';
import { Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');

const AttenteReponse: React.FC<{ navigation: any }> = ({ navigation }) => {
  const gifs = [
    require('./../assets/gif1.gif'),
    require('./../assets/gif2.gif'),
    require('./../assets/gif3.gif'),
    require('./../assets/gif4.gif'),
    require('./../assets/gif5.gif'),
    require('./../assets/gif6.gif'),
    require('./../assets/gif7.gif'),
    require('./../assets/gif8.gif'),
    require('./../assets/gif9.gif'),
    require('./../assets/gif10.gif'),
  ];
  const [randomGif, setRandomGif] = useState(null);
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * gifs.length);
    setRandomGif(gifs[randomIndex]);
  }, []);

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
      <Image
        style={styles.gif}
        source={randomGif}
        resizeMode="contain"
      />
      <Text style={styles.titre}>Bravo ! Votre réponse a bien été envoyée, vous recevrez une nouvelle notification pour la prochaine question</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gif: {
    width: 300,
    height: 300,
  },
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
    fontSize : Platform.OS === 'web' && width >= 768 ? wp('3%') :  wp('8%'),
    paddingTop: hp('5%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
});

export default AttenteReponse;


