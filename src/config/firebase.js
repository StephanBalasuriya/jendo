// Import the Web SDK (works with Expo managed)
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your config (consider moving to .env for security)
const firebaseConfig = {
  apiKey: "AIzaSyDaMmWNitAOImZ9toPeybv4oPIm2Q5nh84",
  authDomain: "jendo-90cdb.firebaseapp.com",
  projectId: "jendo-90cdb",
  storageBucket: "jendo-90cdb.appspot.com",
  messagingSenderId: "548278552280",
  appId: "1:548278552280:web:16c65cf7a9c736ea1539ad",
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error: ", error);
  throw new Error("Failed to initialize Firebase");
}

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);

export { app, auth, firestore };
