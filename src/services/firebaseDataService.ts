
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query, 
  where,
  Timestamp,
  Query,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Interface definitions
export interface Magazine {
  id: string;
  title: string;
  image_url: string;
  website_url: string;
}

export interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  website_url: string;
}

export interface Achievement {
  id: string;
  year: number;
  title: string;
  link: string;
  icon: string;
}

export interface Recognition {
  id: string;
  year: number;
  title: string;
  link: string;
}

export interface Project {
  id: string;
  author: string;
  content?: string;
  date: string;
  description: string;
  image: string;
  title: string;
  url?: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  difficulty: string;
}

// Generic CRUD operations
export const createDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

export const getAllDocuments = async (collectionName: string, orderByField?: string) => {
  try {
    const collectionRef = collection(db, collectionName);
    let queryRef: Query<DocumentData> | CollectionReference<DocumentData> = collectionRef;
    
    if (orderByField) {
      queryRef = query(collectionRef, orderBy(orderByField, 'desc'));
    }
    
    const querySnapshot = await getDocs(queryRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    throw error;
  }
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return { id, ...data };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Specific service functions
export const magazineService = {
  getAll: () => getAllDocuments('magazines'),
  create: (data: Omit<Magazine, 'id'>) => createDocument('magazines', data),
  update: (id: string, data: Partial<Magazine>) => updateDocument('magazines', id, data),
  delete: (id: string) => deleteDocument('magazines', id)
};

export const sponsorService = {
  getAll: () => getAllDocuments('sponsors'),
  create: (data: Omit<Sponsor, 'id'>) => createDocument('sponsors', data),
  update: (id: string, data: Partial<Sponsor>) => updateDocument('sponsors', id, data),
  delete: (id: string) => deleteDocument('sponsors', id)
};

export const achievementService = {
  getAll: () => getAllDocuments('achievements', 'year'),
  create: (data: Omit<Achievement, 'id'>) => createDocument('achievements', data),
  update: (id: string, data: Partial<Achievement>) => updateDocument('achievements', id, data),
  delete: (id: string) => deleteDocument('achievements', id)
};

export const recognitionService = {
  getAll: () => getAllDocuments('recognitions', 'year'),
  create: (data: Omit<Recognition, 'id'>) => createDocument('recognitions', data),
  update: (id: string, data: Partial<Recognition>) => updateDocument('recognitions', id, data),
  delete: (id: string) => deleteDocument('recognitions', id)
};

export const projectService = {
  getAll: () => getAllDocuments('projects', 'date'),
  create: (data: Omit<Project, 'id'>) => createDocument('projects', data),
  update: (id: string, data: Partial<Project>) => updateDocument('projects', id, data),
  delete: (id: string) => deleteDocument('projects', id)
};

export const workshopService = {
  getAll: () => getAllDocuments('workshops', 'date'),
  create: (data: Omit<Workshop, 'id'>) => createDocument('workshops', data),
  update: (id: string, data: Partial<Workshop>) => updateDocument('workshops', id, data),
  delete: (id: string) => deleteDocument('workshops', id)
};
