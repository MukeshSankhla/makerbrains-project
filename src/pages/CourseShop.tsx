import { useEffect, useState } from "react";
import { Course } from "@/types/shop";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/shop";
import { addPurchasedCourseToProfile } from "@/services/firebaseUserService";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export default function CourseShop() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch all courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(db, "courses"));
      const fetchedCourses = snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })) as Course[];
      setCourses(fetchedCourses);
    };
    fetchCourses();
  }, []);

  // Handler for course "Buy Now"
  const handleBuyCourse = async (course: Course) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Log in before purchasing a course.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    // Use profile field for purchased detection
    const purchasedCourses = userProfile?.purchasedCourses || [];
    if (purchasedCourses.includes(course.id)) {
      toast({
        title: "Already purchased",
        description: "You have already purchased this course.",
        variant: "default",
      });
      return;
    }
    // ---- CHANGED: Go to payment page, passing course data ----
    navigate("/payment", { state: { course, type: "course" } });
  };

  // Handler for accessing the course
  const handleAccessCourse = (course: Course) => {
    navigate(`/courses/${course.id}`);
  };

  // Use userProfile.purchasedCourses as the source of truth
  const purchasedCourses = userProfile?.purchasedCourses ?? [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {courses.map((c) => (
          <ProductCard
            key={c.id}
            item={c}
            onBuy={() =>
              purchasedCourses.includes(c.id)
                ? handleAccessCourse(c)
                : handleBuyCourse(c)
            }
            isOwned={purchasedCourses.includes(c.id)}
            type="course"
          />
        ))}
      </div>
    </div>
  );
}
