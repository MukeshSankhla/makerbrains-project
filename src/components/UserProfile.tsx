import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/firebaseUserService';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Mail, Edit, Book } from 'lucide-react';
import { uploadProfilePhoto, uploadProfileBackground } from '@/services/firebaseUserService';
import { useNavigate } from "react-router-dom";
import { useAddressBook } from '@/hooks/useAddressBook';
import { db } from '@/config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { Course } from '@/types/shop';

export const UserProfile = () => {
  const { user, userProfile, isAdmin } = useAuth();
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

  // Hook to get addresses for the profile user
  const { addresses } = useAddressBook();

  // Get the latest (or first, or defaulted) address of the user
  const latestAddress = addresses && addresses.length > 0 ? addresses[0] : null;

  // Purchases state
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userProfile?.purchasedCourses?.length) {
        setMyCourses([]);
        return;
      }
      // Fetch course details for each purchased ID
      const coursePromises = userProfile.purchasedCourses.map(async (id: string) => {
        const ref = doc(db, "courses", id);
        const snap = await getDoc(ref);
        if (snap.exists()) return snap.data() as Course;
        return null;
      });
      const results = await Promise.all(coursePromises);
      setMyCourses(results.filter(Boolean) as Course[]);
    };
    fetchCourses();
    // eslint-disable-next-line
  }, [userProfile?.purchasedCourses]);

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

  const navigate = useNavigate();

  if (!user || !userProfile) return null;

  // Initials fallback for avatar
  const fallbackInitial = userProfile.fullName?.charAt(0).toUpperCase() || userProfile.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="max-w-2xl mx-auto pb-10 mt-10 space-y-8 relative">
      {/* Profile Card below background and avatar */}
      <Card className="overflow-visible shadow-md pt-6">
        <CardHeader className="flex flex-col items-center pt-0 pb-4 relative">
          <h2 className="text-3xl font-bold text-foreground text-center">{userProfile.fullName || "No Name Set"}</h2>
          <div className="flex flex-col gap-1 mt-2 items-center">
            <span className="flex items-center text-muted-foreground gap-2 text-base">
              <Mail className="w-4 h-4" />
              {userProfile.email}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-8 px-5 md:px-10 bg-background rounded-b-xl">
          {!isEditing ? (
            <div className="space-y-6 mt-4">
              <div>
                <Label className="font-semibold">Bio</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="whitespace-pre-line">{userProfile.info || <span className="text-muted-foreground italic">No bio</span>}</span>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  {/* Updated: Show address from AddressBook */}
                  {latestAddress ? (
                    <span>
                      {latestAddress.name}, {latestAddress.line1}
                      {latestAddress.line2 && <> {latestAddress.line2}</>}, {latestAddress.city}, {latestAddress.state}, {latestAddress.zip}, {latestAddress.country}
                      <br />
                      <span className="text-xs text-muted-foreground">{latestAddress.phone}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">No address</span>
                  )}
                </div>
              </div>
              {/* Social Media */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {userProfile.socialMedia?.twitter && (
                    <div>
                      <Label className="text-xs">Twitter</Label>
                      <a
                        href={userProfile.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-words text-blue-600 hover:underline"
                      >
                        {userProfile.socialMedia.twitter}
                      </a>
                    </div>
                  )}
                  {userProfile.socialMedia?.linkedin && (
                    <div>
                      <Label className="text-xs">LinkedIn</Label>
                      <a
                        href={userProfile.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-words text-blue-600 hover:underline"
                      >
                        {userProfile.socialMedia.linkedin}
                      </a>
                    </div>
                  )}
                  {userProfile.socialMedia?.github && (
                    <div>
                      <Label className="text-xs">GitHub</Label>
                      <a
                        href={userProfile.socialMedia.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-words text-blue-600 hover:underline"
                      >
                        {userProfile.socialMedia.github}
                      </a>
                    </div>
                  )}
                  {userProfile.socialMedia?.website && (
                    <div>
                      <Label className="text-xs">Website</Label>
                      <a
                        href={userProfile.socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-words text-blue-600 hover:underline"
                      >
                        {userProfile.socialMedia.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/address-book')}
                  className="rounded-full border text-primary hover:bg-primary/10"
                >
                  Manage Address Book
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  aria-label="Edit Profile"
                  className="rounded-full shadow-lg border bg-background/80 hover:bg-primary/90 transition-colors"
                  onClick={handleEdit}
                >
                  <Edit className="h-5 w-5 text-primary" />
                </Button>
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
                <Label htmlFor="info">Bio</Label>
                <div className="flex items-start gap-2">
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
      {/* My Courses List */}
      <div>
        <Label className="font-semibold">My Courses</Label>
        <div className="flex flex-col gap-3 mt-1">
          {myCourses.length === 0 ? (
            <span className="text-muted-foreground italic">No purchased courses</span>
          ) : (
            myCourses.map((c) => (
              <div key={c.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-4">
                  <img src={c.image} alt={c.title} className="w-16 h-16 rounded-md object-cover border" />
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.instructor}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `/courses/${c.id}`}
                  size="sm"
                >
                  View Course
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
