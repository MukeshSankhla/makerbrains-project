
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { ArrowUp, Book, Calendar, Eye, User, Code, Image } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  
  // Mock project data - in real app, this would come from your database
  const project = {
    id: 1,
    title: "IoT Weather Station with ESP32",
    description: "Build a complete weather monitoring system with real-time data visualization and mobile app integration. This comprehensive guide covers everything from hardware assembly to cloud deployment.",
    image: "/placeholder.svg",
    tags: ["IoT", "Electronics", "ESP32", "Weather", "Cloud"],
    difficulty: "Intermediate",
    views: "12.5k",
    author: "Sarah Chen",
    publishDate: "2024-01-15",
    category: "Electronics",
    estimatedTime: "6-8 hours",
    components: [
      "ESP32 Development Board",
      "DHT22 Temperature/Humidity Sensor",
      "BMP280 Pressure Sensor",
      "OLED Display 128x64",
      "Breadboard and Jumper Wires",
      "3D Printed Enclosure"
    ],
    steps: [
      {
        title: "Hardware Setup",
        content: "Start by connecting the ESP32 to your breadboard and wiring the sensors according to the circuit diagram.",
        image: "/placeholder.svg",
        code: `// ESP32 Pin Configuration
#define DHT_PIN 4
#define SDA_PIN 21
#define SCL_PIN 22

#include <DHT.h>
#include <Wire.h>
#include <Adafruit_BMP280.h>

DHT dht(DHT_PIN, DHT22);
Adafruit_BMP280 bmp;`
      },
      {
        title: "Software Configuration",
        content: "Install the required libraries and configure the ESP32 for WiFi connectivity and sensor readings.",
        image: "/placeholder.svg",
        code: `void setup() {
  Serial.begin(115200);
  dht.begin();
  
  if (!bmp.begin()) {
    Serial.println("BMP280 sensor not found!");
    while (1);
  }
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
}`
      },
      {
        title: "Cloud Integration",
        content: "Connect your weather station to a cloud service for data storage and visualization.",
        image: "/placeholder.svg"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/projects" className="hover:text-primary">Projects</Link>
              <span className="mx-2">/</span>
              <span>{project.title}</span>
            </nav>
            
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={project.difficulty === 'Advanced' ? 'destructive' : 'default'}>
                    {project.difficulty}
                  </Badge>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {project.title}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{project.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{project.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    <span>{project.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button>
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Like Project
                  </Button>
                  <Button variant="outline">
                    Save for Later
                  </Button>
                </div>
              </div>
              
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Project Steps</h2>
                
                <div className="space-y-8">
                  {project.steps.map((step, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                          <p className="text-muted-foreground mb-4">{step.content}</p>
                          
                          {step.image && (
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                              <img 
                                src={step.image} 
                                alt={step.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {step.code && (
                            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                              <div className="flex items-center gap-2 mb-2">
                                <Code className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-400">Code</span>
                              </div>
                              <pre className="text-sm text-gray-300">
                                <code>{step.code}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Components Needed</CardTitle>
                    <CardDescription>
                      Everything you'll need for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {project.components.map((component, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm">{component}</span>
                        </li>
                      ))}
                    </ul>
                    <Separator className="my-4" />
                    <Button className="w-full">
                      Buy All Components
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Project Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <Badge variant="default">{project.difficulty}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Time</span>
                      <span className="text-sm">{project.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Views</span>
                      <span className="text-sm">{project.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
