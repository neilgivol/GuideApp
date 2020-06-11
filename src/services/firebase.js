import React from 'react'
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
  firebase.initializeApp(firebaseConfig)
//   firebase.firestore().settings({
//       timestampsInSnapshots: true
//   })
  
  export const myFirebase = firebase
  export const myFirestore = firebase.firestore()
  export const myStorage = firebase.storage()

 