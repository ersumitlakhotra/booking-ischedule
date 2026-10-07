// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging} from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDx581IKJuvCfrUxPOYpylKqpW6_N7onII",
    authDomain: "ischedule-5112e.firebaseapp.com",
    projectId: "ischedule-5112e",
    storageBucket: "ischedule-5112e.firebasestorage.app",
    messagingSenderId: "169235267382",
    appId: "1:169235267382:web:acd314f9517b044ce53d97",
    measurementId: "G-WGGKY87GMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

