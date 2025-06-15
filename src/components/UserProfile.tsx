import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/firebaseUserService';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Mail, MapPin, Info, Edit } from 'lucide-react';
import { uploadProfilePhoto, uploadProfileBackground } from '@/services/firebaseUserService';

export const UserProfile = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // New image states
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(user?.photoURL || userProfile?.photoURL);
  const [bgPhoto, setBgPhoto] = useState<string | undefined>(userProfile?.backgroundURL);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

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

  // Handlers for image uploads
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setLoading(true);
    try {
      const url = await uploadProfilePhoto(user.uid, file);
      setProfilePhoto(url);
      toast({ title: "Profile photo updated" });
      setFormData(f => ({ ...f, photoURL: url }));
    } catch {
      toast({ title: "Failed to upload photo", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleBgPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setLoading(true);
    try {
      const url = await uploadProfileBackground(user.uid, file);
      setBgPhoto(url);
      toast({ title: "Background photo updated" });
    } catch {
      toast({ title: "Failed to upload background", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
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
  };

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
      setIsEditing(false);
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

  // Initials fallback for avatar
  const fallbackInitial = userProfile.fullName?.charAt(0).toUpperCase() || userProfile.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="max-w-2xl mx-auto pb-10 space-y-6">
      <div className="relative rounded-lg overflow-hidden">
        {bgPhoto ? (
          <img
            src={bgPhoto}
            className="w-full h-44 object-cover"
            alt="Background"
          />
        ) : (
          <div className="w-full h-44 bg-gradient-to-r from-primary/60 to-secondary/60"></div>
        )}
        {isEditing && (
          <>
            <button
              type="button"
              onClick={() => bgInputRef.current?.click()}
              className="absolute top-3 right-3 bg-background/80 p-2 rounded-full shadow hover:bg-primary/90 transition-colors z-10"
            >
              <Edit className="h-5 w-5 text-primary" />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={bgInputRef}
              onChange={handleBgPhotoChange}
            />
          </>
        )}
      </div>
      <Card className="p-0 overflow-visible">
        <CardHeader className="flex flex-col items-center relative -mt-14">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-background shadow-lg animate-scale-in bg-background">
              <AvatarImage src={profilePhoto || undefined} alt={userProfile.fullName || 'Avatar'} />
              <AvatarFallback>
                <UserIcon className="w-10 h-10 text-muted-foreground" />
                <span className="sr-only">{fallbackInitial}</span>
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute bottom-3 right-2 bg-background/80 p-2 rounded-full shadow hover:bg-primary/90 transition-colors z-10"
                >
                  <Edit className="h-4 w-4 text-primary" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={profileInputRef}
                  onChange={handleProfilePhotoChange}
                />
              </>
            )}
          </div>
          <div className="pt-3 text-center">
            <h2 className="text-2xl font-bold text-foreground">{userProfile.fullName || "No Name Set"}</h2>
            <div className="flex justify-center items-center mt-1 text-muted-foreground gap-2 text-base">
              <Mail className="w-4 h-4" />
              <span>{userProfile.email}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-8 px-4 md:px-8 bg-background rounded-b-lg shadow-inner">
          {!isEditing ? (
            <div className="space-y-5">
              <div>
                <Label>Bio/Info</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="whitespace-pre-line">{userProfile.info || <span className="text-muted-foreground italic">No bio</span>}</span>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.address || <span className="text-muted-foreground italic">No address</span>}</span>
                </div>
              </div>
              {/* Only show if at least one social media is filled */}
              {(userProfile.socialMedia?.twitter || userProfile.socialMedia?.linkedin ||
                userProfile.socialMedia?.github || userProfile.socialMedia?.website) && (
                <div>
                  <Label>Social Media</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {userProfile.socialMedia?.twitter && (
                      <div>
                        <Label>Twitter</Label>
                        <span className="block break-words">{userProfile.socialMedia.twitter}</span>
                      </div>
                    )}
                    {userProfile.socialMedia?.linkedin && (
                      <div>
                        <Label>LinkedIn</Label>
                        <span className="block break-words">{userProfile.socialMedia.linkedin}</span>
                      </div>
                    )}
                    {userProfile.socialMedia?.github && (
                      <div>
                        <Label>GitHub</Label>
                        <span className="block break-words">{userProfile.socialMedia.github}</span>
                      </div>
                    )}
                    {userProfile.socialMedia?.website && (
                      <div>
                        <Label>Website</Label>
                        <span className="block break-words">{userProfile.socialMedia.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  Role: <span className="font-medium capitalize">{userProfile.role}</span>
                </div>
                {!isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    aria-label="Edit Profile"
                    className="rounded-full shadow-lg border bg-background/80 hover:bg-primary/90 transition-colors animate-scale-in"
                    onClick={handleEdit}
                  >
                    <Edit className="h-5 w-5 text-primary" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
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
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// NOTE: src/components/UserProfile.tsx is 286 lines long! Consider asking to refactor into smaller files for maintainability.
