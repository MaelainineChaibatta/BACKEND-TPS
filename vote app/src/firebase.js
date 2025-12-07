
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNd3TOSWd_xbCYt4G71h92nBhDS_sbP0E",
  authDomain: "vote-app-ensa.firebaseapp.com",
  projectId: "vote-app-ensa",
  storageBucket: "vote-app-ensa.firebasestorage.app",
  messagingSenderId: "60923319170",
  appId: "1:60923319170:web:b42a1e96accbbda887359b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
