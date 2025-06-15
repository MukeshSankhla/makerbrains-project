
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Settings, List, User as UserIcon, BookOpen, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Admin = () => {
  const { isAdmin, userProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  // Main options for admin cards
  const adminOptions = [
    {
      title: "Projects",
      description: "Create and manage all projects",
      icon: List,
      actions: [
        {
          label: "Create New Project",
          icon: PlusCircle,
          link: "/create",
          color: "text-emerald-600"
        },
        {
          label: "Manage Projects",
          icon: Settings,
          link: "/manage-projects",
          color: "text-blue-600"
        },
      ],
    },
    {
      title: "Shop Products",
      description: "Manage e-commerce shop products",
      icon: List,
      actions: [
        {
          label: "Manage Products",
          icon: Settings,
          link: "/manage-products",
          color: "text-blue-600"
        },
      ],
    },
    {
      title: "Courses",
      description: "Manage courses for selling/assigning",
      icon: BookOpen,
      actions: [
        {
          label: "Manage Courses",
          icon: Settings,
          link: "/manage-courses",
          color: "text-blue-600"
        },
      ],
    },
    {
      title: "Home Page Content",
      description: "Manage achievements, recognitions, magazine features and sponsors",
      icon: List,
      actions: [
        {
          label: "Manage Home Content",
          icon: Settings,
          link: "/manage-achievements",
          color: "text-purple-600"
        },
      ],
    },
    {
      title: "User Management",
      description: "View and modify users, roles and profiles",
      icon: UserIcon,
      actions: [
        {
          label: "Manage Users",
          icon: UserIcon,
          link: "/user-management",
          color: "text-primary"
        }
      ]
    },
    // New option: Order Management
    {
      title: "Order Management",
      description: "View & update orders placed in your shop",
      icon: Package,
      actions: [
        {
          label: "Go to Orders",
          icon: Package,
          link: "/admin-orders",
          color: "text-primary"
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 mt-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {userProfile?.fullName || userProfile?.email}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminOptions.map((option, index) => (
          <Card key={index} className="hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <option.icon className="h-6 w-6" />
                <CardTitle className="text-xl">{option.title}</CardTitle>
              </div>
              <p className="text-sm">
                {option.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {option.actions.map((action, actionIndex) => (
                  <Link
                    key={actionIndex}
                    to={action.link}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-200"
                  >
                    <action.icon className={`h-5 w-5 ${action.color || 'text-primary'}`} />
                    <span className="font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;
