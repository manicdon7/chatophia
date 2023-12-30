// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpXmrI2zGhrgz5MDYpVoYq2-Qgt5ylVHo",
  authDomain: "chatophia-69424.firebaseapp.com",
  projectId: "chatophia-69424",
  storageBucket: "chatophia-69424.appspot.com",
  messagingSenderId: "315517249939",
  appId: "1:315517249939:web:4f637b25191f0c9b83a066",
  measurementId: "G-DXHZ7NZT4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);