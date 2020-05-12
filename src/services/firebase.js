import React from 'react'
import * as firebase from 'firebase';

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
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  firebase.firestore().settings({
    timestampsInSnapshots: true
})
export default firebase;
export const auth = firebase.auth
export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
export const database = firebase.database()

 