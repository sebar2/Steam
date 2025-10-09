// Import the functions you need from the SDKs you need
// Using CDN imports with module support, which works well with your setup.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration, as you provided it.
const firebaseConfig = {
  apiKey: "AIzaSyBuGnwbrmgcPoCNpwrbngOj6FNrB52YArU",
  authDomain: "cerradura-smart-rfid-bt.firebaseapp.com",
  projectId: "cerradura-smart-rfid-bt",
  storageBucket: "cerradura-smart-rfid-bt.firebasestorage.app",
  messagingSenderId: "1080294591226",
  appId: "1:1080294591226:web:182c68af2df2d1a56d5743",
  measurementId: "G-YXTPFBWMXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services for use in other modules.
// Based on your HTML, you'll need Authentication and a Database.
export const auth = getAuth(app);
export const db = getDatabase(app); // Using Realtime Database, great for live data like event logs.