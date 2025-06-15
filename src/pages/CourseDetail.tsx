
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/config/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Course } from "@/types/shop";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [owned, setOwned] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "courses", id)).then((snap) => {
      if (snap.exists()) {
        setCourse({ ...snap.data(), id: snap.id } as Course);
      }
    });
  }, [id]);

  // Check if user bought this course
  useEffect(() => {
    if (!user || !id) return setOwned(false);
    // fetch orders for this user with this course id
    const checkCoursePurchase = async () => {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        where("items", "array-contains", { id, type: "course" })
      );
      const snap = await getDocs(q);
      setOwned(!snap.empty);
    };
    checkCoursePurchase();
  }, [user, id]);

  if (!course) return <div className="p-8 text-center">Loading...</div>;

  function handleBuyNow() {
    if (!user) {
      navigate('/login');
      return;
    }
    // "Instant buy": proceed to payment for this course only (skip address)
    // For demo: Go to /cart?course={id}&buyNow=1 (simulate checkout for only this course)
    navigate("/cart", { state: { buyNowCourse: course.id } });
  }

  function handleAccess() {
    // For now, navigate to a "course content" page or say "Access granted"
    toast({ title: "Accessing your course...", description: course.title });
    // Implement your course content/dashboard logic here
    // For now, could redirect or show a message
  }

  return (
    <div className="container max-w-xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={course.image} alt={course.title} className="w-full md:w-64 h-48 object-cover rounded" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
          <div className="mt-2 font-bold text-primary text-xl mb-2">₹{course.price}</div>
          <div className="mb-4">{course.description}</div>
          <div className="mb-3">
            <div className="font-semibold mb-1">Instructor:</div>
            <div className="text-sm">{course.instructor}</div>
          </div>
          <div className="flex gap-2 mt-4">
            {!owned ? (
              <Button onClick={handleBuyNow}>Buy Now</Button>
            ) : (
              <Button variant="outline" onClick={handleAccess}>Access</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
