import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { ref, set, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { Platform, Dimensions } from 'react-native';
import Constants from 'expo-constants';

const {width} = Dimensions.get('window');

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
  const [apiKey, setApiKey] = useState('');
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);

  useEffect(() => {
    fetch('https://back-mv6pbo6mya-ew.a.run.app/')
      .then(response => response.json())
      .then(data => {
        console.log("data :",data)
        if (data.API_KEY) {
          setApiKey(data.API_KEY);
        } 
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

    const Exemple = async () => {
      try {
        const response = await fetch( 
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          //`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBZcicrdZrHXirde-AcHddKpoQSL7h7pD8`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Génère moi un JSON contenant 1 nouveau exemple de prompt en t'inspirant de ces 9 exemples, différent de "${texte}" : 
                        Les présidents de la 5e république en France,
                        Les présidents des Etats-Unis,
                        Les rois de France,
                        Jérôme à 3 frères et 4 soeurs,
                        Ludivine a visité ces pays hors de l'Europe : Vietnam, Etats-Unis, Canada, Martinique et Tunisie,
                        Adrien est allé faire du ski à Risoul, Val d'isère, Isola 2000, Alpes d'Huez, les Arcs, Courchevelle, les Menuires, le Sauze et Avoriaz et j'aimerais retourner à l'Alpes d'Huez,
                        Le plat traditionnel Canadien est la poutine,
                        Le Beausset compte 1098 habitants en 2022 et elle est catégorisée petite ville,
                        Les monuments emblématiques de Paris,
                        Les fleuves principaux en Europe,
                        Camille a déjà visité des îles tropicales,
                        Le plat national espagnol est la paella, souvent préparée avec du riz, des fruits de mer, du poulet et des épices,
                        Martin collectionne les timbres représentant des animaux en voie de disparition,
                        Une des capitales des pays nordiques est Copenhague,
                        Sophie adore les films de science-fiction comme Star Wars,
                        Les fromages français célèbres,
                        Jean a remporté la médaille d'or en athlétisme dans ces compétitions : les Jeux olympiques de 2012, le championnat d'Europe 2014 et les Mondiaux de 2015,
                        Le Mont-Blanc, situé dans les Alpes, est la plus haute montagne d'Europe occidentale avec une altitude de 4 807 mètres,
                        sous le forme {prompt: 'exemple'}`,
                    },
                  ],
                },
              ],
            }),
          }
        );
    
        // Vérification de la réponse
        if (response.ok) {
          const data = await response.json();
          const text = data.candidates[0].content.parts[0].text;
    
          // Nettoyage du texte pour récupérer uniquement le JSON
          const jsonText = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
          setTexte(jsonText.prompt);
          Generer(jsonText.prompt)
        } else {
          console.error("Erreur de réponse de l'API:", response.status);
        }
      } catch (error) {
        console.error("Erreur lors de la génération de contenu:", error);
      }
    };
    
    
    

  const questionSuivante = () => {
    if(reponse1 && reponse2 && question){
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
    else{
      alert("Vous devez rentrer au moins une question, une bonne réponse et une mauvaise réponse");
    } 
  };
  const Terminer = () => {
    if(reponse1 && reponse2 && question && reponse3 && reponse4){
      alert("Pour terminer tous les champs doivent être vide");
    }else{
      const page2 = page -1;
      update(ref(db, uniqueId),{
        nombreDeQuestions : page2,
      })
      navigation.navigate('Nouvelle partie', {uniqueId, page2});
    }
  }
  const Generer = async (texte: string) => {
    try {
      setGenerer(true)
      //const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBZcicrdZrHXirde-AcHddKpoQSL7h7pD8`,{
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Génère moi un JSON avec une question, 1 bonne réponse et 3 mauvaises réponses à partir du texte suivant : "${texte}
                  sous le forme {question: 'question'},"{bonneReponse: 'bonne réponse'},{mauvaiseReponse1: 'mauvaise réponse 1'},{mauvaiseReponse2: 'mauvaise réponse 2'}, {mauvaiseReponse3: 'mauvaise réponse 3'}` }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;    
      // Nettoyage du texte pour récupérer uniquement le JSON

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
        <Text style={styles.sous_titre }>Ecrivez un texte pour générer une question avec les réponses</Text>
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
        { generer ? (
        <>
        <View style={styles.container2}>
          { width >= 768 ? (
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
          { width >= 768 ? (
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
          { width >= 768 ? (
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
          { width >= 768 ? (
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
          { width >= 768 ? (
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
    paddingTop: Platform.OS === 'web' && width >= 768 ? hp('2%') :  hp('6%'),
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') :  hp('2%'),
    width: Platform.OS === 'web' && width >= 768 ? '70%' : wp('95%'),
  },
  buttonContainer: {
    flexDirection: 'row', // Les boutons sont alignés horizontalement
    alignItems: 'center', // Centrage vertical des boutons
    justifyContent: 'center', // Centrage horizontal du conteneur
    marginVertical: 10, // Espacement vertical du conteneur
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
    paddingVertical: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    paddingHorizontal: Platform.OS === 'web' && width >= 768 ? wp('5%') : wp('12%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('2%'),
    marginBottom: Platform.OS === 'web' && width >= 768 ? hp('2%') : hp('0%'),
    marginHorizontal:10,
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
    marginHorizontal:10,
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
