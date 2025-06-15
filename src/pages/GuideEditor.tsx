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
import { GripVertical, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

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

type StepType = {
  title: string;
  content: string;
};

const GuideEditor: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);

  // Each step gets its own quill ref
  const stepQuillRefs = useRef<Array<React.MutableRefObject<ReactQuill | null>>>(
    []
  );

  const [steps, setSteps] = useState<StepType[]>([
    { title: "", content: "" },
  ]);

  // Fix: Ensure all step editors remain visible and can be edited independently
  function getStepQuillRef(idx: number) {
    // Ensure an array element exists for each step
    if (!stepQuillRefs.current[idx]) {
      stepQuillRefs.current[idx] = React.createRef<ReactQuill>() as any;
    }
    return stepQuillRefs.current[idx];
  }

  // Custom image upload handler (per editor)
  const imageHandler = useCallback(
    (idx: number) => () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        try {
          const storageRef = ref(
            storage,
            `guideImages/${Date.now()}-${file.name}`
          );
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          const quill = getStepQuillRef(idx).current?.getEditor();
          const range = quill?.getSelection(true);
          quill?.insertEmbed(range ? range.index : 0, "image", url);
        } catch (err) {
          console.error("Image upload error:", err);
          toast({ title: "Image upload failed", variant: "destructive" });
        }
      };
    },
    [toast]
  );

  // Quill modules config (per step)
  const getStepModules = (idx: number) => ({
    toolbar: {
      container: TOOLBAR_OPTIONS,
      handlers: {
        image: imageHandler(idx),
      },
    },
    clipboard: { matchVisual: false },
  });

  // Only allow admin
  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-lg">Admin access only</div>
    );
  }

  // Save the guide to Firestore
  const handleSave = async () => {
    if (
      !title.trim() ||
      steps.some((step) => !step.content.trim())
    ) {
      toast({
        title: "Title and each step's content are required",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "projectGuides"), {
        title,
        summary,
        steps,
        authorId: user?.uid ?? null,
        authorEmail: user?.email ?? null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
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

  // Add step
  const addStep = () => {
    setSteps((prev) => [...prev, { title: "", content: "" }]);
  };

  // Remove step
  const removeStep = (idx: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
    stepQuillRefs.current.splice(idx, 1);
  };

  // Move step up/down
  const moveStep = (idx: number, direction: "up" | "down") => {
    setSteps((prev) => {
      const newSteps = [...prev];
      if (
        (direction === "up" && idx === 0) ||
        (direction === "down" && idx === prev.length - 1)
      )
        return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      [newSteps[idx], newSteps[targetIdx]] = [
        newSteps[targetIdx],
        newSteps[idx],
      ];
      return newSteps;
    });
    // Move ref also
    const refs = stepQuillRefs.current;
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === refs.length - 1)
    )
      return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    [refs[idx], refs[targetIdx]] = [refs[targetIdx], refs[idx]];
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create Project Guide</h1>
          <p className="text-muted-foreground">
            Rich step-by-step guide: add multiple steps, code, images, videos, and more.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Guide Title</label>
            <Input
              placeholder="Project guide title"
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
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Steps</h2>
            <Button size="sm" variant="secondary" onClick={addStep}>
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </Button>
          </div>
          <div className="space-y-8">
            {/* All steps will appear, each with their own input editor */}
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="border rounded-md p-4 bg-muted/30 relative space-y-3 transition-shadow"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    <GripVertical className="text-muted-foreground" />
                    <span className="font-medium">Step {idx + 1}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Move Step Up"
                      disabled={idx === 0}
                      onClick={() => moveStep(idx, "up")}
                      tabIndex={-1}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Move Step Down"
                      disabled={idx === steps.length - 1}
                      onClick={() => moveStep(idx, "down")}
                      tabIndex={-1}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      aria-label="Remove Step"
                      disabled={steps.length === 1}
                      onClick={() => removeStep(idx)}
                      tabIndex={-1}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <Input
                  placeholder={`Step ${idx + 1} title (optional)`}
                  value={step.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSteps((prev) =>
                      prev.map((s, i) =>
                        i === idx ? { ...s, title: val } : s
                      )
                    );
                  }}
                  className="mb-2"
                />
                <ReactQuill
                  ref={getStepQuillRef(idx)}
                  value={step.content}
                  onChange={(val) => {
                    setSteps((prev) =>
                      prev.map((s, i) =>
                        i === idx ? { ...s, content: val } : s
                      )
                    );
                  }}
                  modules={getStepModules(idx)}
                  theme="snow"
                  placeholder={`Write step ${idx + 1} content. Include formatted text, images, code...`}
                  style={{ minHeight: 160 }}
                />
              </div>
            ))}
          </div>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-2"
          >
            {saving ? "Saving..." : "Save Guide"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuideEditor;
