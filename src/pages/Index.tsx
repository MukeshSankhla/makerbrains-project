
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { ArrowDown, Book, Code, Search } from "lucide-react";

const featuredProjects = [
  {
    id: 1,
    title: "IoT Weather Station with ESP32",
    description: "Build a complete weather monitoring system with real-time data visualization",
    image: "/placeholder.svg",
    tags: ["IoT", "Electronics", "ESP32"],
    difficulty: "Intermediate",
    views: "12.5k"
  },
  {
    id: 2,
    title: "3D Printed Robot Arm with Arduino",
    description: "Design and control a 6-DOF robot arm using 3D printing and Arduino",
    image: "/placeholder.svg",
    tags: ["3D Printing", "Robotics", "Arduino"],
    difficulty: "Advanced",
    views: "8.3k"
  },
  {
    id: 3,
    title: "Smart Home Automation System",
    description: "Create a comprehensive home automation system with voice control",
    image: "/placeholder.svg",
    tags: ["IoT", "Home Automation", "AI"],
    difficulty: "Intermediate",
    views: "15.2k"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Maker Brains — Simplifying Technology
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Hands-On Learning
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent block">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl leading-relaxed">
              Master complex technology through practical tutorials, projects, and insights in electronics, IoT, robotics, CAD, 3D printing, and software development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/projects">
                <Button size="lg" className="min-w-40">
                  <Book className="mr-2 h-4 w-4" />
                  Explore Projects
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="min-w-40">
                <Code className="mr-2 h-4 w-4" />
                Start Learning
              </Button>
            </div>
            
            <div className="animate-bounce">
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Learn & Build
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From beginner tutorials to advanced projects, we provide comprehensive resources for makers at every level.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Step-by-Step Tutorials</CardTitle>
                <CardDescription>
                  Detailed guides with images, videos, code snippets, and downloadable files
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Smart Discovery</CardTitle>
                <CardDescription>
                  Find projects by difficulty, technology, tags, and your specific interests
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Integrated Shopping</CardTitle>
                <CardDescription>
                  Get all components and tools needed for projects with one-click purchasing
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-muted-foreground">
                Popular tutorials from our community of makers
              </p>
            </div>
            <Link to="/projects">
              <Button variant="outline">View All Projects</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={project.difficulty === 'Advanced' ? 'destructive' : project.difficulty === 'Intermediate' ? 'default' : 'secondary'}>
                      {project.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{project.views} views</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription>
                    {project.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of makers who are learning and building amazing projects every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects">
              <Button size="lg" variant="secondary">
                Browse Projects
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
              <span className="font-bold text-xl">MakerBrains</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 MakerBrains. Making technology accessible through hands-on learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
