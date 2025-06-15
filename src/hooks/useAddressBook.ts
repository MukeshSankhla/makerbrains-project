
import { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, where, query } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/types/address";

export function useAddressBook() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  useEffect(() => {
    if (!user) {
      setAddresses([]);
      return;
    }
    const q = query(collection(db, "addresses"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setAddresses(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Address)));
    });
    return unsub;
  }, [user]);
  // CRUD
  const addAddress = async (data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    await addDoc(collection(db, "addresses"), {
      ...data,
      userId: user.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };
  const updateAddress = async (id: string, data: Partial<Address>) => {
    await updateDoc(doc(db, "addresses", id), {
      ...data,
      updatedAt: Date.now(),
    });
  };
  const removeAddress = async (id: string) => {
    await deleteDoc(doc(db, "addresses", id));
  };
  return { addresses, addAddress, updateAddress, removeAddress };
}
