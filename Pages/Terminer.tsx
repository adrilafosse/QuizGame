import React from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
    uniqueId: string;
}

const Terminer: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute(); 
  const { uniqueId } = route.params as RouteParams;
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false,
    });
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Pour rejoindre une partie, rentrez le nom de la partie :</Text>
      <Text selectable style={styles.sous_titre}>{uniqueId}</Text>            
      <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate('PageAccueil')}>
        <Text style={styles.boutonText}>Page d'accueil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? hp('15%') :  hp('28%'),
  },
  titre: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('5%') : wp('8%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'), 
  },
  sous_titre: {
    color: '#4CAF50',
    fontSize: wp('5%'),
    paddingTop: hp('4%'),
    textAlign: 'center', 
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

export default Terminer;
