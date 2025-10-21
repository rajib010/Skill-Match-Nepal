"use server";

import { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "@/config";
import { v2 as cloudinary } from "cloudinary";

type UploadResponse =
  | { url: string; publicId: string }
  | { status: "error"; message: string };

type DeleteResponse =
  | { status: "success" }
  | { status: "error"; message: string };

// Helper function to ensure Cloudinary is configured
function getCloudinaryConfig() {
  const cloudName = CLOUD_NAME;
  const apiKey = CLOUDINARY_API_KEY;
  const apiSecret = CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary configuration missing. Please check your environment variables."
    );
  }

  // Configure Cloudinary each time to ensure it's set
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return { cloudName, apiKey, apiSecret };
}

export async function uploadFileFunction(
  formData: FormData
): Promise<UploadResponse> {
  try {
    // Ensure Cloudinary is configured
    getCloudinaryConfig();

    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as "image" | "video";
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return { status: "error", message: "No file provided" };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: fileType === "video" ? "video" : "image",
          folder: folder || "uploads",
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload error:", error);
            resolve({
              status: "error",
              message: error?.message || "Upload failed",
            });
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "An error occurred during upload",
    };
  }
}

export async function deleteFileFunction(
  publicId: string
): Promise<DeleteResponse> {
  try {
    // Ensure Cloudinary is configured
    getCloudinaryConfig();

    if (!publicId) {
      return { status: "error", message: "No public ID provided" };
    }

    const resourceType = publicId.includes("/video/") ? "video" : "image";

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === "ok") {
      return { status: "success" };
    } else {
      return { status: "error", message: "Failed to delete file" };
    }
  } catch (error) {
    console.error("Delete error:", error);
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "An error occurred during deletion",
    };
  }
}
