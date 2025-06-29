import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

// Demo Firebase configuration for testing
// In production, replace with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Create a mock user for demo purposes
const createMockUser = (email: string, displayName: string): User => {
  return {
    uid: 'demo-user-id-' + Date.now(),
    email,
    displayName,
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    providerData: [],
    refreshToken: 'demo-refresh-token',
    tenantId: null,
    phoneNumber: null,
    providerId: 'password',
    delete: async () => {},
    getIdToken: async () => 'demo-token',
    getIdTokenResult: async () => ({ authTime: '', issuedAtTime: '', signInProvider: null, claims: {}, expirationTime: '', token: 'demo-token' }),
    reload: async () => {},
    toJSON: () => ({}),
    updateEmail: async () => {},
    updatePassword: async () => {},
    updatePhoneNumber: async () => {},
    updateProfile: async () => {},
    linkWithCredential: async () => ({ user: null, credential: null, operationType: 'link' }),
    linkWithPopup: async () => ({ user: null, credential: null, operationType: 'link' }),
    linkWithRedirect: async () => {},
    reauthenticateWithCredential: async () => ({ user: null, credential: null, operationType: 'reauthenticate' }),
    reauthenticateWithPopup: async () => ({ user: null, credential: null, operationType: 'reauthenticate' }),
    reauthenticateWithRedirect: async () => {},
    sendEmailVerification: async () => {},
    unlink: async () => null,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
      lastRefreshTime: new Date().toISOString()
    }
  } as unknown as User;
};

// Authentication functions
export const signInWithEmail = async (email: string, password: string) => {
  try {
    // For demo purposes, allow any email/password combination
    // In production, this will use real Firebase authentication
    if (email && password) {
      // Simulate successful authentication
      const mockUser = createMockUser(email, email.split('@')[0]);
      
      // Store demo user data
      localStorage.setItem('mediprior_token', 'demo-token');
      localStorage.setItem('mediprior_user', JSON.stringify({
        name: mockUser.displayName,
        email: mockUser.email,
        role: 'Patient',
        avatar: null,
        lastLogin: new Date().toISOString(),
        sessions: 1,
        joinDate: new Date().toISOString()
      }));
      
      return { user: mockUser, error: null };
    } else {
      return { user: null, error: 'Please enter email and password' };
    }
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    // For demo purposes, allow any email/password combination
    // In production, this will use real Firebase authentication
    if (email && password && password.length >= 6) {
      // Simulate successful registration
      const mockUser = createMockUser(email, email.split('@')[0]);
      
      // Store demo user data
      localStorage.setItem('mediprior_token', 'demo-token');
      localStorage.setItem('mediprior_user', JSON.stringify({
        name: mockUser.displayName,
        email: mockUser.email,
        role: 'Patient',
        avatar: null,
        lastLogin: new Date().toISOString(),
        sessions: 1,
        joinDate: new Date().toISOString()
      }));
      
      return { user: mockUser, error: null };
    } else {
      return { user: null, error: 'Please enter valid email and password (min 6 characters)' };
    }
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    // Clear demo user data
    localStorage.removeItem('mediprior_token');
    localStorage.removeItem('mediprior_user');
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // For demo purposes, check localStorage for existing session
  const token = localStorage.getItem('mediprior_token');
  const userData = localStorage.getItem('mediprior_user');
  
  if (token && userData) {
    const userInfo = JSON.parse(userData);
    const mockUser = createMockUser(userInfo.email, userInfo.name);
    callback(mockUser);
  } else {
    callback(null);
  }
  
  // Return a cleanup function
  return () => {};
};

export default app; 