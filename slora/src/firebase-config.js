// Firebase configuration file
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzGfFsG94BItoSHLkRNXPYP1xlJGP6wWk",
  authDomain: "slora-study.firebaseapp.com",
  projectId: "slora-study",
  storageBucket: "slora-study.appspot.com",
  messagingSenderId: "307218239987",
  appId: "1:307218239987:web:9f17f6b1c9fa5a3c3e11c7",
  measurementId: "G-DWNZ7QRXDG"
};

// Check if Firebase app is already initialized
let app;
if (getApps().length === 0) {
  // Initialize Firebase only if no apps exist
  app = initializeApp(firebaseConfig);
} else {
  // Use existing app if already initialized
  app = getApp();
}

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage, analytics };
export default firebaseConfig; 