
import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "code"],
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image", "video"],
  ["clean"],
];

const GuideEditor: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const quillRef = useRef<ReactQuill>(null);

  // Custom image upload handler
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];
      try {
        const storageRef = ref(storage, `guideImages/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection(true);
        quill?.insertEmbed(range ? range.index : 0, "image", url);
      } catch (err) {
        console.error("Image upload error:", err);
        toast({ title: "Image upload failed", variant: "destructive" });
      }
    };
  }, [toast]);

  // Quill modules config
  const modules = {
    toolbar: {
      container: TOOLBAR_OPTIONS,
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: { matchVisual: false },
  };

  // Only allow admin
  if (!isAdmin) {
    return <div className="p-8 text-center text-lg">Admin access only</div>;
  }

  // Save the guide to Firestore
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Title and content required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "projectGuides"), {
        title,
        summary,
        content,
        authorId: user?.uid ?? null,
        authorEmail: user?.email ?? null,
        createdAt: Date.now(),
      });
      toast({ title: "Project guide saved!" });
      navigate("/"); // Or guide list page
    } catch (e) {
      toast({
        title: "Save failed",
        description: "Failed to save guide",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create Project Guide</h1>
          <p className="text-muted-foreground">Rich guide with code, images, videos, and more.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Input
              placeholder="Guide title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Summary (optional)</label>
            <Input
              placeholder="Short summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={200}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Guide Content</label>
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={modules}
              theme="snow"
              placeholder="Write your project guide here. Use the toolbar for code, images, videos..."
              style={{ minHeight: 240 }}
            />
          </div>
          <Button variant="default" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Guide"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuideEditor;
