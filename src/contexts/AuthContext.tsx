
import React, { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithGithub: () => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
  resetPassword: async () => {},
  logout: async () => {},
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

// Admin emails - in a real app, this would be stored in Firestore
const ADMIN_EMAILS = [
  'admin@makerbrains.com',
  // Add your admin emails here
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuth();
  
  const isAdmin = auth.user ? ADMIN_EMAILS.includes(auth.user.email || '') : false;

  return (
    <AuthContext.Provider value={{
      ...auth,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
