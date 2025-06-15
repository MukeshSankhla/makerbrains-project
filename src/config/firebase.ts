
// Firebase configuration for MakerBrains.com
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAhxBnz6wvb_vJbWL8X1roQQMRVPk_s2qQ",
  authDomain: "makerbrains-5e6de.firebaseapp.com",
  projectId: "makerbrains-5e6de",
  storageBucket: "makerbrains-5e6de.firebasestorage.app",
  messagingSenderId: "567457313008",
  appId: "1:567457313008:web:e8e7e366e6d6643308d235",
  measurementId: "G-QGDBBFBKVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
