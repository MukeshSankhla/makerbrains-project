import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Book, User, BarChart, Plus, Edit, Eye } from "lucide-react";
import AdminOrderTable from "@/components/AdminOrderTable";

const Admin = () => {
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    tags: ""
  });

  const stats = [
    { title: "Total Projects", value: "127", icon: Book, color: "text-blue-600" },
    { title: "Active Users", value: "2,543", icon: User, color: "text-green-600" },
    { title: "Monthly Views", value: "45.2k", icon: Eye, color: "text-purple-600" },
    { title: "Revenue", value: "$12,450", icon: BarChart, color: "text-orange-600" }
  ];

  const recentProjects = [
    { id: 1, title: "IoT Weather Station", author: "Sarah Chen", status: "Published", views: "12.5k" },
    { id: 2, title: "3D Printed Robot Arm", author: "Mike Rodriguez", status: "Draft", views: "8.3k" },
    { id: 3, title: "Smart Home System", author: "Alex Thompson", status: "Published", views: "15.2k" }
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating project:", newProject);
    // Here you would save to your database
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your MakerBrains platform</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="create">Create Project</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Manage your published and draft projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">by {project.author}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={project.status === 'Published' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{project.views} views</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>Add a new tutorial or project to your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Title</label>
                    <Input
                      placeholder="Enter project title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe your project"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={newProject.category} onValueChange={(value) => setNewProject({...newProject, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="iot">IoT</SelectItem>
                          <SelectItem value="robotics">Robotics</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={newProject.difficulty} onValueChange={(value) => setNewProject({...newProject, difficulty: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <Input
                      placeholder="Enter tags separated by commas"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit">Create Project</Button>
                    <Button type="button" variant="outline">Save as Draft</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrderTable />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage registered users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  User management interface would go here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Track platform performance and user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Analytics charts and metrics would go here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
