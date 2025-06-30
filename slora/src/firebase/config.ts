import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZh6Uli9dy_nLXjRWWYwkybw-jpKRYO20",
  authDomain: "slora-demo-app.firebaseapp.com",
  projectId: "slora-demo-app",
  storageBucket: "slora-demo-app.appspot.com",
  messagingSenderId: "550475674324",
  appId: "1:550475674324:web:e7acad3d4ef9e5be788d13",
  databaseURL: "https://slora-demo-app-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, firestore, database, storage };

// Default export for backward compatibility
export default { app, auth, firestore, database, storage };
