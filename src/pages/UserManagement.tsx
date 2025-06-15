
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { listAllUsers, updateUserProfile } from "@/services/firebaseUserService";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function UserManagement() {
  const { userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    listAllUsers().then(setUsers);
  }, [isAdmin, navigate]);

  const handleEdit = (u: any) => {
    setEditingUserId(u.uid);
    setForm({
      fullName: u.fullName || "",
      email: u.email || "",
      role: u.role || "user",
    });
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setForm({});
  };

  const handleSave = async (uid: string) => {
    await updateUserProfile(uid, {
      fullName: form.fullName,
      // Can add more fields here...
      role: form.role,
    });
    toast({ title: "User updated" });
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, ...form } : u))
    );
    setEditingUserId(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead>
                <tr className="text-sm text-muted-foreground">
                  <th className="py-2 px-3">Full Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid} className="border-t">
                    <td className="py-2 px-3">
                      {editingUserId === u.uid ? (
                        <Input value={form.fullName}
                               onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))} />
                      ) : (
                        u.fullName
                      )}
                    </td>
                    <td className="py-2 px-3">{u.email}</td>
                    <td className="py-2 px-3">
                      {editingUserId === u.uid ? (
                        <Select value={form.role}
                                onValueChange={(v) => setForm(f => ({ ...f, role: v }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="capitalize">{u.role}</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {editingUserId === u.uid ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave(u.uid)}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(u)}>
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
