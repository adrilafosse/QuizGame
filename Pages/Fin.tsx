import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Fin: React.FC<{ navigation: any }> = ({ navigation }) => {
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => null,
        headerShown: false, // Masque la flèche de retour
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