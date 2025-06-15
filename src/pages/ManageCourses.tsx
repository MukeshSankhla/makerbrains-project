
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  instructor: string;
};

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Course>>({});
  const { toast } = useToast();

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      const snap = await getDocs(collection(db, "courses"));
      setCourses(
        snap.docs.map((d) => ({
          ...(d.data() as Omit<Course, "id">),
          id: d.id,
        }))
      );
    } catch (err) {
      toast({
        title: "Load error",
        description: "Failed to load courses from database.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const handleStartEdit = (course: Course) => {
    setIsEditing(course.id);
    setEditForm({ ...course });
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditForm({
      title: "",
      description: "",
      price: 0,
      image: "",
      instructor: "",
    });
  };

  const handleSave = async () => {
    if (
      !editForm.title ||
      !editForm.description ||
      !editForm.price ||
      !editForm.instructor
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (isAdding) {
        await addDoc(collection(db, "courses"), {
          title: editForm.title,
          description: editForm.description,
          price: editForm.price,
          image: editForm.image || "",
          instructor: editForm.instructor,
        });
        toast({
          title: "Course Added",
          description: "Course successfully added.",
        });
        setIsAdding(false);
      } else if (isEditing) {
        // Find Firestore course doc by id
        const courseId = isEditing;
        await updateDoc(doc(db, "courses", courseId), {
          title: editForm.title,
          description: editForm.description,
          price: editForm.price,
          image: editForm.image || "",
          instructor: editForm.instructor,
        });
        toast({
          title: "Course Updated",
          description: "Course successfully updated.",
        });
        setIsEditing(null);
      }
      setEditForm({});
      fetchCourses();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", id));
        toast({
          title: "Course Deleted",
          description: "Course has been deleted.",
        });
        fetchCourses();
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete course. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setEditForm({});
  };

  const updateFormField = (field: keyof Course, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Courses</h1>
        <Button onClick={handleStartAdd} disabled={isAdding || !!isEditing}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>
      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Course Title"
              value={editForm.title || ""}
              onChange={(e) => updateFormField("title", e.target.value)}
            />
            <Textarea
              placeholder="Course Description"
              value={editForm.description || ""}
              onChange={(e) => updateFormField("description", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={editForm.price || ""}
              onChange={(e) =>
                updateFormField("price", parseInt(e.target.value) || 0)
              }
            />
            <Input
              placeholder="Image URL"
              value={editForm.image || ""}
              onChange={(e) => updateFormField("image", e.target.value)}
            />
            <Input
              placeholder="Instructor Name"
              value={editForm.instructor || ""}
              onChange={(e) => updateFormField("instructor", e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Course
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            {isEditing === course.id ? (
              <CardContent className="p-4 space-y-4">
                <Input
                  value={editForm.title || ""}
                  onChange={(e) => updateFormField("title", e.target.value)}
                />
                <Textarea
                  value={editForm.description || ""}
                  onChange={(e) =>
                    updateFormField("description", e.target.value)
                  }
                />
                <Input
                  type="number"
                  value={editForm.price || ""}
                  onChange={(e) =>
                    updateFormField("price", parseInt(e.target.value) || 0)
                  }
                />
                <Input
                  value={editForm.image || ""}
                  onChange={(e) => updateFormField("image", e.target.value)}
                />
                <Input
                  value={editForm.instructor || ""}
                  onChange={(e) => updateFormField("instructor", e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <div className="aspect-video relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <div className="text-lg font-bold text-primary">
                    ₹{course.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                    {course.description}
                  </p>
                  <div className="text-sm mb-2">
                    By <span className="font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleStartEdit(course)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageCourses;

