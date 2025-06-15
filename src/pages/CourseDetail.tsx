
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Course } from "@/types/shop";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  // Purchased courses should be handled server-side, here is a simple frontend mock:
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      const ref = doc(db, "courses", courseId);
      const snap = await getDoc(ref);
      if (snap.exists()) setCourse(snap.data() as Course);
    };
    fetchCourse();
  }, [courseId]);

  const handleBuyNow = () => {
    if (!user) {
      toast({ title: "Please log in to purchase this course.", variant: "destructive" });
      navigate("/login");
      return;
    }
    // Here, mark the course as purchased for the user in backend
    setPurchased(true);
    toast({ title: "Course purchased! You can access it from your profile." });
    navigate("/profile");
  };

  if (!course) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto py-8 flex flex-col md:flex-row gap-12">
      <img src={course.image} alt={course.title} className="w-72 h-72 object-cover rounded-lg border mx-auto mb-8 md:mb-0" />
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-lg text-muted-foreground">{course.description}</p>
        <div className="text-xl font-semibold">₹{course.price}</div>
        <div>
          {purchased ? (
            <Button disabled variant="secondary">Purchased</Button>
          ) : (
            <Button onClick={handleBuyNow}>Buy Now</Button>
          )}
        </div>
        <div>
          <span className="mt-4 text-muted-foreground text-sm">
            (After purchase, you'll find this course and its resources under "My Courses" in your profile.)
          </span>
        </div>
      </div>
    </div>
  );
}
