import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Vos imports existants ici
import PageAccueil from './Pages/PageAccueil';
import NouvellePartie from './Pages/NouvellePartie';
import QuestionsReponses from './Pages/QuestionsReponses';
import Terminer from './Pages/Terminer';
import Pseudo from './Pages/Pseudo';
import EnAttente from './Pages/EnAttente';
import Question from './Pages/Question';
import AttenteReponse from './Pages/AttenteReponse';
import Fin from './Pages/Fin';
import NomPartie from './Pages/NomPartie';
import DateHeure from './Pages/DateHeure';
import ReponseTropLongue from './Pages/ReponseTropLongue'

const Stack = createNativeStackNavigator();

export default function App() {
  // Demander l'autorisation des notifications
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Notifications non autorisées', 'Veuillez activer les notifications dans les paramètres.');
        }
      }
    };

    requestPermissions();

    // Configuration supplémentaire pour Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PageAccueil">
        <Stack.Screen name="PageAccueil" component={PageAccueil} />
        <Stack.Screen name="Nouvelle partie" component={NouvellePartie} />
        <Stack.Screen name="Questions réponses" component={QuestionsReponses} />
        <Stack.Screen name="Terminer" component={Terminer} />
        <Stack.Screen name="Pseudo" component={Pseudo} />
        <Stack.Screen name="En attente" component={EnAttente} />
        <Stack.Screen name="Question" component={Question} />
        <Stack.Screen name="AttenteReponse" component={AttenteReponse} />
        <Stack.Screen name="Fin" component={Fin} />
        <Stack.Screen name="NomPartie" component={NomPartie} />
        <Stack.Screen name="DateHeure" component={DateHeure} />
        <Stack.Screen name="ReponseTropLongue" component={ReponseTropLongue} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
