import { FirebaseApp, initializeApp, getApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Database, getDatabase } from 'firebase/database';
import { FirebaseStorage, getStorage } from 'firebase/storage';

// Firebase configuration with hardcoded values for consistency
const firebaseConfig = {
  apiKey: "AIzaSyDzGfFsG94BItoSHLkRNXPYP1xlJGP6wWk",
  authDomain: "slora-study.firebaseapp.com",
  projectId: "slora-study",
  storageBucket: "slora-study.appspot.com",
  messagingSenderId: "307218239987",
  appId: "1:307218239987:web:9f17f6b1c9fa5a3c3e11c7",
  measurementId: "G-DWNZ7QRXDG",
  databaseURL: "https://slora-study-default-rtdb.firebaseio.com"
};

// Initialize Firebase only if it hasn't been initialized already
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the existing app if it's already initialized
}

// Initialize services
const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);
const database: Database = getDatabase(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, firestore, database, storage };

// Define interface for export
interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  database: Database;
  storage: FirebaseStorage;
}

// Default export for backward compatibility
const services: FirebaseServices = { app, auth, firestore, database, storage };
export default services; 