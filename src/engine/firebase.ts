/**
 * NEXORA — Firebase Authentication & Service Module
 * Connects Firebase Auth (Google OAuth, Phone OTP, Email/Password)
 * with seamless local storage sync for NEXORA user profiles.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  type ConfirmationResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "your_firebase_api_key_here" && 
  firebaseConfig.apiKey.length > 10
);

// Initialize Firebase App & Auth safely (only if configured)
let app: any = null;
let auth: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (e) {
    console.warn('Firebase initialization skipped:', e);
  }
}

export { app, auth, googleProvider };

/** Sign in with Google Popup via Firebase */
export async function firebaseSignInWithGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/** Setup Recaptcha for Phone Auth */
export function setupRecaptcha(containerId: string) {
  if (!isFirebaseConfigured) return null;
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    }
  });
}

/** Send SMS OTP via Firebase Phone Auth */
export async function firebaseSendPhoneOTP(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  if (!isFirebaseConfigured) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }
  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

/** Firebase Email Sign Up */
export async function firebaseSignUpWithEmail(email: string, pass: string) {
  if (!isFirebaseConfigured) throw new Error('FIREBASE_NOT_CONFIGURED');
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

/** Firebase Email Sign In */
export async function firebaseSignInWithEmail(email: string, pass: string) {
  if (!isFirebaseConfigured) throw new Error('FIREBASE_NOT_CONFIGURED');
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

/** Sign Out from Firebase */
export async function firebaseSignOutUser() {
  if (isFirebaseConfigured) {
    await firebaseSignOut(auth);
  }
}
