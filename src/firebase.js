import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDK59LR0THK4xPj43hzrvhGDAJEApRB8lA",
  authDomain: "habit-tracker-a232a.firebaseapp.com",
  projectId: "habit-tracker-a232a",
  storageBucket: "habit-tracker-a232a.firebasestorage.app",
  messagingSenderId: "230122285047",
  appId: "1:230122285047:web:c086d09de3ddd634dd70f2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);