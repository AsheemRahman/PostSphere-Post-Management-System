// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "capital-rush-d1.firebaseapp.com",
    projectId: "capital-rush-d1",
    storageBucket: "capital-rush-d1.firebasestorage.app",
    messagingSenderId: "429221021660",
    appId: "1:429221021660:web:e1c266905f8e551e9fb119"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);