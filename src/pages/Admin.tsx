
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Book, User, BarChart, Plus, Edit, Eye, ListCheck, Package } from "lucide-react";
import AdminOrderTable from "@/components/AdminOrderTable";
import { useNavigate, Link } from "react-router-dom";

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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your MakerBrains platform</p>
          </div>
          <Button asChild>
            <Link to="/admin-panel">
              <Plus className="h-4 w-4 mr-2" />
              Admin Panel
            </Link>
          </Button>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
          {/* ADMIN: Add Order Management Quick Access, now links to admin-panel orders */}
          <Card
            as="a"
            href="/admin-panel#orders"
            className="cursor-pointer transition-shadow hover:shadow-lg bg-primary text-primary-foreground"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Package className="h-4 w-4 mr-2 text-white" />
                Order Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base font-semibold">
                View &amp; update orders
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">
              Projects
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">
              <ListCheck className="inline mr-1 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="create">Create Project</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {/* Extra: Add main Admin Panel link directly */}
            <TabsTrigger value="admin-panel">
              <Link to="/admin-panel" className="flex items-center gap-1">
                Admin Panel
              </Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            {/* Replace in-page project management content with a button to the admin-panel section */}
            <div className="flex justify-center items-center min-h-[180px]">
              <Button asChild variant="outline">
                <Link to="/admin-panel#projects">
                  Go to Project Management in Admin Panel
                </Link>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="create">
            <div className="flex justify-center items-center min-h-[180px]">
              <Button asChild>
                <Link to="/admin-panel#projects">
                  Go to Create Project in Admin Panel
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="mb-4">
              <Button asChild variant="outline" className="mb-2">
                <Link to="/admin-panel#orders">
                  <ListCheck className="h-4 w-4 mr-2" />
                  Go to Order Management in Admin Panel
                </Link>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="users">
            <div className="flex justify-center items-center min-h-[180px]">
              <Button asChild variant="outline">
                <Link to="/admin-panel#users">
                  Go to User Management in Admin Panel
                </Link>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="flex justify-center items-center min-h-[180px] text-muted-foreground">
              Analytics charts and metrics would go here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

