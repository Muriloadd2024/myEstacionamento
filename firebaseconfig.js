import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration (replace with environment variables in production)
const firebaseConfig = {
    apiKey: "AIzaSyBRE0WoZDMbVUPUTI9m6fWdIlXMuKZM_f0",
    authDomain: "myestacionamento.firebaseapp.com",
    projectId: "myestacionamento",
    storageBucket: "myestacionamento.firebasestorage.app",
    messagingSenderId: "133133212966",
    appId: "1:133133212966:web:8dc4574e3510465f78b5e7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

