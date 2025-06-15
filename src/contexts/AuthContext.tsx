
import React, { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { UserProfile } from '@/services/firebaseUserService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
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
  userProfile: null,
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuth();
  
  const isAdmin = auth.userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      ...auth,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
