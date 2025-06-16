
import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { magazineService, Magazine } from "@/services/firebaseDataService";

export default function Magazines() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchMagazines = async () => {
      try {
        const data = await magazineService.getAll();
        
        if (isMounted) {
          setMagazines(data as Magazine[]);
        }
      } catch (error: any) {
        console.error('Error fetching magazines:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load magazines. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchMagazines();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  return (
    <section className="py-5">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold relative inline-block">Magazine Features</h1>
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            // Show skeletons during loading
            Array(3).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="flex flex-col overflow-hidden">
                <CardHeader className="flex items-center p-4">
                  <Skeleton className="w-full h-32 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 mt-4" />
                </CardHeader>
              </Card>
            ))
          ) : magazines.length > 0 ? (
            magazines.map((magazine) => (
              <Card key={magazine.id} className="flex flex-col overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="flex flex-col items-center p-4">
                  <div className="relative w-full h-auto">
                    <a 
                      href={magazine.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`Visit ${magazine.title}`}
                    >
                      <img
                        src={magazine.image_url}
                        alt={magazine.title}
                        className="w-full object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                          (e.currentTarget as HTMLImageElement).alt = `${magazine.title} (image unavailable)`;
                        }}
                      />
                    </a>
                  </div>
                  <h3 className="font-medium text-lg text-center">{magazine.title}</h3>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No magazines available at the moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
