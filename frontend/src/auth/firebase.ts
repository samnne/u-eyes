// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAap1OXiNPbCHdFx1e3Hrm0K43fGBbK1QY",
  authDomain: "ueyes-74c38.firebaseapp.com",
  databaseURL: "https://ueyes-74c38-default-rtdb.firebaseio.com",
  projectId: "ueyes-74c38",
  storageBucket: "ueyes-74c38.firebasestorage.app",
  messagingSenderId: "862341733716",
  appId: "1:862341733716:web:f1062babceb0a5886bbcc1",
  measurementId: "G-7WL4SYD3SG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
