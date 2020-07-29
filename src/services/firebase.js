import React from 'react';
import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCrJVguRveC8yoNDJVRulEmHZNJJKO5pZ8",
    authDomain: "isravisor-app.firebaseapp.com",
    databaseURL: "https://isravisor-app.firebaseio.com",
    projectId: "isravisor-app",
    storageBucket: "isravisor-app.appspot.com",
    messagingSenderId: "905156749666",
    appId: "1:905156749666:web:2ece46477ad313d15be43b",
    measurementId: "G-9HKQNSD4JY"
  };
  
// var firebaseConfig = {
//     apiKey: "AIzaSyBExIF5rPr1dZHVPkXp4f7nLWLIhSjbPDA",
//     authDomain: "isradvisor-project.firebaseapp.com",
//     databaseURL: "https://isradvisor-project.firebaseio.com",
//     projectId: "isradvisor-project",
//     storageBucket: "isradvisor-project.appspot.com",
//     messagingSenderId: "224119449439",
//     appId: "1:224119449439:web:73bc28f44d93d8efd638ea",
//     measurementId: "G-ME30WEJHEG"
//   };

  firebase.initializeApp(firebaseConfig)
  firebase.firestore().settings({
      timestampsInSnapshots: true
  })
  
  export const myFirebase = firebase
  export const myFirestore = firebase.firestore()
  export const myStorage = firebase.storage()

 