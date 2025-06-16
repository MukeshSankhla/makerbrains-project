
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  difficulty: string;
}

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const workshopsRef = collection(db, "workshops");
        const q = query(workshopsRef, orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        
        const workshopData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Workshop[];
        
        setWorkshops(workshopData);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const categories = ["all", ...Array.from(new Set(workshops.map(w => w.category)))];
  const filteredWorkshops = selectedCategory === "all" 
    ? workshops 
    : workshops.filter(w => w.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Hands-on Workshops</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our interactive workshops and learn by doing. From beginner-friendly sessions to advanced techniques, 
            we have something for every maker.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.length > 0 ? (
            filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={workshop.imageUrl || "/placeholder.svg"}
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {workshop.difficulty}
                  </Badge>
                </div>
                
                <CardHeader>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-fit">
                      {workshop.category}
                    </Badge>
                    <h3 className="text-xl font-semibold line-clamp-2">{workshop.title}</h3>
                    <p className="text-muted-foreground line-clamp-3">{workshop.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {new Date(workshop.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {workshop.duration}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    {workshop.currentParticipants}/{workshop.maxParticipants} participants
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {workshop.location}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${workshop.price}</span>
                  <Button 
                    disabled={workshop.currentParticipants >= workshop.maxParticipants}
                  >
                    {workshop.currentParticipants >= workshop.maxParticipants ? "Full" : "Register"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No workshops available at the moment.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for new workshops!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
