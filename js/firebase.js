/* =========================================================
   AGARWAL STORE
   CODE 6 — FIREBASE FOUNDATION
   ========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIGURATION
   ========================================================= */

const firebaseConfig = {

  apiKey:
    "AIzaSyBUNLJ6iESd6QPGeUoh2g_gnuCHla1nQuA",

  authDomain:
    "agarwal-store-1b63f.firebaseapp.com",

  projectId:
    "agarwal-store-1b63f",

  storageBucket:
    "agarwal-store-1b63f.firebasestorage.app",

  messagingSenderId:
    "9483580041",

  appId:
    "1:9483580041:web:8f5d214eb6db1a78414c58"

};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const firebaseApp =
  initializeApp(firebaseConfig);


/* =========================================================
   AUTHENTICATION
   ========================================================= */

const auth =
  getAuth(firebaseApp);


/* =========================================================
   FIRESTORE
   ========================================================= */

const db =
  getFirestore(firebaseApp);


/* =========================================================
   GLOBAL FIREBASE OBJECT
   ========================================================= */

window.AgarwalFirebase = {

  app: firebaseApp,

  auth: auth,

  db: db

};


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:firebase-ready"
  )

);
