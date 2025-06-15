
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddressBook } from "@/hooks/useAddressBook";
import { useState } from "react";
import { Address } from "@/types/address";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
  selectedId?: string;
}
export default function AddressSelectModal({ open, onClose, onSelect, selectedId }: Props) {
  const { addresses } = useAddressBook();
  const [selected, setSelected] = useState(selectedId || "");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Select Address</DialogTitle>
        <div className="max-h-56 overflow-y-auto space-y-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={`border rounded p-3 cursor-pointer ${selected === a.id ? "border-primary bg-accent" : ""}`}
              onClick={() => setSelected(a.id)}
            >
              <div className="font-medium">{a.name}</div>
              <div className="text-sm">{a.line1}, {a.line2 && <>{a.line2}, </>}{a.city}, {a.state}, {a.zip}, {a.country}</div>
              <div className="text-xs text-muted-foreground">{a.phone}</div>
            </div>
          ))}
          {addresses.length === 0 && <div>No addresses found.</div>}
        </div>
        <div className="flex justify-between pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              const found = addresses.find((a) => a.id === selected);
              if (found) onSelect(found);
              onClose();
            }}
            disabled={!selected}
          >
            Use Selected
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
