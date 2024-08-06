import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyCBLvJL86svHk5D7pcmBdUZBynz5zDsF8s",
  authDomain: "weddingwise-3965d.firebaseapp.com",
  projectId: "weddingwise-3965d",
  storageBucket: "weddingwise-3965d.appspot.com",
  messagingSenderId: "944069345523",
  appId: "1:944069345523:web:a7cbf57677291b09def786"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()