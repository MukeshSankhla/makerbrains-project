
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/services/firebaseUserService";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const ROLES = ["user", "admin"];

interface UserRow {
  uid: string;
  email: string;
  fullName: string;
  role: string;
  photoURL?: string;
}

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<UserRow>>({});

  useEffect(() => {
    if (!isAdmin) return;
    // Fetch all users from Firestore
    const fetchUsers = async () => {
      const usersCol = collection(db, "users");
      const snap = await getDocs(usersCol);
      const usersList: UserRow[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        usersList.push({
          uid: data.uid,
          email: data.email,
          fullName: data.fullName || "",
          role: data.role || "user",
          photoURL: data.photoURL || "",
        });
      });
      setUsers(usersList);
    };

    fetchUsers();
  }, [isAdmin]);

  const handleEdit = (i: number) => {
    setEditIndex(i);
    setEditData(users[i]);
  };

  const handleChange = (field: keyof UserRow, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (uid: string) => {
    try {
      await updateUserProfile(uid, {
        fullName: editData.fullName,
        role: editData.role,
      });
      setUsers(users =>
        users.map(u =>
          u.uid === uid ? { ...u, fullName: editData.fullName!, role: editData.role! } : u
        )
      );
      setEditIndex(null);
      toast({ title: "User updated successfully" });
    } catch {
      toast({ title: "Failed to update user", variant: "destructive" });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg text-red-500 font-semibold">Admins only.</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-2">Avatar</th>
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Email</th>
                <th className="py-2 px-2">Role</th>
                <th className="py-2 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) =>
                editIndex === i ? (
                  <tr key={u.uid} className="border-b bg-muted/50">
                    <td className="py-1 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={u.photoURL} alt={u.fullName} />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="py-1 px-2">
                      <Input
                        value={editData.fullName || ""}
                        onChange={e => handleChange("fullName", e.target.value)}
                        className="h-8"
                      />
                    </td>
                    <td className="py-1 px-2">{u.email}</td>
                    <td className="py-1 px-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={editData.role}
                        onChange={e => handleChange("role", e.target.value)}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-1 px-2 text-center">
                      <Button size="sm" onClick={() => handleSave(u.uid)} className="mr-2">
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditIndex(null)}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={u.uid} className="border-b">
                    <td className="py-1 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={u.photoURL} alt={u.fullName} />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="py-1 px-2">{u.fullName}</td>
                    <td className="py-1 px-2">{u.email}</td>
                    <td className="py-1 px-2 font-mono">{u.role}</td>
                    <td className="py-1 px-2 text-center">
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(i)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
