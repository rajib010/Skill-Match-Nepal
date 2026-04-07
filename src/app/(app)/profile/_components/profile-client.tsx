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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  profileSchema,
  ProfileSchemaType,
  skillSchema,
  changeProfilePasswordSchema,
  ChangeProfilePasswordSchemaType,
} from "../schema";

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

const getProfileDefaultValues = (user: UserData): ProfileSchemaType => ({
  name: user.name,
  phone: user.profile?.phone || "",
  location: user.profile?.location || "",
  bio: user.profile?.bio || "",
  experience: user.profile?.experience || "",
  education: user.profile?.education || "",
});

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

  const profileForm = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: getProfileDefaultValues(user),
  });

  const passwordForm = useForm<ChangeProfilePasswordSchemaType>({
    resolver: zodResolver(changeProfilePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [newSkill, setNewSkill] = useState({
    skillName: "",
    level: "intermediate",
  });
  const [deletePassword, setDeletePassword] = useState("");

  const { isDirty: isProfileDirty } = profileForm.formState;
  const { isDirty: isPasswordDirty } = passwordForm.formState;

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateProfile = async (values: ProfileSchemaType) => {
    setLoading(true);
    try {
      const result = await updateProfile(values);
      if (result.success) {
        showMessage("success", "Profile updated successfully!");
        profileForm.reset(values);
        setEditing(false);
        router.refresh();
      } else {
        showMessage("error", result.message || "Failed to update profile");
      }
    } catch {
      showMessage("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    const result = skillSchema.safeParse(newSkill);
    if (!result.success) {
      const firstError = result.error.issues[0];
      showMessage("error", firstError?.message || "Invalid skill data");
      return;
    }

    setLoading(true);
    try {
      const res = await addSkill(result.data.skillName, result.data.level);
      if (res.success) {
        showMessage("success", "Skill added successfully!");
        setNewSkill({ skillName: "", level: "intermediate" });
        router.refresh();
      } else {
        showMessage("error", res.message || "Failed to add skill");
      }
    } catch {
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
    } catch {
      showMessage("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: ChangeProfilePasswordSchemaType) => {
    setLoading(true);
    try {
      const result = await changePassword({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        showMessage("error", result.error.message || "Failed to change password");
        return;
      }

      showMessage("success", "Password changed successfully!");
      setShowPasswordModal(false);
      passwordForm.reset();
    } catch {
      showMessage("error", "An error occurred");
    } finally {
      setLoading(false);
    }
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
    } catch {
      showMessage("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    profileForm.reset(getProfileDefaultValues(user));
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
                    onClick={handleCancelEdit}
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
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(handleUpdateProfile)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <User className="h-4 w-4 inline mr-1" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!editing}
                            placeholder="Your full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            disabled={!editing}
                            placeholder="Your phone number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!editing}
                          placeholder="Your location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <FileText className="h-4 w-4 inline mr-1" />
                        Bio
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!editing}
                          rows={3}
                          placeholder="Tell us about yourself"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Briefcase className="h-4 w-4 inline mr-1" />
                        Experience
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!editing}
                          rows={4}
                          placeholder="Your work experience"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <GraduationCap className="h-4 w-4 inline mr-1" />
                        Education
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!editing}
                          rows={3}
                          placeholder="Your education background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {editing && (
                  <Button
                    type="submit"
                    disabled={loading || !isProfileDirty}
                    className="w-full"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </form>
            </Form>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
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
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleChangePassword)}
              className="space-y-4 py-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="currentPassword">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isPasswordDirty}
                >
                  {loading ? "Changing..." : "Change Password"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
