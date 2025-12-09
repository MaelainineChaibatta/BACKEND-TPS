
import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBahxMpjE0NWHqh2rY38dYrLh3t0cvdVSw",
  authDomain: "forum-app-35e89.firebaseapp.com",
  projectId: "forum-app-35e89",
  storageBucket: "forum-app-35e89.firebasestorage.app",
  messagingSenderId: "421646422668",
  appId: "1:421646422668:web:93584c4ffcba9a5299e1a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);