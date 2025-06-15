
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  currentComment?: string;
  currentTrackingUrl?: string;
  currentTrackingId?: string;
  onSave: (s: { adminComment: string; trackingUrl: string; trackingId: string }) => void;
  trigger: React.ReactNode;
};

export const OrderAdminDialog: React.FC<Props> = ({
  currentComment,
  currentTrackingUrl,
  currentTrackingId,
  onSave,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState(currentComment || "");
  const [trackingUrl, setTrackingUrl] = useState(currentTrackingUrl || "");
  const [trackingId, setTrackingId] = useState(currentTrackingId || "");

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setComment(currentComment || "");
      setTrackingUrl(currentTrackingUrl || "");
      setTrackingId(currentTrackingId || "");
    }
  }, [open, currentComment, currentTrackingUrl, currentTrackingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ adminComment: comment, trackingUrl, trackingId });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment & Tracking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-medium block mb-1">Admin Comment</label>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write a message/user note for this order"
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Tracking ID</label>
            <Input
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              placeholder="eg. ZYX123456"
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Tracking URL</label>
            <Input
              value={trackingUrl}
              onChange={e => setTrackingUrl(e.target.value)}
              placeholder="eg. https://courier.com/track/..."
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
