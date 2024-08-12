import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "weddingwisetest-ecd19.firebaseapp.com",
  projectId: "weddingwisetest-ecd19",
  storageBucket: "weddingwisetest-ecd19.appspot.com",
  messagingSenderId: "560977532088",
  appId: "1:560977532088:web:71a9b0f07659fa9e6cd04d",
  measurementId: "G-QRFPDTG4LD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()