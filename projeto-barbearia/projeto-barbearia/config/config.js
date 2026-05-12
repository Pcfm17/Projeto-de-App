// Import the functions you need from the SDKs you need
import firebase from "firebase";
import "firebase/database"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdGcOQ39zXMY9u-nlQCSoeG6nY2p38xM4",
  authDomain: "barbearia-9f2ed.firebaseapp.com",
  databaseURL: "https://barbearia-9f2ed-default-rtdb.firebaseio.com",
  projectId: "barbearia-9f2ed",
  storageBucket: "barbearia-9f2ed.firebasestorage.app",
  messagingSenderId: "400821529969",
  appId: "1:400821529969:web:79046deffc6bd00ba9dad0"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;