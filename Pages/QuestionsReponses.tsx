import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { ref, set, update } from 'firebase/database';
import { db } from '../firebaseConfig';

interface RouteParams {
  uniqueId: string;
}

const QuestionsReponses: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [page,setPage] = useState(1);
  const route = useRoute(); 
  const { uniqueId } = route.params as RouteParams;
  const [question, setQuestion] = useState('');
  const [reponse1, setreponse1] = useState('');
  const [reponse2, setreponse2] = useState('');
  const [reponse3, setreponse3] = useState('');
  const [reponse4, setreponse4] = useState('');
  const [compteur, setcompteur] = useState(2);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false, // Masque la flèche de retour
    });
  }, []);

  const CompteurPlus = () => {
    if(compteur<=4){
      setcompteur(compteur+1)
    }
  }
  const CompteurMoins = () => {
    if(compteur>=2){
      setcompteur(compteur-1)
    }
  }
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
    const page2 = page -1;
    update(ref(db, uniqueId),{
      nombreDeQuestions : page2,
    })
    navigation.navigate('Nouvelle partie', { uniqueId, page2});
  }

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
      <TextInput 
        style={styles.input1} 
        placeholder="Ecriver votre question"
        placeholderTextColor="#757575"
        value={question}
        onChangeText={setQuestion} 
      />
      <Text style={styles.reponse}>Vos réponses (4 réponses possibles)</Text>
      <TextInput 
        style={styles.input2} 
        placeholder="Ecriver la bonne réponse"
        placeholderTextColor="#757575"
        value={reponse1}
        onChangeText={setreponse1} 
      />
      <TextInput 
        style={styles.input1} 
        placeholder="Ecriver une mauvaise réponse"
        placeholderTextColor="#757575"
        value={reponse2}
        onChangeText={setreponse2} 
      />
     {compteur === 3 ? (
      <TextInput 
        style={styles.input1} 
        placeholder="Ecriver une mauvaise réponse"
        placeholderTextColor="#757575"
        value={reponse3}
        onChangeText={setreponse3} 
      />
      ) : compteur > 3 ? (
      <>
        <TextInput 
          style={styles.input1} 
          placeholder="Ecriver une mauvaise réponse"
          placeholderTextColor="#757575"
          value={reponse3}
          onChangeText={setreponse3} 
        />
        <TextInput 
          style={styles.input1} 
          placeholder="Ecriver une mauvaise réponse"
          placeholderTextColor="#757575"
          value={reponse4}
          onChangeText={setreponse4} 
        />
      </>
      ) : null}
      <View style={styles.container2}>
        <TouchableOpacity style={styles.bouton1} onPress={() => CompteurPlus()}>
          <Text style={styles.boutonText2}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouton} onPress={questionSuivante}>
          <Text style={styles.boutonText}>Valider et créer une nouvelle question</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouton2} onPress={() => CompteurMoins()}>
          <Text style={styles.boutonText2}>-</Text>
        </TouchableOpacity>
      </View>
        {page > 1 ? (
          <>
            <Text style={styles.ou}>----------   ou   ----------</Text>
            <TouchableOpacity 
              style={styles.bouton3} 
              onPress={Terminer}
              >
              <Text style={styles.boutonText3}>Suivant</Text>
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
    paddingTop: Platform.OS === 'web' ? hp('4%') :  hp('8%'),
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'web' ? hp('2%') :  hp('5%'),
    width: Platform.OS === 'web' ? '40%' : wp('70%'), 
  },
  ou:{
    paddingTop: Platform.OS === 'web' ? wp('1%') : wp('12%'),
    color: '#757575',
    fontSize: Platform.OS === 'web' ? wp('1%') : wp('4%'),
  },
  bouton: {
    backgroundColor: '#757575',
    paddingVertical: Platform.OS === 'web' ? hp('2%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' ? wp('5%') : wp('20%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS === 'web' ? hp('2%') : hp('3%'),
  },
  bouton3: {
    backgroundColor: '#4CAF50',
    paddingVertical: Platform.OS === 'web' ? hp('2%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' ? wp('5%') : wp('20%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'web' ? hp('3%') : hp('3%'),
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? wp('1%') : wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 'auto',
  },
  boutonText2: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? wp('1%') : wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 'auto',
  },
  boutonText3: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? wp('2%') : wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
     marginLeft: 'auto',
  },
  question: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('7%'),
    textAlign: 'center',
  },
  reponse:{
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('6%'),
    paddingTop: Platform.OS === 'web' ? hp('5%') : hp('2%'),
    textAlign: 'center',
  },
  input1: {
    height: hp('6%'),
    width: '80%',
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('3%'),
    marginTop: hp('2%'),
    color: '#333333',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' ? wp('1%') : wp('4%'),
  },
  input2: {
    height: hp('6%'),
    width: '80%',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('3%'),
    marginTop: hp('2%'),
    color: 'red',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' ? wp('1%') : wp('4%'),
  },
  
  bouton1: {
    backgroundColor: '#757575',
    marginTop: Platform.OS === 'web' ? hp('2%') : hp('3%'),
    paddingVertical: Platform.OS === 'web' ? hp('3%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' ? wp('2%') : wp('10%'),
    borderRadius: 20,
  },
  bouton2: {
    backgroundColor: '#757575',
    marginTop: Platform.OS === 'web' ? hp('2%') : hp('3%'),
    paddingVertical: Platform.OS === 'web' ? hp('3%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' ? wp('2%') : wp('10%'),
    borderRadius: 20,
  },
});


export default QuestionsReponses;
