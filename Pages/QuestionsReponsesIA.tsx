import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { ref, set, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface RouteParams {
  uniqueId: string;
  page: number;
}

const QuestionsReponsesIA: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { uniqueId, page } = route.params as RouteParams;
  const [question, setQuestion] = useState('');
  const [reponse1, setreponse1] = useState('');
  const [reponse2, setreponse2] = useState('');
  const [reponse3, setreponse3] = useState('');
  const [reponse4, setreponse4] = useState('');
  const [texte, setTexte] = useState('');
  const [generer, setGenerer] = useState(false);
  const cookie = document.cookie.split('; ').find(row => row.startsWith('cookie='))?.split('=')[1];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);

  const Exemple = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/Exemple?cookie=${cookie}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });;
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      // Récupérer uniquement le JSON
      const jsonText = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      setTexte(jsonText.prompt);
      Generer(jsonText.prompt)

    } catch (error) {
      console.error("Erreur lors de la génération de contenu:", error);
    }
  };
  const questionSuivante = () => {
    if (reponse1 && reponse2 && question) {
      Validation();
      setQuestion('');
      setreponse1('');
      setreponse2('');
      setreponse3('');
      setreponse4('');
      setGenerer(false);
      setTexte('');
      navigation.navigate('Questions réponsesIA', { uniqueId, page: page + 1 });
    }
    else {
      alert("Vous devez rentrer au moins une question, une bonne réponse et une mauvaise réponse");
    }
  };
  const Terminer = async () => {
    if (reponse1 && reponse2 && question && reponse3 && reponse4) {
      alert("Pour terminer tous les champs doivent être vide");
    } else {
      const page2 = page - 1;
      update(ref(db, uniqueId), {
        nombreDeQuestions: page2,
      })
      try {
        const reponse = await fetch(`http://127.0.0.1:8080/Supprimer?cookie=${cookie}`, {
          //const reponse = await fetch('https://back-mv6pbo6mya-ew.a.run.app/Supprimer', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (reponse.ok) {
          navigation.navigate('Nouvelle partie', { uniqueId, page2 });
        }
      } catch (error) {
        console.error('Erreur');
      }

    }
  }
  const Generer = async (texte: string) => {
    setGenerer(true);
    try {
      const reponse = await fetch(`http://127.0.0.1:8080/Generer?cookie=${cookie}`, {
        //const reponse = await fetch('https://back-mv6pbo6mya-ew.a.run.app/Generer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texte })
      });

      const data = await reponse.json();
      const text = data.candidates[0].content.parts[0].text;

      // Récupérer uniquement le JSON
      const jsonText = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      setQuestion(jsonText.question);
      setreponse1(jsonText.bonneReponse);
      setreponse2(jsonText.mauvaiseReponse1);
      setreponse3(jsonText.mauvaiseReponse2);
      setreponse4(jsonText.mauvaiseReponse3);
    } catch (error) {
      console.error('Erreur lors de la génération de contenu:', error);
    }
  };
  async function Validation() {
    if (reponse3 && reponse4) {
      set(ref(db, `${uniqueId}/question_reponse/${page}`), {
        question: question,
        reponse1: reponse1,
        reponse2: reponse2,
        reponse3: reponse3,
        reponse4: reponse4,
        nombreDeReponses: 4,
      });
    }
    else if (reponse3) {
      set(ref(db, `${uniqueId}/question_reponse/${page}`), {
        question: question,
        reponse1: reponse1,
        reponse2: reponse2,
        reponse3: reponse3,
        nombreDeReponses: 3,
      });
    }
    else {
      set(ref(db, `${uniqueId}/question_reponse/${page}`), {
        question: question,
        reponse1: reponse1,
        reponse2: reponse2,
        nombreDeReponses: 2,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Question : {page}</Text>
      <Text style={styles.sous_titre}>Ecrivez un texte pour générer une question avec les réponses</Text>
      <TextInput
        style={styles.input3}
        placeholder="Ecrivez quelque chose..."
        placeholderTextColor="#757575"
        multiline={true}
        value={texte}
        onChangeText={setTexte}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.bouton} onPress={() => Generer(texte)}>
          <Text style={styles.boutonText}>Générer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouton4} onPress={Exemple}>
          <Text style={styles.boutonText}>Voir un exemple</Text>
        </TouchableOpacity>
      </View>
      {generer ? (
        <>
          <View style={styles.container2}>
            {width >= 768 ? (
              <Text style={styles.Question}>Question               : </Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Question"
              placeholderTextColor="#757575"
              value={question}
              onChangeText={setQuestion}
            />
          </View>
          <View style={styles.container2}>
            {width >= 768 ? (
              <Text style={styles.bonne_reponse}>Bonne réponse      : </Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Bonne réponse "
              placeholderTextColor="#757575"
              value={reponse1}
              onChangeText={setreponse1}
            />
          </View>
          <View style={styles.container2}>
            {width >= 768 ? (
              <Text>Mauvaise réponse : </Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Mauvaise réponse"
              placeholderTextColor="#757575"
              value={reponse2}
              onChangeText={setreponse2}
            />
          </View>
          <View style={styles.container2}>
            {width >= 768 ? (
              <Text>Mauvaise réponse : </Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Mauvaise réponse"
              placeholderTextColor="#757575"
              value={reponse3}
              onChangeText={setreponse3}
            />
          </View>
          <View style={styles.container2}>
            {width >= 768 ? (
              <Text>Mauvaise réponse : </Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Mauvaise réponse"
              placeholderTextColor="#757575"
              value={reponse4}
              onChangeText={setreponse4}
            />
          </View>
          <TouchableOpacity style={styles.bouton2} onPress={questionSuivante}>
            <Text style={styles.boutonText}>Ajouter</Text>
          </TouchableOpacity>
        </>
      ) : null}
      {page > 1 ? (
        <>
          <Text style={styles.ou}>----------   ou   ----------</Text>
          <TouchableOpacity
            style={styles.bouton3}
            onPress={Terminer}
          >
            <Text style={styles.boutonText3}>Terminer</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('6%'),
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    width: Platform.OS === 'web' && width >= 768 ? '70%' : wp('95%'),
  },
  buttonContainer: {
    flexDirection: 'row', // Les boutons sont alignés horizontalement
    alignItems: 'center', // Centrage vertical des boutons
    justifyContent: 'center', // Centrage horizontal du conteneur
    marginVertical: 10, // Espacement vertical du conteneur
  },
  bonne_reponse: {
    color: 'red',
  },
  Question: {
    fontWeight: 'bold',
  },
  ou: {
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
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('5%') : wp('12%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    marginBottom: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('0%'),
    marginHorizontal: 10,
  },
  bouton4: {
    backgroundColor: '#002B5B',
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('5%') : wp('12%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    marginBottom: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('0%'),
    marginHorizontal: 10,
  },
  bouton2: {
    backgroundColor: '#757575',
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('5%') : wp('12%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    marginHorizontal: wp('3%'),
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
    width: Platform.OS === 'web' && width >= 768 ? '60%' : '95%',
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 5,
    color: '#333333',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('1%') : wp('4%'),
    marginRight: Platform.OS === 'web' && width >= 768 ? wp('13%') : wp('0%'),
    marginLeft: Platform.OS === 'web' && width >= 768 ? wp('4%') : wp('0%'),
  },
  sous_titre: {
    color: '#333333',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' && width >= 768 ? wp('1.5%') : wp('4%'),
    paddingTop: Platform.OS === 'web' && width >= 768 ? wp('0.5%') : wp('4%'),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  list: {
    marginTop: 20,
    width: '100%',
  },
  exampleText: {
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});


export default QuestionsReponsesIA;
