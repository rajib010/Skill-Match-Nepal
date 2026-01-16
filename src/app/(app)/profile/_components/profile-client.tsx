"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Trash2,
  Lock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateProfile,
  addSkill,
  deleteSkill,
  deleteAccount,
} from "../actions";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/auth/client";
import DialogWrapper from "@/app/(authenticated)/dashboard/_components/dialog-wrapper";
import { DialogFooter } from "@/components/ui/dialog";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  profile: {
    id: string;
    phone: string | null;
    location: string | null;
    bio: string | null;
    experience: string | null;
    education: string | null;
    cvUrl: string | null;
    skills: Array<{
      id: string;
      skillName: string;
      level: string | null;
    }>;
  } | null;
};

export default function ProfileClient({ user }: { user: UserData }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.profile?.phone || "",
    location: user.profile?.location || "",
    bio: user.profile?.bio || "",
    experience: user.profile?.experience || "",
    education: user.profile?.education || "",
  });

  const [newSkill, setNewSkill] = useState({
    skillName: "",
    level: "intermediate",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        showMessage("success", "Profile updated successfully!");
        setEditing(false);
        router.refresh();
      } else {
        showMessage("error", result.message || "Failed to update profile");
      }
    } catch (error) {
      showMessage("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.skillName.trim()) return;

    setLoading(true);
    try {
      const result = await addSkill(newSkill.skillName, newSkill.level);
      if (result.success) {
        showMessage("success", "Skill added successfully!");
        setNewSkill({ skillName: "", level: "intermediate" });
        router.refresh();
      } else {
        showMessage("error", result.message || "Failed to add skill");
      }
    } catch (error) {
      showMessage("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setLoading(true);
    try {
      const result = await deleteSkill(skillId);
      if (result.success) {
        showMessage("success", "Skill removed successfully!");
        router.refresh();
      } else {
        showMessage("error", result.message || "Failed to remove skill");
      }
    } catch (error) {
      showMessage("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // if (passwordData.newPassword !== passwordData.confirmPassword) {
    //   showMessage("error", "Passwords do not match");
    //   return;
    // }
    // if (passwordData.newPassword.length < 8) {
    //   showMessage("error", "Password must be at least 8 characters");
    //   return;
    // }
    // setLoading(true);
    // try {
    //   const result = await changePassword(
    //     passwordData.currentPassword,
    //     passwordData.newPassword
    //   );
    //   if (result.success) {
    //     showMessage("success", "Password changed successfully!");
    //     setShowPasswordModal(false);
    //     setPasswordData({
    //       currentPassword: "",
    //       newPassword: "",
    //       confirmPassword: "",
    //     });
    //   } else {
    //     showMessage("error", result.error || "Failed to change password");
    //   }
    // } catch (error) {
    //   showMessage("error", "An error occurred");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      showMessage("error", "Password is required");
      return;
    }

    setLoading(true);
    try {
      const result = await deleteAccount(deletePassword);
      if (result.success) {
        showMessage("success", "Account deleted successfully. Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        showMessage("error", result.message || "Failed to delete account");
      }
    } catch (error) {
      showMessage("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const skills = user.profile?.skills || [];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Message Alert */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription className="flex items-center justify-between">
              <span>{message.text}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </CardDescription>
                  <Badge className="mt-2">{user.role}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {!editing ? (
                  <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user.name,
                        phone: user.profile?.phone || "",
                        location: user.profile?.location || "",
                        bio: user.profile?.bio || "",
                        experience: user.profile?.experience || "",
                        education: user.profile?.education || "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="h-4 w-4 inline mr-1" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                <FileText className="h-4 w-4 inline mr-1" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                disabled={!editing}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">
                <Briefcase className="h-4 w-4 inline mr-1" />
                Experience
              </Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                disabled={!editing}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">
                <GraduationCap className="h-4 w-4 inline mr-1" />
                Education
              </Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) =>
                  setFormData({ ...formData, education: e.target.value })
                }
                disabled={!editing}
                rows={3}
              />
            </div>

            {editing && (
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  {skill.skillName} ({skill.level})
                  {editing && (
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="ml-2 text-destructive hover:text-destructive/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            {editing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Skill name"
                  value={newSkill.skillName}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, skillName: e.target.value })
                  }
                  className="flex-1"
                />
                <Select
                  value={newSkill.level}
                  onValueChange={(value) =>
                    setNewSkill({ ...newSkill, level: value })
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddSkill} disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password Modal */}
        <DialogWrapper
          isOpen={showPasswordModal}
          onOpenChange={() => setShowPasswordModal((p) => !p)}
          noAutoClose={true}
          title="Change Password"
        >
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogWrapper>

        {/* Delete Account Modal */}
        <DialogWrapper
          isOpen={showDeleteModal}
          onOpenChange={() => setShowDeleteModal((p) => !p)}
          title="Delete Account"
          description=" This action cannot be undone. This will permanently delete your
                account and remove all your data."
          noAutoClose={true}
        >
          <Alert variant="destructive">
            <AlertDescription>
              All your data, including applications, profile information, and
              skills will be permanently removed.
            </AlertDescription>
          </Alert>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deletePassword">
                Enter your password to confirm
              </Label>
              <Input
                id="deletePassword"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogWrapper>
      </div>
    </div>
  );
}
