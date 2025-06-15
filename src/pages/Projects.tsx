
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { Search, User } from "lucide-react";

const allProjects = [
  {
    id: 1,
    title: "IoT Weather Station with ESP32",
    description: "Build a complete weather monitoring system with real-time data visualization and mobile app integration",
    image: "/placeholder.svg",
    tags: ["IoT", "Electronics", "ESP32", "Weather"],
    difficulty: "Intermediate",
    views: "12.5k",
    author: "Sarah Chen",
    publishDate: "2024-01-15",
    category: "Electronics"
  },
  {
    id: 2,
    title: "3D Printed Robot Arm with Arduino",
    description: "Design and control a 6-DOF robot arm using 3D printing and Arduino with inverse kinematics",
    image: "/placeholder.svg",
    tags: ["3D Printing", "Robotics", "Arduino", "CAD"],
    difficulty: "Advanced",
    views: "8.3k",
    author: "Mike Rodriguez",
    publishDate: "2024-01-10",
    category: "Robotics"
  },
  {
    id: 3,
    title: "Smart Home Automation System",
    description: "Create a comprehensive home automation system with voice control and mobile app",
    image: "/placeholder.svg",
    tags: ["IoT", "Home Automation", "AI", "Mobile"],
    difficulty: "Intermediate",
    views: "15.2k",
    author: "Alex Thompson",
    publishDate: "2024-01-08",
    category: "IoT"
  },
  {
    id: 4,
    title: "PCB Design for Beginners",
    description: "Learn PCB design fundamentals using KiCad with practical examples and best practices",
    image: "/placeholder.svg",
    tags: ["Electronics", "PCB", "KiCad", "Design"],
    difficulty: "Beginner",
    views: "6.7k",
    author: "Emma Wilson",
    publishDate: "2024-01-05",
    category: "Electronics"
  },
  {
    id: 5,
    title: "Machine Learning on Edge Devices",
    description: "Deploy TensorFlow Lite models on Raspberry Pi for real-time object detection",
    image: "/placeholder.svg",
    tags: ["AI", "Machine Learning", "Raspberry Pi", "Computer Vision"],
    difficulty: "Advanced",
    views: "9.1k",
    author: "David Park",
    publishDate: "2024-01-03",
    category: "Software"
  },
  {
    id: 6,
    title: "Custom Drone Build Guide",
    description: "Build a custom FPV racing drone from scratch with flight controller tuning",
    image: "/placeholder.svg",
    tags: ["Drones", "Electronics", "3D Printing", "Flight"],
    difficulty: "Advanced",
    views: "11.4k",
    author: "Lisa Zhang",
    publishDate: "2024-01-01",
    category: "Robotics"
  }
];

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || project.category.toLowerCase() === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || project.difficulty.toLowerCase() === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Projects
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover step-by-step tutorials and projects across electronics, IoT, robotics, and more
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search projects, tags, or technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="iot">IoT</SelectItem>
                  <SelectItem value="robotics">Robotics</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {filteredProjects.length} Projects Found
            </h2>
            <div className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {allProjects.length} projects
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
                <Link to={`/projects/${project.id}`}>
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        project.difficulty === 'Advanced' ? 'destructive' : 
                        project.difficulty === 'Intermediate' ? 'default' : 'secondary'
                      }>
                        {project.difficulty}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{project.views} views</span>
                    </div>
                    
                    <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </CardTitle>
                    
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <User className="h-3 w-3" />
                      <span>{project.author}</span>
                      <span>•</span>
                      <span>{new Date(project.publishDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
