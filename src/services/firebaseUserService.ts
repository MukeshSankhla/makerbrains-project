import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  displayName?: string;
  photoURL?: string;
  info?: string;
  address?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export const createUserProfile = async (user: User, additionalData: Partial<UserProfile> = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    const { displayName, email, photoURL } = user;
    const defaultRole = email === 'admin@makerbrains.com' ? 'admin' : 'user'; // You can modify this logic
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: email || '',
      fullName: displayName || '',
      displayName,
      photoURL,
      info: '',
      address: '',
      socialMedia: {},
      role: defaultRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...additionalData,
    };

    try {
      await setDoc(userRef, userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }
  
  return userSnapshot.data() as UserProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const updateUserRole = async (uid: string, role: 'admin' | 'user') => {
  try {
    await updateUserProfile(uid, { role });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Cloud Storage helpers (assuming Firebase Storage configured elsewhere):
export const uploadProfilePhoto = async (uid: string, file: File) => {
  // Replace with your actual storage logic; placeholder implementation
  // Assume returns the URL of the uploaded image.
  // To be replaced with Firebase Storage SDK or API endpoint call.
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 600);
  });
};

export const uploadProfileBackground = async (uid: string, file: File) => {
  // Replace with actual upload logic; placeholder implementation.
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 600);
  });
};
