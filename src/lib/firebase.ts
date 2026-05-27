import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCNM1u_mE8j9k3LBq3mnZDGn96C9yh2DNw",
    authDomain: "gen-lang-client-0686783756.firebaseapp.com",
    projectId: "gen-lang-client-0686783756",
    storageBucket: "gen-lang-client-0686783756.firebasestorage.app",
    messagingSenderId: "942449514075",
    appId: "1:942449514075:web:c7578453425413149fd17e",
    measurementId: "G-MEMY6GHJ54"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
