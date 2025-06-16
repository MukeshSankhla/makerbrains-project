
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeartIcon, UsersIcon, BookOpenIcon, AwardIcon } from "lucide-react";

export default function AboutUs() {
  const stats = [
    { label: "Projects Created", value: "500+", icon: BookOpenIcon },
    { label: "Students Taught", value: "10,000+", icon: UsersIcon },
    { label: "Awards Won", value: "25+", icon: AwardIcon },
    { label: "Years of Experience", value: "8+", icon: HeartIcon },
  ];

  const values = [
    {
      title: "Innovation",
      description: "We believe in pushing the boundaries of what's possible with technology and creativity."
    },
    {
      title: "Education",
      description: "Our mission is to make learning accessible, engaging, and hands-on for everyone."
    },
    {
      title: "Community",
      description: "We foster a supportive community where makers can share, learn, and grow together."
    },
    {
      title: "Quality",
      description: "We are committed to delivering high-quality content, products, and experiences."
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">About Maker Brains</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're passionate about empowering creators, innovators, and makers to bring their ideas to life 
          through education, community, and cutting-edge technology.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center p-6">
            <CardContent className="space-y-3">
              <stat.icon className="h-8 w-8 mx-auto text-primary" />
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Our Story Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Maker Brains was founded with a simple belief: that anyone can be a creator. What started as a 
              small workshop in a garage has grown into a thriving community of makers, learners, and innovators 
              from around the world.
            </p>
            <p>
              We've dedicated ourselves to breaking down the barriers between ideas and reality. Through our 
              comprehensive courses, hands-on workshops, and supportive community, we've helped thousands of 
              people transform their creative visions into tangible projects.
            </p>
            <p>
              From electronics and programming to 3D printing and IoT, we cover the full spectrum of modern 
              making. Our approach combines theoretical knowledge with practical application, ensuring that 
              every student not only learns but truly understands.
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            src="/src/images/profile.png"
            alt="Maker Brains Workshop"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </div>

      {/* Our Values */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Our Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do and shape the way we interact with our community.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center">
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <Card className="bg-primary text-primary-foreground p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-lg max-w-3xl mx-auto opacity-90">
            To democratize technology education and empower the next generation of makers, innovators, 
            and problem solvers. We believe that when people have the tools and knowledge to create, 
            they can change the world.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Learn by Doing
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Create Together
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Innovate Fearlessly
            </Badge>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Start Making?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our community of makers and start your journey today. Whether you're a complete beginner 
          or an experienced creator, we have something for you.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/courses">
            <Button size="lg">Explore Courses</Button>
          </Link>
          <Link to="/workshops">
            <Button variant="outline" size="lg">Join a Workshop</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">Get in Touch</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
