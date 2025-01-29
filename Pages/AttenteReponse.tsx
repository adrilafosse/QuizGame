import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, BackHandler, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AttenteReponse: React.FC<{ navigation: any }> = ({ navigation }) => {
  const gifs = [
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGM5bjhyOXkxbTlheWsyMGducHpncHBxd3IxdjN1cjNqNXllZmw3NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ytTYwIlbD1FBu/giphy.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2UwN2NyY2x0a3lzczd2MHVnNDJidDRyZWM4bXF1enhuZnVheDR3ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AwoDg0wJImOjK/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTRhaHQ1b3YxbW1jN2RhOXUzNmFwNGt2enIwODA0ampwcTI2MGN5MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1MTLxzwvOnvmE/giphy.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHd3OTY2eXhzZnVsOGVvdmR3cXE0aWVrM2hhYjZoN2h4bDduN2hnNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KpYMJBguKU4o7gJN5y/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGtkejV4azVrMDZ5bnJueDV1bzB2eWlldGJ3YmIyODdyeWtlYjAydSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jC1zKGLmfVYXDEgUii/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnhvcnRtb3Z0c3gzdWd6cXdpYnZ2eDdyZWlrcnl0NHVmMnlqd2lvOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/heIX5HfWgEYlW/giphy.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnJsamF6bDZwZHhlMXZ2MmI3YjA0MjAwdXV5NGZ4ZHdmczdxZmI1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TjAcxImn74uoDYVxFl/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWpodmNycGpvNG5pYmdjZmx2dzNjdzJyenMxbDd6dm1vZGw0cjZydSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hryis7A55UXZNCUTNA/giphy.gif",
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
        source={{ uri: randomGif }}  // Ajoute des accolades ici !
        resizeMode="contain"
      />
      {Platform.OS === 'web' ? (
        <Text style={styles.titre}>Votre réponse a bien été envoyée, vous recevrez une nouvelle notification pour la prochaine question.</Text>
      ) :
        <Text style={styles.titre}>Votre réponse a bien été envoyée. Veuillez rester sur cette page, une nouvelle question arrivera bientôt.</Text>
      }
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
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('8%'),
    paddingTop: hp('5%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
});

export default AttenteReponse;


