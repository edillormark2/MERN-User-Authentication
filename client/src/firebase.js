// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "mern-auth-6ac9e.firebaseapp.com",
  projectId: "mern-auth-6ac9e",
  storageBucket: "mern-auth-6ac9e.appspot.com",
  messagingSenderId: "608497102130",
  appId: "1:608497102130:web:9e49b43d2c5d8b752ffb2b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
