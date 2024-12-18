import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');

const ReponseTropLongue: React.FC<{ navigation: any }> = ({ navigation }) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Vous avez mis trop de temps à répondre. Dommage !!!</Text>
      <Text style={styles.titre}>Veuillez attendre la prochaine question</Text>
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
});

export default ReponseTropLongue;


