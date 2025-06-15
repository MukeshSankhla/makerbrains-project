
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useAddressBook from "@/hooks/useAddressBook";
import type { Address } from "@/types/address";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
};

export default function AddressSelectModal({ open, onClose, onSelect }: Props) {
  const { addresses, loading } = useAddressBook();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Select a Shipping Address</Dialog.Title>
        <div className="space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : addresses.length ? (
            <div className="grid gap-2">
              {addresses.map(addr => (
                <button
                  key={addr.id}
                  className={`border rounded p-2 w-full text-left ${selected === addr.id ? "border-primary" : "border-gray-300"}`}
                  onClick={() => setSelected(addr.id)}
                >
                  <div className="font-bold">{addr.label}</div>
                  <div>{addr.line1}</div>
                  <div className="text-xs text-muted-foreground">{addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                </button>
              ))}
            </div>
          ) : (
            <div>No addresses found. Add a new address from your profile.</div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              const found = addresses.find(a => a.id === selected);
              if (found) onSelect(found);
            }}
            disabled={!selected}
          >
            Use Selected
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
