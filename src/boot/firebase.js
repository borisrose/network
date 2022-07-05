import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage , ref } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBASXIqT9WO05QghCcSZtUmxEGYJfw7dHI",
  authDomain: "network-3f05e.firebaseapp.com",
  projectId: "network-3f05e",
  storageBucket: "network-3f05e.appspot.com",
  messagingSenderId: "335911364618",
  appId: "1:335911364618:web:a9764e75d884f2a60b97f3"
};

// Initialize Cloud Storage and get a reference to the service

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

// Create a storage reference from our storage service
const storageRef = ref(storage);

const imagesRef = ref(storage, 'images');


export const firebase = { app, db, auth, storage, storageRef, imagesRef}