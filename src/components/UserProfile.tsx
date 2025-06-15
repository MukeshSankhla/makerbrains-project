
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/firebaseUserService';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MapPin, Info } from 'lucide-react';

export const UserProfile = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    info: userProfile?.info || '',
    address: userProfile?.address || '',
    socialMedia: {
      twitter: userProfile?.socialMedia?.twitter || '',
      linkedin: userProfile?.socialMedia?.linkedin || '',
      github: userProfile?.socialMedia?.github || '',
      website: userProfile?.socialMedia?.website || '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateUserProfile(user.uid, formData);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userProfile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="info">Bio/Info</Label>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-2" />
                <Textarea
                  id="info"
                  value={formData.info}
                  onChange={(e) => setFormData({ ...formData, info: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Social Media</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    type="url"
                    value={formData.socialMedia.github}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, github: e.target.value }
                    })}
                    placeholder="https://github.com/username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.socialMedia.website}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, website: e.target.value }
                    })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                Role: <span className="font-medium capitalize">{userProfile.role}</span>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
