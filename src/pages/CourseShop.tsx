
import { useEffect, useState } from "react";
import { Course } from "@/types/shop";
import { ProductCard } from "@/components/ProductCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useNavigate } from "react-router-dom";

export default function CourseShop() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(db, "courses"));
      setCourses(snap.docs.map((doc) => doc.data() as Course));
    };
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {courses.map((c) => (
          <div key={c.id} onClick={() => navigate(`/course/${c.id}`)} className="cursor-pointer">
            <ProductCard
              item={c}
              // No onAddToCart prop, as direct order is handled on details page
            />
          </div>
        ))}
      </div>
    </div>
  );
}
