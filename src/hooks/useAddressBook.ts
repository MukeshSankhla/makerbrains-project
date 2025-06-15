
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebase";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import type { Address } from "@/types/address";

const useAddressBook = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchAddresses();
    else setAddresses([]);
    // eslint-disable-next-line
  }, [user?.uid]);

  const fetchAddresses = async () => {
    if (!user) return;
    setLoading(true);
    const snap = await getDocs(collection(db, "users", user.uid, "addresses"));
    const addrs = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Address));
    setAddresses(addrs);
    setLoading(false);
  };

  const addAddress = async (address: Omit<Address, "id" | "updatedAt">) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "addresses"), {
      ...address,
      updatedAt: Date.now(),
    });
    fetchAddresses();
  };

  const updateAddress = async (id: string, address: Omit<Address, "id" | "updatedAt">) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "addresses", id), {
      ...address,
      updatedAt: Date.now(),
    });
    fetchAddresses();
  };

  const deleteAddress = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "addresses", id));
    fetchAddresses();
  };

  return { addresses, addAddress, updateAddress, deleteAddress, loading, fetchAddresses };
};

export default useAddressBook;
