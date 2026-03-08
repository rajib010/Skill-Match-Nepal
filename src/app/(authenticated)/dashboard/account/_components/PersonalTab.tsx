"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Check, SquarePen, User, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { updateUserDetail, UserDetailType } from "../action";
import { formatDate, preventNumberKeys } from "@/app/(authenticated)/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserDetailSchemaType } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { constructUrl } from "@/lib/cloudinary/utils";
import { useUser } from "@/context/useUser";

interface iAppProps {
  data: UserDetailType;
}

function PersonalTab({ data }: iAppProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    data.image ? constructUrl(data.image) : null
  );

  const { user } = useUser();
  const router = useRouter();

  const form = useForm<UpdateUserDetailSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: data.id || "",
      name: data.name || "",
      image: data.image || "",
      email: data.email || "",
    },
  });

  if (!user) {
    return null;
  }

  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = form;

  const currentImage = watch("image");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(data.image ? constructUrl(data.image) : null);
    reset();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // presigned URL
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
          uploadFolder: "users",
        }),
      });

      if (!presignedResponse.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { presignedUrl, key } = await presignedResponse.json();

      // Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Update form value with the S3 key
      setValue("image", key, { shouldDirty: true });
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
      setPreviewImage(data.image ? constructUrl(data.image) : null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImage) return;

    try {
      setIsUploading(true);

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: currentImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setValue("image", "", { shouldDirty: true });
      setPreviewImage(null);
    } catch {
      toast.error("Failed to remove profile image.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: UpdateUserDetailSchemaType) => {
    try {
      const res = await updateUserDetail(values);
      if (res.success) {
        toast.success(res.message);
        reset({
          id: values.id,
          name: values.name,
          email: values.email,
          image: values.image,
        });
        setPreviewImage(values.image ? constructUrl(values.image) : null);
        setIsEditing(false);

        router.refresh();
        return;
      }
      toast.error(res.message);
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const centerName = data?.centerPersonnel?.center?.centerName;

  return (
    <Card className="px-0 max-w-2xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center leading-6 gap-2">
          Update Your Personal Information
        </CardTitle>
        <CardDescription className="">
          Keep your personal information up to date.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-10">
            <div className="flex flex-col sm:flex-row justify-between md:items-center">
              <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
              <div className="flex justify-end">
                {!isEditing ? (
                  <Button type="button" onClick={handleEdit} className="gap-2">
                    <SquarePen className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      className="gap-2 text-xs md:text-base"
                      disabled={isSubmitting || isUploading}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="gap-2 text-xs md:text-base"
                      disabled={!isDirty || isSubmitting || isUploading}
                    >
                      <Check className="w-4 h-4" />
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="flex items-center w-full py-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 overflow-hidden shadow-xl">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-2">
                    <label className="bg-primary p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading || isSubmitting}
                      />
                    </label>

                    {previewImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-destructive p-2 rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
                        disabled={isUploading || isSubmitting}
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="text-white text-sm">Loading...</div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting || !isEditing}
                        onKeyDown={preventNumberKeys}
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        {/* Account Information */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge className="font-medium uppercase">{data.role}</Badge>
            </div>

            {centerName && (
              <div>
                <p className="text-sm text-muted-foreground">Center</p>
                <p className="font-medium">{centerName}</p>
              </div>
            )}

            {data.createdAt && (
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">{formatDate(data.createdAt)}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Email Status</p>
              <p className="font-medium">
                {data.emailVerified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-yellow-600">Unverified</span>
                )}
              </p>
            </div>

            {data.banned !== null && (
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="font-medium">
                  {data.banned ? (
                    <span className="text-red-600">Banned</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PersonalTab;
