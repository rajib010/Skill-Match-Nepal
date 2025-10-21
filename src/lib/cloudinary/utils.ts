import { CLOUD_NAME } from "@/config";

export function constructUrl(
  publicIdOrUrl: string,
  transformations?: string
): string {
  if (!publicIdOrUrl || publicIdOrUrl.trim() === "") {
    throw new Error("Empty publicId or URL provided.");
  }

  // If it's already a complete URL, return it
  if (
    publicIdOrUrl.startsWith("http://") ||
    publicIdOrUrl.startsWith("https://")
  ) {
    return publicIdOrUrl;
  }

  const cloudName = CLOUD_NAME;

  if (!cloudName) {
    throw new Error("Cloudinary cloud name not configured");
  }

  // Clean the public ID
  const cleanPublicId = publicIdOrUrl.replace(/^\/+/, "");

  // Determine resource type (image or video)
  const isVideo =
    cleanPublicId.includes("/video/") || cleanPublicId.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  // Build the URL
  const baseUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload`;

  if (transformations) {
    return `${baseUrl}/${transformations}/${cleanPublicId}`;
  }

  return `${baseUrl}/${cleanPublicId}`;
}

/**
 * Constructs a Cloudinary image URL with transformations
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 */
export function constructImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "crop" | "thumb" | "pad" | "limit";
    quality?: number | "auto";
    format?: "auto" | "jpg" | "png" | "webp" | "avif";
    gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
  }
): string {
  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);
  if (options?.gravity) transformations.push(`g_${options.gravity}`);

  const transformString =
    transformations.length > 0 ? transformations.join(",") : undefined;

  return constructUrl(publicId, transformString);
}

export function constructVideoUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: "auto" | "mp4" | "webm";
  }
): string {
  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);

  const transformString =
    transformations.length > 0 ? transformations.join(",") : undefined;

  return constructUrl(publicId, transformString);
}

export function extractPublicId(url: string): string {
  if (!url.includes("cloudinary.com")) {
    throw new Error("Not a valid Cloudinary URL");
  }

  // Match pattern: /upload/[transformations]/publicId or /upload/publicId
  const match = url.match(
    /\/upload\/(?:v\d+\/)?(?:[^/]+\/)*(.+?)(?:\.[^.]+)?$/
  );

  if (!match) {
    throw new Error("Could not extract public ID from URL");
  }

  return match[1];
}
