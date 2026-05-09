import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDXZbQN9QvVGpeCkyp-sltjrOgmM0hNulU",
    authDomain: "chamba-app-f1ae4.firebaseapp.com",
    projectId: "chamba-app-f1ae4",
    storageBucket: "chamba-app-f1ae4.firebasestorage.app",
    messagingSenderId: "167718749203",
    appId: "1:167718749203:web:5a97398a0b90a562ab2be6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);