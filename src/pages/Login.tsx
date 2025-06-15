
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGithub();
      navigate('/');
    } catch (error) {
      console.error('GitHub sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(resetEmail);
      setShowResetForm(false);
      setResetEmail("");
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-background">
        
        <div className="flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                Enter your email address to receive a password reset link
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setShowResetForm(false)}
                >
                  Back to Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center py-2 px-2">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome Back" : "Join MakerBrains"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to your account to continue learning" 
                : "Create an account to start your maker journey"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center text-sm text-muted-foreground">
                Or continue with
              </div>
              <div className="mt-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGithubSignIn}
                  disabled={loading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
