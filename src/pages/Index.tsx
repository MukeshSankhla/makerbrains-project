
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects, Project } from "@/pages/ProjectContext";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import SeoStructuredData from "@/components/SeoStructuredData";
import LazyImage from "@/components/LazyImage";
import { projectService } from "@/services/firebaseDataService";

const Index = () => {
  // Get user-created projects from context
  const { projects: userProjects } = useProjects();
  const [predefinedProjects, setPredefinedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch projects with simplified error handling
  const fetchPredefinedProjects = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const data = await projectService.getAll();
      setPredefinedProjects(data as Project[]);
      
    } catch (error: any) {
      console.error('Error in fetchPredefinedProjects:', error);
      setError(error instanceof Error ? error.message : 'Failed to load projects. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch on component mount
  useEffect(() => {
    console.log('Starting initial project fetch...');
    fetchPredefinedProjects();
  }, [fetchPredefinedProjects]);

  console.log('Render state:', { 
    isLoading, 
    projectCount: predefinedProjects.length, 
    error
  });

  return (
    <div className="flex flex-col w-full">
      {/* SEO optimization */}
      <Helmet>
        <title>Maker Brains</title>
        <meta name="description" content="Explore Mukesh Sankhla's engineering projects, innovations, and maker adventures. Browse DIY electronics, robotics projects, Arduino tutorials, and creative tech solutions." />
        <meta name="keywords" content="Maker Brains, Mukesh Sankhla, DIY electronics, robotics, engineering projects, Arduino, Raspberry Pi, maker space, 3D Printing, IoT" />
        <link rel="canonical" href="https://makerbrains.com" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Structured data */}
      <SeoStructuredData 
        type="Website" 
        data={{
          name: "Maker Brains",
          url: "https://makerbrains.com",
          description: "Platform for Mukesh Sankhla's engineering projects and DIY electronics tutorials"
        }}
      />
      
      <SeoStructuredData 
        type="Organization" 
        data={{
          name: "Maker Brains",
          url: "https://makerbrains.com",
          logo: "https://makerbrains.com/logo.png",
          description: "DIY electronics and engineering project resources",
          sameAs: [
            "https://www.youtube.com/@makerbrains",
            "https://github.com/MukeshSankhla",
            "https://www.linkedin.com/in/mukeshsankhla/",
            "https://www.instagram.com/makerbrains_official/"
          ]
        }}
      />
      
      {/* Main content */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold relative inline-block">Latest Projects</h1>
        
        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
            {error}
            <button 
              onClick={() => {
                setError(null);
                fetchPredefinedProjects();
              }}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display loaded projects */}
          {predefinedProjects.map((project) => (
            <div key={project.id}>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                  aria-label={`View project: ${project.title}`}
                >
                  <ProjectCard project={project} />
                </a>
              ) : (
                <Link 
                  to={`/project/${project.id}`} 
                  className="block h-full"
                  aria-label={`View project details: ${project.title}`}
                >
                  <ProjectCard project={project} />
                </Link>
              )}
            </div>
          ))}
          
          {/* Loading skeletons */}
          {isLoading && (
            Array.from({ length: predefinedProjects.length === 0 ? 6 : 3 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="flex flex-col overflow-hidden h-full">
                <Skeleton className="w-full h-48" />
                <CardHeader>
                  <Skeleton className="h-6 w-4/5" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  <div className="flex justify-between w-full">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        
        {/* No projects message */}
        {!isLoading && predefinedProjects.length === 0 && !error && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium">No projects found</h2>
            <p className="text-muted-foreground mt-2">Check back soon for new projects!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced project card component with optimized image loading
const ProjectCard = ({ project }: { project: Project }) => (
  <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow h-full bg-[#f2f2f2] dark:bg-[#2f2f2f]">
    <div className="w-full relative aspect-video">
      <LazyImage
        src={project.image}
        alt={`${project.title} project thumbnail`}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          console.warn(`Failed to load image for project ${project.id}:`, project.title);
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
    </div>
    <CardHeader>
      <CardTitle className="break-words line-clamp-2">{project.title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-muted-foreground break-words line-clamp-3">{project.description}</p>
    </CardContent>
    <CardFooter className="text-sm text-muted-foreground">
      <div className="flex justify-between w-full">
        <span className="truncate max-w-[45%]" title={project.author}>{project.author}</span>
        <time dateTime={project.date} className="truncate max-w-[45%] text-right">{project.date}</time>
      </div>
    </CardFooter>
  </Card>
);

export default Index;
