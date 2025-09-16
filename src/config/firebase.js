// Import the Web SDK (works with Expo managed)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your config (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDaMmWNitAOImZ9toPeybv4oPIm2Q5nh84",
  authDomain: "jendo-90cdb.firebaseapp.com",
  projectId: "jendo-90cdb",
  storageBucket: "jendo-90cdb.appspot.com",
  messagingSenderId: "548278552280",
  appId: "1:548278552280:web:16c65cf7a9c736ea1539ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
