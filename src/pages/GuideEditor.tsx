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

// Add this helper for unique step ids
function generateStepId() {
  return Math.random().toString(36).substring(2, 10) + Date.now();
}

type StepType = {
  id: string;
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

  // FIX: Initialize steps only ONCE, not on every render!
  const [steps, setSteps] = useState<StepType[]>(() => [
    { id: generateStepId(), title: "", content: "" },
  ]);

  // Each step gets its own quill ref
  const stepQuillRefs = useRef<Record<string, React.MutableRefObject<ReactQuill | null>>>({});

  // We'll use refs by step id for a stable reference
  function getStepQuillRef(stepId: string) {
    // Ensure an array element exists for each step
    if (!stepQuillRefs.current[stepId]) {
      stepQuillRefs.current[stepId] = React.createRef<ReactQuill>() as any;
    }
    return stepQuillRefs.current[stepId];
  }

  // Custom image upload handler (per editor)
  const imageHandler = useCallback(
    (stepId: string) => () => {
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
          const quill = getStepQuillRef(stepId).current?.getEditor();
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
  const getStepModules = (stepId: string) => ({
    toolbar: {
      container: TOOLBAR_OPTIONS,
      handlers: {
        image: imageHandler(stepId),
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
    setSteps((prev) => [
      ...prev,
      { id: generateStepId(), title: "", content: "" },
    ]);
  };

  // Remove step
  const removeStep = (stepId: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
    delete stepQuillRefs.current[stepId];
  };

  // Move step up/down
  const moveStep = (stepId: string, direction: "up" | "down") => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === stepId);
      if (
        (direction === "up" && idx === 0) ||
        (direction === "down" && idx === prev.length - 1)
      )
        return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      const newSteps = [...prev];
      [newSteps[idx], newSteps[targetIdx]] = [newSteps[targetIdx], newSteps[idx]];
      return newSteps;
    });
    // No need to change refs, as they're keyed by id
  };

  // --- DEBUGGING: log steps array to detect re-creation ---
  console.log("Current steps:", steps);

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
            {/* Added key prop for each step by stable id */}
            {steps.map((step, idx) => (
              <div
                key={step.id}
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
                      onClick={() => moveStep(step.id, "up")}
                      tabIndex={-1}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Move Step Down"
                      disabled={idx === steps.length - 1}
                      onClick={() => moveStep(step.id, "down")}
                      tabIndex={-1}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      aria-label="Remove Step"
                      disabled={steps.length === 1}
                      onClick={() => removeStep(step.id)}
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
                      prev.map((s) =>
                        s.id === step.id ? { ...s, title: val } : s
                      )
                    );
                  }}
                  className="mb-2"
                />
                <ReactQuill
                  ref={getStepQuillRef(step.id)}
                  value={step.content}
                  onChange={(val) => {
                    setSteps((prev) =>
                      prev.map((s) =>
                        s.id === step.id ? { ...s, content: val } : s
                      )
                    );
                  }}
                  modules={getStepModules(step.id)}
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
