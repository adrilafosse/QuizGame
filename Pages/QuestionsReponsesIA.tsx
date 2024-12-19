import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { ref, set, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');

interface RouteParams {
  uniqueId: string;
}

const QuestionsReponsesIA: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [page,setPage] = useState(1);
  const route = useRoute(); 
  const { uniqueId } = route.params as RouteParams;
  const [question, setQuestion] = useState('');
  const [reponse1, setreponse1] = useState('');
  const [reponse2, setreponse2] = useState('');
  const [reponse3, setreponse3] = useState('');
  const [reponse4, setreponse4] = useState('');
  const [texte, setTexte] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);

  const questionSuivante = () => {
    if(reponse1 && reponse2 && question){
      setPage(page + 1);
      Validation();
      setQuestion('');
      setreponse1('');
      setreponse2('');
      setreponse3('');
      setreponse4('');
      navigation.navigate('Questions réponses', { uniqueId, page });
    }
    else{
      alert("Vous devez rentrer au moins une question, une bonne réponse et une mauvaise réponse");
    } 
  };
  const Terminer = () => {
    if(reponse1 && reponse2 && question){
      alert("Pour terminer tous les champs doivent être vide");
    }else{
      const page2 = page -1;
      update(ref(db, uniqueId),{
        nombreDeQuestions : page2,
      })
      navigation.navigate('Nouvelle partie', {uniqueId, page2});
    }
  }
  const Generer = async () => {
    if (texte) {
      const apiKey = 'AIzaSyBA5bG-TxUApB51ROdO9cfj-syyw6lurp0'; // Assurez-vous que la clé API est valide
      const apiUrl = 'https://generativeai.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
  
      const requestData = {
        prompt: `Génére moi une question et 1 bonne réponse et 3 mauvaises réponses par rapport à ça : ${texte}`, // Utilisation des backticks pour l'interpolation
        temperature: 0.7, // Paramètre de température (entre 0 et 1)
      };
  
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`, // Authentification avec la clé API
          },
          body: JSON.stringify(requestData),
        });
  
        if (!response.ok) {
          throw new Error('Request failed');
        }
  
        const responseData = await response.json();
        console.log(responseData.text); // Affiche le texte généré par l'API
  
        // Vous pouvez ici gérer la réponse, par exemple l'afficher dans l'interface
      } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API :', error);
      }
    } else {
      alert("Vous devez rentrer au moins une question, une bonne réponse et une mauvaise réponse");
    }
  };
  

  async function Validation(){
    if(reponse3 && reponse4){
      set(ref(db, `${uniqueId}/question_reponse/${page}`), {
        question : question,
        reponse1 : reponse1,
        reponse2 : reponse2,
        reponse3 : reponse3,
        reponse4 : reponse4,
        nombreDeReponses : 4,
      });
    }
    else if(reponse3){
      set(ref(db, `${uniqueId}/question_reponse/${page}`), {
        question : question,
        reponse1 : reponse1,
        reponse2 : reponse2,
        reponse3 : reponse3,
        nombreDeReponses : 3,
      });
    }
    else{
      set(ref(db, `${uniqueId}/question_reponse/${page}`), {
        question : question,
        reponse1 : reponse1,
        reponse2 : reponse2,
        nombreDeReponses : 2,
      });
    }
  }
  
  return (
    <View style={styles.container}>
        <Text style={styles.question}>Question : {page}</Text>
        <Text style={styles.sous_titre }>Ecriver un texte pour générer une question</Text>
        <TextInput 
            style={styles.input3} 
            placeholder="Ecriver quelque chose..."
            placeholderTextColor="#757575"
            multiline={true}
            value={texte}
            onChangeText={setTexte} 
        />
        <TouchableOpacity style={styles.bouton} onPress={Generer}>
          <Text style={styles.boutonText}>Générer</Text>
        </TouchableOpacity>
        <View style={styles.container2}>
            <Text style={styles.Question}>Question               :     </Text>
            <TextInput 
            style={styles.input} 
            placeholder="Question"
            placeholderTextColor="#757575"
            multiline={true}
            value={question}
            onChangeText={setQuestion} 
            />
        </View>
        <View style={styles.container2}>
            <Text style={styles.bonne_reponse}>Bonne réponse      :     </Text>
            <TextInput 
            style={styles.input} 
            placeholder="Bonne réponse "
            placeholderTextColor="#757575"
            multiline={true}
            value={reponse1}
            onChangeText={setreponse1} 
            />
        </View>
        <View style={styles.container2}>
            <Text>Mauvaise réponse :     </Text>
            <TextInput 
            style={styles.input} 
            placeholder="Mauvaise réponse"
            placeholderTextColor="#757575"
            multiline={true}
            value={reponse2}
            onChangeText={setreponse2} 
            />
        </View>
        <View style={styles.container2}>
            <Text>Mauvaise réponse :     </Text>
            <TextInput 
            style={styles.input} 
            placeholder="Mauvaise réponse"
            placeholderTextColor="#757575"
            multiline={true}
            value={reponse3}
            onChangeText={setreponse3} 
            />
        </View>
        <View style={styles.container2}>
            <Text>Mauvaise réponse :     </Text>
            <TextInput 
            style={styles.input} 
            placeholder="Mauvaise réponse"
            placeholderTextColor="#757575"
            multiline={true}
            value={reponse4}
            onChangeText={setreponse4} 
            />
        </View>
        <TouchableOpacity style={styles.bouton2} onPress={questionSuivante}>
          <Text style={styles.boutonText}>Ajouter</Text>
        </TouchableOpacity>
        <Text style={styles.ou}>----------   ou   ----------</Text>
        <TouchableOpacity style={styles.bouton3} onPress={Terminer}>
            <Text style={styles.boutonText3}>Terminer</Text>
        </TouchableOpacity>
      </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('2%') :  hp('10%'),
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('1%') :  hp('5%'),
    width: Platform.OS === 'web' && width >= 768 ? '60%' : wp('70%'),
  },
  bonne_reponse:{
    color: 'red',
  },
  Question:{
    fontWeight: 'bold',
  },
  ou:{
    paddingTop: Platform.OS === 'web' && width >= 768 ? wp('1%') : wp('3%'),
    color: '#757575',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('1%') : wp('4%'),
  },
  bouton3: {
    backgroundColor: '#4CAF50',
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('5%') : wp('15%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('3%') : hp('3%'),
  },
  boutonText3: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('2%') : wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 'auto',
  },
  bouton: {
    backgroundColor: '#81b0ff',
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('5%') : wp('6%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('0%'),
    marginHorizontal:wp('3%'),
  },
  bouton2: {
    backgroundColor: '#757575',
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('5%') : wp('6%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('0%'),
    marginHorizontal:wp('3%'),
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('1%') : wp('3%'),
    fontWeight: 'bold',
  },
  question: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('3%') : wp('8%'),
    textAlign: 'center',
  },
  input3: {
    height: hp('10%'),
    width: '80%',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('5%'),
    marginTop: hp('3%'),
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('1%') : wp('4%'),
    paddingVertical: hp('2%'),
  },
  input: {
    height: hp('4%'),
    width: '80%',
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('3%'),
    marginTop: hp('2%'),
    color: '#333333',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('1%') : wp('4%'),
    marginRight:('13%'),
  },
  sous_titre: {
    color: '#333333',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('1.5%') : wp('6%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? wp('0.5%') : wp('4%'),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});


export default QuestionsReponsesIA;
