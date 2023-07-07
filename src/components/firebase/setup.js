// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsaZJT5tRxiQXuTjZSZysPYSvFxALd-ZU",
  authDomain: "spotdraft-8e806.firebaseapp.com",
  projectId: "spotdraft-8e806",
  storageBucket: "spotdraft-8e806.appspot.com",
  messagingSenderId: "250087438821",
  appId: "1:250087438821:web:299f952f488b816485970c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Intialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export const firestore = getFirestore(app);
export default app;