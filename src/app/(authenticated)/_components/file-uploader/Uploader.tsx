"use client";


import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { Card, CardContent } from "@/components/ui/card";
import { deleteFileFunction, uploadFileFunction } from "@/lib/cloudinary/action";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  publicId?: string;
  isDeleting: boolean;
  error: boolean;
  cloudinaryUrl?: string;
  fileType: "image" | "video";
}

interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
  uploadFolder?: string | null;
}

export function Uploader({
  onChange,
  value,
  fileTypeAccepted,
  uploadFolder = null,
}: iAppProps) {
  // Define initial file state
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: fileTypeAccepted,
    publicId: value,
    cloudinaryUrl: value || undefined,
  });

  const setErrorState = useCallback(() => {
    setFileState((prev) => ({
      ...prev,
      uploading: false,
      progress: 0,
      error: true,
    }));
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
        error: false,
      }));

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileType", fileTypeAccepted);
        if (uploadFolder) {
          formData.append("folder", uploadFolder);
        }

        const response = await uploadFileFunction(formData);

        // Handle error response
        if (
          !response ||
          (typeof response === "object" &&
            "status" in response &&
            response.status === "error")
        ) {
          const errorMessage =
            response && typeof response === "object" && "message" in response
              ? (response.message as string)
              : "Failed to upload file";
          toast.error(errorMessage);
          setErrorState();
          return;
        }

        if ("url" in response && "publicId" in response) {
          const { url, publicId } = response;

          setFileState((prev) => ({
            ...prev,
            progress: 100,
            uploading: false,
            publicId,
            cloudinaryUrl: url,
          }));

          onChange?.(url);
          toast.success("File uploaded successfully");
        } else {
          toast.error("Invalid response from server");
          setErrorState();
        }
      } catch {
        toast.error("Something went wrong while uploading file");
        setErrorState();
      }
    },
    [fileTypeAccepted, onChange, uploadFolder, setErrorState]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (
          fileState.cloudinaryUrl &&
          !fileState.cloudinaryUrl.startsWith("http")
        ) {
          URL.revokeObjectURL(fileState.cloudinaryUrl);
        }

        setFileState({
          file,
          uploading: false,
          progress: 0,
          cloudinaryUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: fileTypeAccepted,
          publicId: undefined,
        });

        uploadFile(file);
      }
    },
    [fileState.cloudinaryUrl, uploadFile, fileTypeAccepted]
  );

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.cloudinaryUrl || !fileState.publicId)
      return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await deleteFileFunction(fileState.publicId);

      // Handle failed case
      if (
        !response ||
        (typeof response === "object" &&
          "status" in response &&
          response.status === "error")
      ) {
        toast.error("Failed to remove file from storage");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));
        return;
      }

      // If successful
      if (
        fileState.cloudinaryUrl &&
        !fileState.cloudinaryUrl.startsWith("http")
      ) {
        URL.revokeObjectURL(fileState.cloudinaryUrl);
      }

      onChange?.("");

      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        cloudinaryUrl: undefined,
        error: false,
        fileType: fileTypeAccepted,
        id: null,
        isDeleting: false,
        publicId: undefined,
      }));

      toast.success("File removed successfully");
    } catch {
      toast.error("Error removing file. Please try again.");
      setErrorState();
    }
  }

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileSizeTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (fileSizeTooBig) {
        toast.error("File size exceeds the limit.");
      }

      if (tooManyFiles) {
        toast.error("Too many files selected. Max limit is 1.");
      }
    }
  }

  const dropzoneProps = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize:
      fileTypeAccepted === "image" ? 10 * 1024 * 1024 : 100 * 1024 * 1024, // 10MB for image, 100MB for video (Cloudinary free tier limit)
    onDropRejected: rejectedFiles,
    disabled:
      fileState.uploading || (!!fileState.cloudinaryUrl && !fileState.error),
  });

  const { getRootProps, getInputProps, isDragActive, open } = dropzoneProps;

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      );
    }

    if (fileState.error) {
      return <RenderErrorState open={open} />;
    }

    if (fileState.cloudinaryUrl) {
      return (
        <RenderUploadedState
          handleRemoveFile={handleRemoveFile}
          previewUrl={fileState.cloudinaryUrl}
          isDeleting={fileState.isDeleting}
          fileType={fileState.fileType}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (
        fileState.cloudinaryUrl &&
        !fileState.cloudinaryUrl.startsWith("http")
      ) {
        URL.revokeObjectURL(fileState.cloudinaryUrl);
      }
    };
  }, [fileState.cloudinaryUrl]);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
