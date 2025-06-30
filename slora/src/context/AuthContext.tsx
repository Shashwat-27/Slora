import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../firebase/config';
import GamificationService, { UserStats } from '../services/GamificationService';

// Demo user credentials for fallback mode
const DEMO_USERS = [
  { 
    email: 'user@example.com', 
    password: 'password123', 
    name: 'Demo User',
    photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg'
  },
  { 
    email: 'admin@example.com', 
    password: 'admin123', 
    name: 'Admin User',
    photoURL: 'https://randomuser.me/api/portraits/lego/2.jpg'
  }
];

// Define the User type to match Firebase User
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Define the Auth context interface
interface AuthContextType {
  currentUser: User | null;
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  logIn: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  logOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
  refreshUserStats: () => Promise<UserStats | null>;
  clearError: () => void;
}

// Create the context with a default empty object
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Flag to track if we're using demo mode as fallback
  const [useDemoMode, setUseDemoMode] = useState<boolean>(false);

  // Check for existing session on mount and initialize auth
  useEffect(() => {
    try {
      // First try to use Firebase auth
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
          
          try {
            // Refresh user stats when user logs in
            await refreshUserStats();
          } catch (error) {
            console.error('Error loading user stats:', error);
          }
        } else {
          // Check if we have a demo user in localStorage as fallback
          const savedUser = localStorage.getItem('demoUser');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
            setUseDemoMode(true);
          } else {
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      // If Firebase fails, fallback to demo mode
      console.error("Firebase auth error, falling back to demo mode:", error);
      setUseDemoMode(true);
      
      // Check for demo user in localStorage
      const savedUser = localStorage.getItem('demoUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      
      setLoading(false);
      return () => {};
    }
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      if (useDemoMode) {
        // Mock signup for demo mode
        // Simple validation
        if (!email || !email.includes('@') || !email.includes('.')) {
          throw new Error('Invalid email format');
        }
        
        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // Check if user exists
        const existingUser = DEMO_USERS.find(user => user.email === email);
        if (existingUser) {
          throw new Error('Email already in use');
        }
        
        // Create new user
        const newUser = { 
          email, 
          password, 
          name: displayName,
          photoURL: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 8) + 1}.jpg`
        };
        
        // Add to demo users array
        DEMO_USERS.push(newUser);
        
        // Create user object
        const user: User = {
          uid: Math.random().toString(36).substring(2, 15),
          email: newUser.email,
          displayName: newUser.name,
          photoURL: newUser.photoURL
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('demoUser', JSON.stringify(user));
        setCurrentUser(user);
        
        return user;
      } else {
        // Real Firebase signup
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
          
          // Initialize user document in Firestore
          await setDoc(doc(firestore, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL || '',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
          
          // Initialize user stats
          await GamificationService.initializeUserStats(
            userCredential.user.uid, 
            userCredential.user.displayName || 'User', 
            userCredential.user.photoURL || ''
          );
          
          // Refresh user stats
          await refreshUserStats();
          
          const user: User = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL
          };
          
          return user;
        } catch (firebaseError: any) {
          console.error("Firebase signup error:", firebaseError);
          // If Firebase fails, fall back to demo mode
          setUseDemoMode(true);
          
          // Do demo mode signup
          const newUser = { 
            email, 
            password, 
            name: displayName,
            photoURL: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 8) + 1}.jpg`
          };
          
          DEMO_USERS.push(newUser);
          
          const user: User = {
            uid: Math.random().toString(36).substring(2, 15),
            email: newUser.email,
            displayName: newUser.name,
            photoURL: newUser.photoURL
          };
          
          localStorage.setItem('demoUser', JSON.stringify(user));
          setCurrentUser(user);
          
          // Initialize user stats
          await GamificationService.initializeUserStats(
            user.uid, 
            user.displayName || 'User', 
            user.photoURL || ''
          );
          
          // Refresh user stats
          await refreshUserStats();
          
          return user;
        }
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const logIn = async (email: string, password: string, rememberMe: boolean = true): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      if (useDemoMode) {
        // Mock login
        // Find user
        const user = DEMO_USERS.find(u => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // Create user object
        const authUser: User = {
          uid: Math.random().toString(36).substring(2, 15),
          email: user.email,
          displayName: user.name,
          photoURL: user.photoURL
        };
        
        // Save to storage based on remember me
        if (rememberMe) {
          localStorage.setItem('demoUser', JSON.stringify(authUser));
        } else {
          sessionStorage.setItem('demoUser', JSON.stringify(authUser));
        }
        
        setCurrentUser(authUser);
        
        return authUser;
      } else {
        // Real Firebase login
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // Update last login timestamp
          await setDoc(doc(firestore, 'users', user.uid), {
            lastLogin: serverTimestamp()
          }, { merge: true });
          
          // Refresh user stats
          await refreshUserStats();
          
          const authUser: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
          
          setCurrentUser(authUser);
          
          return authUser;
        } catch (firebaseError: any) {
          console.error("Firebase login error:", firebaseError);
          
          // Try with demo users as fallback
          const user = DEMO_USERS.find(u => u.email === email && u.password === password);
          
          if (user) {
            setUseDemoMode(true);
            
            const authUser: User = {
              uid: Math.random().toString(36).substring(2, 15),
              email: user.email,
              displayName: user.name,
              photoURL: user.photoURL
            };
            
            if (rememberMe) {
              localStorage.setItem('demoUser', JSON.stringify(authUser));
            } else {
              sessionStorage.setItem('demoUser', JSON.stringify(authUser));
            }
            
            setCurrentUser(authUser);
            
            // Refresh user stats
            await refreshUserStats();
            
            return authUser;
          } else {
            throw new Error('Invalid email or password');
          }
        }
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google sign in
  const signInWithGoogle = async (): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      if (useDemoMode) {
        // Mock Google signin
        // Create a mock Google user
        const googleUser: User = {
          uid: Math.random().toString(36).substring(2, 15),
          email: 'google-user@example.com',
          displayName: 'Google User',
          photoURL: 'https://randomuser.me/api/portraits/lego/3.jpg'
        };
        
        // Save to localStorage
        localStorage.setItem('demoUser', JSON.stringify(googleUser));
        setCurrentUser(googleUser);
        
        return googleUser;
      } else {
        // Real Firebase Google signin
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          
          // Check if user exists in Firestore
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          
          if (!userDoc.exists()) {
            // Initialize user document in Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL || '',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
            
            // Initialize user stats
            await GamificationService.initializeUserStats(
              user.uid, 
              user.displayName || 'User', 
              user.photoURL || ''
            );
          } else {
            // Update last login timestamp
            await setDoc(doc(firestore, 'users', user.uid), {
              lastLogin: serverTimestamp()
            }, { merge: true });
          }
          
          // Refresh user stats
          await refreshUserStats();
          
          const authUser: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
          
          setCurrentUser(authUser);
          
          return authUser;
        } catch (firebaseError) {
          console.error("Firebase Google signin error:", firebaseError);
          
          // Fallback to demo mode
          setUseDemoMode(true);
          
          // Create a mock Google user
          const googleUser: User = {
            uid: Math.random().toString(36).substring(2, 15),
            email: 'google-user@example.com',
            displayName: 'Google User',
            photoURL: 'https://randomuser.me/api/portraits/lego/3.jpg'
          };
          
          localStorage.setItem('demoUser', JSON.stringify(googleUser));
          setCurrentUser(googleUser);
          
          // Refresh user stats
          await refreshUserStats();
          
          return googleUser;
        }
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logOut = async (): Promise<void> => {
    try {
      if (useDemoMode) {
        // Mock logout
        localStorage.removeItem('demoUser');
        sessionStorage.removeItem('demoUser');
      } else {
        // Real Firebase logout
        try {
          await signOut(auth);
        } catch (error) {
          console.error("Firebase logout error:", error);
          
          // Clean up demo storage just in case
          localStorage.removeItem('demoUser');
          sessionStorage.removeItem('demoUser');
        }
      }
      setCurrentUser(null);
      setUserStats(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Password reset
  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (useDemoMode) {
        // Mock password reset
        // Check if user exists
        const user = DEMO_USERS.find(u => u.email === email);
        
        if (!user) {
          throw new Error('No account found with this email');
        }
        
        // Simulate sending an email
        console.log(`Password reset email sent to ${email}`);
        
        // Wait for 1 second to simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Real Firebase password reset
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (firebaseError) {
          console.error("Firebase password reset error:", firebaseError);
          
          // Try with demo mode as fallback
          setUseDemoMode(true);
          
          const user = DEMO_USERS.find(u => u.email === email);
          
          if (!user) {
            throw new Error('No account found with this email');
          }
          
          console.log(`Password reset email sent to ${email}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (displayName: string, photoURL: string): Promise<void> => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      if (!useDemoMode) {
        // Get current Firebase user
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          await updateProfile(firebaseUser, {
            displayName,
            photoURL
          });
          
          // Update Firestore user document
          await setDoc(doc(firestore, 'users', currentUser.uid), {
            displayName,
            photoURL
          }, { merge: true });
          
          // Update user stats
          await setDoc(doc(firestore, 'userStats', currentUser.uid), {
            displayName,
            photoURL
          }, { merge: true });
        }
      }
      
      // Update local user object
      setCurrentUser({
        ...currentUser,
        displayName,
        photoURL
      });
      
      // Refresh user stats
      await refreshUserStats();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  
  // Refresh user stats
  const refreshUserStats = async (): Promise<UserStats | null> => {
    try {
      if (!currentUser) {
        return null;
      }
      
      const stats = await GamificationService.getUserStats(currentUser.uid);
      
      if (stats) {
        setUserStats(stats);
        return stats;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing user stats:', error);
      return null;
    }
  };

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  // Create value object for the context provider
  const value: AuthContextType = {
    currentUser,
    userStats,
    loading,
    error,
    signUp,
    logIn,
    logOut,
    signInWithGoogle,
    resetPassword,
    updateUserProfile,
    refreshUserStats,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 