
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { workshopService, Workshop } from "@/services/firebaseDataService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const workshopData = await workshopService.getAll();
        setWorkshops(workshopData as Workshop[]);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

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
          <h1 className="text-4xl font-bold">Workshops</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our workshop posters and upcoming events.
          </p>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.length > 0 ? (
            workshops.map((workshop) => (
              <Card 
                key={workshop.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedWorkshop(workshop)}
              >
                <div className="relative h-64 bg-gray-100">
                  {workshop.posterUrl ? (
                    <img
                      src={workshop.posterUrl}
                      alt={workshop.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No poster available
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <h3 className="text-xl font-semibold line-clamp-2">{workshop.title}</h3>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{workshop.description}</p>
                </CardContent>
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

      {/* Full Poster Dialog */}
      <Dialog open={!!selectedWorkshop} onOpenChange={() => setSelectedWorkshop(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedWorkshop?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedWorkshop?.posterUrl && (
              <div className="flex justify-center">
                <img
                  src={selectedWorkshop.posterUrl}
                  alt={selectedWorkshop.title}
                  className="max-w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
            <div className="text-center">
              <p className="text-muted-foreground">{selectedWorkshop?.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
