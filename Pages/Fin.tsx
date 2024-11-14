import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
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
        headerLeft: () => null, // Masque la flèche de retour
      });
    }, [navigation]);
    
    return (
        <View style={styles.container}>
          <Text style={styles.titre}>Fin</Text>
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
});

export default Fin;