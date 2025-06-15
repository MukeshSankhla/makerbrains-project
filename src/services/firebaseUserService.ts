import { doc, setDoc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  displayName?: string;
  photoURL?: string;
  backgroundURL?: string;
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
      backgroundURL: '', // set empty by default
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
  const photoRef = ref(storage, `users/${uid}/profile_photo.jpg`);
  await uploadBytes(photoRef, file);
  const url = await getDownloadURL(photoRef);
  await updateUserProfile(uid, { photoURL: url });
  return url;
};

export const uploadProfileBackground = async (uid: string, file: File) => {
  const bgRef = ref(storage, `users/${uid}/background_photo.jpg`);
  await uploadBytes(bgRef, file);
  const url = await getDownloadURL(bgRef);
  await updateUserProfile(uid, { backgroundURL: url });
  return url;
};

// Admin: List all users
export const listAllUsers = async (): Promise<UserProfile[]> => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => doc.data() as UserProfile);
};
