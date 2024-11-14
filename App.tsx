import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PageAccueil from './Pages/PageAccueil';
import NouvellePartie from './Pages/NouvellePartie';
import QuestionsReponses from './Pages/QuestionsReponses';
import Terminer from './Pages/Terminer';
import Pseudo from './Pages/Pseudo';
import EnAttente from './Pages/EnAttente';
import Admin from './Pages/Admin'
import Question from './Pages/Question'
import CodeAdmin from './Pages/CodeAdmin'
import AttenteReponse from './Pages/AttenteReponse'
import Fin from'./Pages/Fin'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PageAccueil">
        <Stack.Screen name="Page d'accueil" component={PageAccueil} />
        <Stack.Screen name="Nouvelle partie" component={NouvellePartie} />
        <Stack.Screen name="Questions réponses" component={QuestionsReponses} />
        <Stack.Screen name="Terminer" component={Terminer} />
        <Stack.Screen name="Pseudo" component={Pseudo} />
        <Stack.Screen name="En attente" component={EnAttente} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Question" component={Question} />
        <Stack.Screen name="CodeAdmin" component={CodeAdmin} />
        <Stack.Screen name="AttenteReponse" component={AttenteReponse} />
        <Stack.Screen name="Fin" component={Fin} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
