// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZMIzPq68wda82dnBU45_xHr6d-cnYn5w",
  authDomain: "hospital-auth-1f806.firebaseapp.com",
  projectId: "hospital-auth-1f806",
  storageBucket: "hospital-auth-1f806.firebasestorage.app",
  messagingSenderId: "442287658",
  appId: "1:442287658:web:e7f15847df0e0748c9a553",
  measurementId: "G-DXQ08D6H5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider()
export const auth = getAuth(app);