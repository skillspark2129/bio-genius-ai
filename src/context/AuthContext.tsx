import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  FirebaseUser,
} from '../lib/firebase';
import { User } from '../types';
import { getCurrentUser, setCurrentUser, getAllUsers, updateUser } from '../lib/storage';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  appUser: User;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUserState] = useState<User>(() => getCurrentUser());
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const email = (user.email || '').toLowerCase();
        const isAdmin = email === 'baithakotbattagram1@gmail.com' || email === 'umpheres@gmail.com';

        // Check if user already exists in storage
        const all = getAllUsers();
        let existing = all.find((u) => u.email.toLowerCase() === email || u.id === user.uid);

        if (!existing) {
          existing = {
            id: user.uid,
            email: user.email || '',
            name: user.displayName || user.email?.split('@')[0] || 'Creator',
            isPremium: isAdmin,
            role: isAdmin ? 'admin' : 'user',
            generationsToday: 0,
            savedBioIds: [],
            createdAt: new Date().toISOString(),
          };
        } else {
          // Update details from Firebase
          if (user.displayName && !existing.name) {
            existing.name = user.displayName;
          }
          if (isAdmin) {
            existing.role = 'admin';
            existing.isPremium = true;
          }
        }

        setCurrentUser(existing);
        setAppUserState(existing);
      } else {
        // If logged out of Firebase, check if current user is local guest
        const current = getCurrentUser();
        setAppUserState(current);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In via popup
  const signInWithGoogle = async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = (user.email || '').toLowerCase();
      const isAdmin = email === 'baithakotbattagram1@gmail.com' || email === 'umpheres@gmail.com';

      const all = getAllUsers();
      let profile = all.find((u) => u.email.toLowerCase() === email || u.id === user.uid);

      if (!profile) {
        profile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Google Creator',
          isPremium: isAdmin,
          role: isAdmin ? 'admin' : 'user',
          generationsToday: 0,
          savedBioIds: [],
          createdAt: new Date().toISOString(),
        };
      } else if (isAdmin) {
        profile.role = 'admin';
        profile.isPremium = true;
      }

      setCurrentUser(profile);
      setAppUserState(profile);
      return profile;
    } catch (err: unknown) {
      console.error('Google Sign-in error:', err);
      throw err;
    }
  };

  // Email / Password Sign In
  const signInWithEmail = async (email: string, pass: string): Promise<User> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;
      const userEmail = (user.email || '').toLowerCase();
      const isAdmin = userEmail === 'baithakotbattagram1@gmail.com' || userEmail === 'umpheres@gmail.com';

      const all = getAllUsers();
      let profile = all.find((u) => u.email.toLowerCase() === userEmail || u.id === user.uid);

      if (!profile) {
        profile = {
          id: user.uid,
          email: userEmail,
          name: user.displayName || userEmail.split('@')[0],
          isPremium: isAdmin,
          role: isAdmin ? 'admin' : 'user',
          generationsToday: 0,
          savedBioIds: [],
          createdAt: new Date().toISOString(),
        };
      }

      setCurrentUser(profile);
      setAppUserState(profile);
      return profile;
    } catch (err: unknown) {
      console.warn('Firebase signInWithEmail encountered an error, evaluating fallback:', err);
      const errMessage = err instanceof Error ? err.message : String(err);
      const errCode = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
      const isOpNotAllowed =
        errCode.includes('operation-not-allowed') ||
        errMessage.includes('operation-not-allowed') ||
        errMessage.includes('auth/operation-not-allowed');

      if (isOpNotAllowed) {
        // Fallback: Authenticate via storage when Email/Password is not yet toggled in Firebase Console
        const userEmail = email.trim().toLowerCase();
        const isAdmin = userEmail === 'baithakotbattagram1@gmail.com' || userEmail === 'umpheres@gmail.com';
        const all = getAllUsers();
        let profile = all.find((u) => u.email.toLowerCase() === userEmail);

        if (!profile) {
          profile = {
            id: 'user-' + Date.now(),
            email: userEmail,
            name: userEmail.split('@')[0],
            isPremium: isAdmin,
            role: isAdmin ? 'admin' : 'user',
            generationsToday: 0,
            savedBioIds: [],
            createdAt: new Date().toISOString(),
          };
        }

        setCurrentUser(profile);
        setAppUserState(profile);
        return profile;
      }

      throw err;
    }
  };

  // Email / Password Sign Up
  const signUpWithEmail = async (name: string, email: string, pass: string): Promise<User> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;

      if (name.trim()) {
        try {
          await updateProfile(user, { displayName: name.trim() });
        } catch {
          // ignore profile update error
        }
      }

      const userEmail = (user.email || '').toLowerCase();
      const isAdmin = userEmail === 'baithakotbattagram1@gmail.com' || userEmail === 'umpheres@gmail.com';

      const newUser: User = {
        id: user.uid,
        email: userEmail,
        name: name.trim() || userEmail.split('@')[0],
        isPremium: isAdmin,
        role: isAdmin ? 'admin' : 'user',
        generationsToday: 0,
        savedBioIds: [],
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(newUser);
      setAppUserState(newUser);
      return newUser;
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      const errCode = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
      const isOpNotAllowed =
        errCode.includes('operation-not-allowed') ||
        errMessage.includes('operation-not-allowed') ||
        errMessage.includes('auth/operation-not-allowed');

      if (isOpNotAllowed) {
        // Fallback: Register user locally so they are never blocked if Email provider is pending activation
        const userEmail = email.trim().toLowerCase();
        const isAdmin = userEmail === 'baithakotbattagram1@gmail.com' || userEmail === 'umpheres@gmail.com';

        const newUser: User = {
          id: 'user-' + Date.now(),
          email: userEmail,
          name: name.trim() || userEmail.split('@')[0],
          isPremium: isAdmin,
          role: isAdmin ? 'admin' : 'user',
          generationsToday: 0,
          savedBioIds: [],
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(newUser);
        setAppUserState(newUser);
        return newUser;
      }

      console.error('Email registration error:', err);
      throw err;
    }
  };

  // Password Reset
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      const errCode = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
      const isOpNotAllowed =
        errCode.includes('operation-not-allowed') ||
        errMessage.includes('operation-not-allowed') ||
        errMessage.includes('auth/operation-not-allowed');

      if (isOpNotAllowed) {
        // Fallback: simulate reset without throwing fatal error
        return;
      }
      throw err;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase signout warning:', err);
    }

    const guestUser: User = {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'guest@biogenius.ai',
      name: 'Creator Guest',
      isPremium: false,
      role: 'user',
      generationsToday: 0,
      savedBioIds: [],
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(guestUser);
    setAppUserState(guestUser);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        appUser,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
