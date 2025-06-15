
import { useState } from "react";
import { useAddressBook } from "@/hooks/useAddressBook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address } from "@/types/address";
export default function AddressBook() {
  const { addresses, addAddress, updateAddress, removeAddress } = useAddressBook();
  const [edit, setEdit] = useState<Partial<Address> | null>(null);
  const [form, setForm] = useState({
    name: "", line1: "", line2: "", city: "", state: "", zip: "", country: "", phone: ""
  });
  function startEdit(a: Address) {
    setEdit(a);
    setForm({
      name: a.name || "",
      line1: a.line1 || "",
      line2: a.line2 || "",
      city: a.city || "",
      state: a.state || "",
      zip: a.zip || "",
      country: a.country || "",
      phone: a.phone || ""
    });
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (edit && edit.id) {
      await updateAddress(edit.id, form);
      setEdit(null);
    } else {
      await addAddress(form);
    }
    setForm({ name: "", line1: "", line2: "", city: "", state: "", zip: "", country: "", phone: "" });
  }
  return (
    <div className="container max-w-xl py-8">
      <h1 className="text-2xl font-bold mb-4">Address Book</h1>
      <form className="space-y-2 mb-6" onSubmit={handleSubmit}>
        <Input
          placeholder="Name" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input
          placeholder="Address line 1" value={form.line1} required onChange={e => setForm({ ...form, line1: e.target.value })} />
        <Input
          placeholder="Address line 2" value={form.line2 || ""} onChange={e => setForm({ ...form, line2: e.target.value })} />
        <div className="flex gap-2">
          <Input placeholder="City" value={form.city} required onChange={e => setForm({ ...form, city: e.target.value })} />
          <Input placeholder="State" value={form.state} required onChange={e => setForm({ ...form, state: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <Input placeholder="ZIP" value={form.zip} required onChange={e => setForm({ ...form, zip: e.target.value })} />
          <Input placeholder="Country" value={form.country} required onChange={e => setForm({ ...form, country: e.target.value })} />
        </div>
        <Input
          placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <div className="flex gap-2">
          <Button type="submit">{edit ? "Save" : "Add Address"}</Button>
          {edit && <Button variant="outline" type="button" onClick={() => setEdit(null)}>Cancel</Button>}
        </div>
      </form>
      <div className="space-y-3">
        {addresses.map(a => (
          <div key={a.id} className="border rounded p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm">{a.line1}{a.line2 && <> {a.line2}</>}, {a.city}, {a.state}, {a.zip}, {a.country}</div>
                <div className="text-xs text-muted-foreground">{a.phone}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(a)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => removeAddress(a.id!)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
