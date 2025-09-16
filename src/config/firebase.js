// src/config/firebase.js
import { initializeApp } from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaMmWNitAOImZ9toPeybv4oPIm2Q5nh84",
  authDomain: "jendo-90cdb.firebaseapp.com",
  projectId: "jendo-90cdb",
  storageBucket: "jendo-90cdb.firebasestorage.app",
  messagingSenderId: "548278552280",
  appId: "1:548278552280:web:16c65cf7a9c736ea1539ad",
  measurementId: "G-P04EVPFBW9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
