import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { ref, set } from 'firebase/database';
import { db } from '../firebaseConfig';

interface RouteParams {
  uniqueId: string;
  nombrePages: number;
}

const QuestionsReponses: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [page,setPage] = useState(1);
  const route = useRoute(); 
  const { uniqueId, nombrePages } = route.params as RouteParams;
  const [nombreReponse,setNombreReponse] = useState(1);
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
  }, [navigation]);

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
    if (page < nombrePages) {
      setPage(page + 1);
      Firebase();
      setQuestion('');
      setreponse1('');
      setreponse2('');
      setreponse3('');
      setreponse4('');
      navigation.navigate('Questions réponses', { uniqueId, nombrePages, page });
      
    }
  };

  async function Firebase(){

    if(reponse3 && reponse4){
      set(ref(db, `${uniqueId}/question_reponse/question_reponse_${page}`), {
        question : question,
        reponse1 : reponse1,
        reponse2 : reponse2,
        reponse3 : reponse3,
        reponse4 : reponse4,
        nombreDeReponses : 4,
      });
    }
    else if(reponse3){
      set(ref(db, `${uniqueId}/question_reponse/question_reponse_${page}`), {
        question : question,
        reponse1 : reponse1,
        reponse2 : reponse2,
        reponse3 : reponse3,
        nombreDeReponses : 3,
      });
    }
    else{
      set(ref(db, `${uniqueId}/question_reponse/question_reponse_${page}`), {
        question : question,
        reponse1 : reponse1,
        reponse2 : reponse2,
        nombreDeReponses : 2,
      });
    }
    
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.question}>Question: {page}/{nombrePages}</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ecrivez votre question"
        placeholderTextColor="#757575"
        value={question}
        onChangeText={setQuestion} 
      />
      <Text style={styles.question}>Vos réponses</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ecrivez la bonne réponse"
        placeholderTextColor="#757575"
        value={reponse1}
        onChangeText={setreponse1} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Ecrivez une mauvaise réponse"
        placeholderTextColor="#757575"
        value={reponse2}
        onChangeText={setreponse2} 
      />
     {compteur === 3 ? (
      <TextInput 
        style={styles.input} 
        placeholder="Ecrivez une mauvaise réponse"
        placeholderTextColor="#757575"
        value={reponse3}
        onChangeText={setreponse3} 
      />
      ) : compteur > 3 ? (
      <>
        <TextInput 
          style={styles.input} 
          placeholder="Ecrivez une mauvaise réponse"
          placeholderTextColor="#757575"
          value={reponse3}
          onChangeText={setreponse3} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Ecrivez une mauvaise réponse"
          placeholderTextColor="#757575"
          value={reponse4}
          onChangeText={setreponse4} 
        />
      </>
      ) : null}
      <View style={styles.container2}>
        <TouchableOpacity style={styles.bouton1} onPress={() => CompteurPlus()}>
          <Text style={styles.boutonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouton2} onPress={() => CompteurMoins()}>
          <Text style={styles.boutonText}>-</Text>
        </TouchableOpacity>
      </View>
      
      {page < nombrePages ? (
        <TouchableOpacity style={styles.bouton} onPress={questionSuivante}>
          <Text style={styles.boutonText}>Question suivante</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.bouton} 
          onPress={() => {navigation.navigate('Terminer', { uniqueId }); Firebase() }}
        >
          <Text style={styles.boutonText}>Terminer le quiz</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('3%'),
    width: '40%',
  },
  bouton: {
    backgroundColor: '#4CAF50',
    paddingVertical: Platform.OS === 'web' ? hp('2%') : hp('3%'),
    paddingHorizontal: Platform.OS === 'web' ? wp('15%') : wp('20%'),
    borderRadius: 8,
    marginTop: Platform.OS === 'web' ? hp('5%') : hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  question: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? wp('3%') : wp('8%'),
    paddingTop: Platform.OS === 'web' ? hp('5%') : hp('7%'),
    textAlign: 'center',
  },
  input: {
    height: hp('6%'),
    width: '80%',
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('3%'),
    marginTop: hp('2%'),
    color: '#333333',
  },
  bouton1: {
    backgroundColor: '#72825e',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 20,
  },
  bouton2: {
    backgroundColor: '#72825e',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2.5%'),
    borderRadius: 20,
  },
});


export default QuestionsReponses;
