// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1MfKf4t8zX8Jmw5vAlRszZr4Ko-BVuwA",
  authDomain: "flashsaas.firebaseapp.com",
  projectId: "flashsaas",
  storageBucket: "flashsaas.appspot.com",
  messagingSenderId: "496084655314",
  appId: "1:496084655314:web:925242af7193349e0c610b",
  measurementId: "G-9DVKDTFKX3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);