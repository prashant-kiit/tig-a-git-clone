// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAkCo4gApxuvq03i7JJaPYhMRjoyKhc6B0",
    authDomain: "tig-git-clone.firebaseapp.com",
    projectId: "tig-git-clone",
    storageBucket: "tig-git-clone.firebasestorage.app",
    messagingSenderId: "20225060456",
    appId: "1:20225060456:web:33dd1643fcbefa44bd55dd",
    measurementId: "G-BC6BVH84FY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;