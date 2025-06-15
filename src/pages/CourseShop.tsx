
import { useEffect, useState } from "react";
import { Course } from "@/types/shop";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { Order } from "@/types/shop";

export default function CourseShop() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch all courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(db, "courses"));
      const fetchedCourses = snap.docs.map((doc) => doc.data() as Course);
      setCourses(fetchedCourses);
      console.log("Fetched courses:", fetchedCourses.map(c => c.id));
    };
    fetchCourses();
  }, []);

  // Fetch all purchased course ids from orders for this user
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setPurchasedCourses([]);
        return;
      }
      const snap = await getDocs(collection(db, "orders"));
      const userOrders: Order[] = [];
      snap.forEach((doc) => {
        const o = { ...doc.data(), id: doc.id } as Order;
        if (o.userId === user.uid && Array.isArray(o.items)) {
          userOrders.push(o);
        }
      });
      // Get unique purchased course ids
      const owned = new Set<string>();
      userOrders.forEach((order) => {
        order.items.forEach((item) => {
          // Defensive: log each item for inspection
          console.log("Order item:", item);
          if (item.type === "course" && item.id) owned.add(item.id);
        });
      });
      console.log("Purchased course IDs found in orders:", [...owned]);
      setPurchasedCourses([...owned]);
    };
    fetchOrders();
  }, [user]);

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
    if (purchasedCourses.includes(course.id)) {
      toast({
        title: "Already purchased",
        description: "You have already purchased this course.",
        variant: "default",
      });
      return;
    }
    try {
      // Directly create an order for this course
      const order: Omit<Order, "id"> = {
        userId: user.uid,
        items: [{ ...course, quantity: 1 }],
        totalAmount: course.price,
        paymentProvider: "stripe", // Or change as needed
        status: "completed",
        createdAt: Date.now(),
        email: user.email || "",
      };
      await addDoc(collection(db, "orders"), order);
      setPurchasedCourses((prev) => [...prev, course.id]);
      toast({
        title: "Course Purchased!",
        description: "You now have access to this course.",
      });
    } catch (e) {
      toast({
        title: "Purchase failed",
        description: "Could not complete purchase.",
        variant: "destructive",
      });
    }
  };

  // Handler for accessing the course
  const handleAccessCourse = (course: Course) => {
    navigate(`/courses/${course.id}`);
  };

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

