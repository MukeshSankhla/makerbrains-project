
import useAddressBook from "@/hooks/useAddressBook";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Address } from "@/types/address";
import { Input } from "@/components/ui/input";

export default function AddressBook() {
  const { addresses, addAddress, updateAddress, deleteAddress, loading } = useAddressBook();
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<Partial<Address>>({});

  const handleEdit = (addr: Address) => {
    setEditing(addr);
    setForm(addr);
  };

  const handleAddOrUpdate = async () => {
    if (editing) {
      await updateAddress(editing.id, { ...form, label: form.label || "" } as any);
      setEditing(null);
    } else {
      await addAddress({ ...form, label: form.label || "" } as any);
    }
    setForm({});
  };

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Your Addresses</h2>
      {/* Address Form */}
      <div className="space-y-2 mb-8">
        <Input
          placeholder="Label (Home, Office)"
          value={form.label || ""}
          onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
        />
        <Input
          placeholder="Address Line 1"
          value={form.line1 || ""}
          onChange={e => setForm(f => ({ ...f, line1: e.target.value }))}
        />
        <Input
          placeholder="Line 2"
          value={form.line2 || ""}
          onChange={e => setForm(f => ({ ...f, line2: e.target.value }))}
        />
        <Input
          placeholder="City"
          value={form.city || ""}
          onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
        />
        <Input
          placeholder="State"
          value={form.state || ""}
          onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
        />
        <Input
          placeholder="PIN/ZIP"
          value={form.zip || ""}
          onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
        />
        <Input
          placeholder="Country"
          value={form.country || ""}
          onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
        />
        <Button onClick={handleAddOrUpdate} disabled={loading}>
          {editing ? "Update" : "Add"} Address
        </Button>
        {editing && (
          <Button onClick={() => { setEditing(null); setForm({}); }} variant="outline" className="ml-2">
            Cancel
          </Button>
        )}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {addresses.map(addr => (
            <li key={addr.id} className="border rounded p-3 flex items-center justify-between gap-4">
              <span>
                <b>{addr.label}: </b>
                {addr.line1}, {addr.line2 && addr.line2 + ", "}
                {addr.city}, {addr.state}, {addr.zip}, {addr.country}
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(addr)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteAddress(addr.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
