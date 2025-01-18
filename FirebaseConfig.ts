// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY_X4OPGZUsvcJi_kaDpaqJWkzbCNh6dM",
  authDomain: "hugmeapp-ed25c.firebaseapp.com",
  projectId: "hugmeapp-ed25c",
  storageBucket: "hugmeapp-ed25c.firebasestorage.app",
  messagingSenderId: "761805708049",
  appId: "1:761805708049:web:af1386d4fd5a41812fcab0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);