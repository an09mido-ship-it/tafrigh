import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testFirestoreConnection } from '../firebase';
import { AppUser, UserRole, UserStatus } from '../types/user';

export function isDefaultAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  const compact = normalized.replace(/\s+/g, '');
  return (
    compact === 'ahmedschoolp@gmail.com' ||
    normalized === 'ahmed schoolp@gmail.com'
  );
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: AppUser | null;
  isAdmin: boolean;
  isBlocked: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserStatus: (targetUid: string, status: UserStatus, reason?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and test connection on mount
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!user) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const isConfiguredAdmin = isDefaultAdminEmail(user.email);

      try {
        // Sync or register user profile
        const snap = await getDoc(userDocRef);
        const now = new Date().toISOString();

        if (!snap.exists()) {
          const initialRole: UserRole = isConfiguredAdmin ? 'admin' : 'user';
          const newProfile: AppUser = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'مستخدم',
            photoURL: user.photoURL || null,
            role: initialRole,
            status: 'active',
            createdAt: now,
            lastLoginAt: now,
            blockedAt: null,
            blockedReason: null,
          };

          await setDoc(userDocRef, newProfile);

          if (initialRole === 'admin') {
            const adminDocRef = doc(db, 'admins', user.uid);
            await setDoc(adminDocRef, {
              email: user.email || '',
              addedAt: now,
            });
          }

          setUserProfile(newProfile);
        } else {
          // Existing profile
          const existingData = snap.data() as AppUser;
          const updates: Partial<AppUser> = {
            lastLoginAt: now,
          };

          if (isConfiguredAdmin && existingData.role !== 'admin') {
            updates.role = 'admin';
            const adminDocRef = doc(db, 'admins', user.uid);
            await setDoc(adminDocRef, {
              email: user.email || '',
              addedAt: now,
            });
          } else if (!isConfiguredAdmin && existingData.role === 'admin') {
            updates.role = 'user';
          }

          if (user.displayName && user.displayName !== existingData.displayName) {
            updates.displayName = user.displayName;
          }
          if (user.photoURL && user.photoURL !== existingData.photoURL) {
            updates.photoURL = user.photoURL;
          }

          await updateDoc(userDocRef, updates);
        }
      } catch (err) {
        console.warn('Profile synchronization notice:', err);
      }

      // Realtime listener for active user profile to detect live block/unblock changes
      unsubscribeSnapshot = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const profile = docSnap.data() as AppUser;
            setUserProfile(profile);
          } else {
            // Document doesn't exist yet, provide default active profile
            setUserProfile({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'مستخدم',
              photoURL: user.photoURL || null,
              role: isConfiguredAdmin ? 'admin' : 'user',
              status: 'active',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            });
          }
          setIsLoading(false);
        },
        (error) => {
          console.warn('Profile listener notice:', error);
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'مستخدم',
            photoURL: user.photoURL || null,
            role: isConfiguredAdmin ? 'admin' : 'user',
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          });
          setIsLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (error: any) {
      console.error('Email Sign In error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
    } catch (error: any) {
      console.error('Email Sign Up error:', error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error: any) {
      console.error('Sign Out error:', error);
      throw error;
    }
  };

  const updateUserStatus = async (targetUid: string, status: UserStatus, reason?: string) => {
    if (!isAdmin) {
      throw new Error('غير مصرح لك بتعديل حالة المستخدمين. هذه الصلاحية لمدير النظام فقط.');
    }

    const userDocRef = doc(db, 'users', targetUid);
    const updates: Partial<AppUser> = {
      status,
      blockedAt: status === 'blocked' ? new Date().toISOString() : null,
      blockedReason: status === 'blocked' ? (reason || 'تم الحظر بواسطة المشرف') : null,
    };

    try {
      await updateDoc(userDocRef, updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const isAdmin = Boolean(isDefaultAdminEmail(currentUser?.email));

  const isBlocked = Boolean(userProfile?.status === 'blocked');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        isBlocked,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logout,
        updateUserStatus,
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
