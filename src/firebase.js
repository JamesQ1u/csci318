import * as firebase from 'firebase';
import '@firebase/firestore';


const config = {
  apiKey: "AIzaSyDhD2ju_glaTBI2xXpvfoeYSoIsWl7AKEM",
  authDomain: "csci318-929de.firebaseapp.com",
  databaseURL: "https://csci318-929de.firebaseio.com",
  projectId: "csci318-929de",
  storageBucket: "csci318-929de.appspot.com",
  messagingSenderId: "429518238164"
};
export const firebaseApp = firebase.initializeApp(config);
export const db = firebase.firestore();