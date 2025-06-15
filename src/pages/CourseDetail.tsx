
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      const snap = await getDocs(collection(db, "courses"));
      const found = snap.docs.map(doc => doc.data()).find(c => c.id === id);
      setCourse(found);
      setLoading(false);
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    // Detect if user owns the course
    if (userProfile && course) {
      const purchasedList = (userProfile as any).purchasedCourses || [];
      setPurchased(purchasedList.includes(course.id));
    }
  }, [userProfile, course]);

  const handleBuy = async () => {
    if (!user || !userProfile) {
      navigate("/login");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const base = userSnap.data() || {};
    const prev = base.purchasedCourses || [];
    if (!prev.includes(course.id)) {
      await updateDoc(userRef, {
        purchasedCourses: [...prev, course.id]
      });
    }
    setPurchased(true);
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-2 bg-background shadow rounded">
      <img src={course.image} alt={course.title} className="w-full max-h-64 object-cover rounded mb-4" />
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <div className="mt-2 text-muted-foreground text-sm">Instructor: {course.instructor}</div>
      <div className="mt-3 font-semibold">₹{course.price} (Tax included)</div>
      <div className="my-4">{course.description}</div>
      {!userProfile ? (
        <Button onClick={() => navigate("/login")}>Login to buy</Button>
      ) : purchased ? (
        <Button variant="default" onClick={() => alert('Access course resources - coming soon!')}>
          Access
        </Button>
      ) : (
        <Button onClick={handleBuy}>Buy Now</Button>
      )}
    </div>
  );
}
