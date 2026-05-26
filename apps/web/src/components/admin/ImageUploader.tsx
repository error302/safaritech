"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Cloud, AlertCircle } from "lucide-react";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  multiple?: boolean;
  /** @deprecated Cloudinary is always used now. This prop is kept for backward compatibility. */
  uploadTo?: "cloudinary" | "local";
};

export default function ImageUploader({ value, onChange, multiple = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Use a ref to track the latest value to avoid stale closures
  const valueRef = useRef(value);
  valueRef.current = value;

  const getExistingUrls = useCallback(() => {
    const current = valueRef.current;
    return current ? current.split(",").filter(Boolean) : [];
  }, []);

  const handleFile = async (file: File): Promise<void> => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB");
      return;
    }

    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Read the latest value from ref to avoid race conditions
      if (multiple) {
        const currentUrls = valueRef.current ? valueRef.current.split(",").filter(Boolean) : [];
        onChange([...currentUrls, data.url].join(","));
      } else {
        onChange(data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    setUploadCount(0);
    setUploadTotal(fileArray.length);

    // Upload files sequentially to avoid race conditions
    for (let i = 0; i < fileArray.length; i++) {
      await handleFile(fileArray[i]);
      setUploadCount(i + 1);
    }

    setUploading(false);
    // Reset file input so the same file can be re-uploaded
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const existingUrls = value ? value.split(",").filter(Boolean) : [];

  const removeImage = (url: string) => {
    const filtered = existingUrls.filter((u) => u !== url);
    onChange(filtered.join(","));
    setError("");
  };

  return (
    <div className="space-y-3">
      {/* Cloud upload indicator */}
      <div className="flex items-center gap-2">
        <Cloud className="w-3.5 h-3.5 text-neon" />
        <span className="text-xs text-gray-500">Images are uploaded to Cloudinary</span>
      </div>

      {/* Image previews */}
      {existingUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existingUrls.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-safariborder group">
              <img src={url} alt={`Uploaded image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove uploaded image ${i + 1}`}
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInput.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          uploading
            ? "border-neon/50 bg-neon/5 cursor-wait"
            : dragOver
            ? "border-neon bg-neon/5"
            : "border-safariborder hover:border-neon/50 bg-safarigray/50"
        } h-32`}
      >
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              handleFiles(files);
            }
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-neon">
            <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">
              Uploading {uploadTotal > 1 ? `${uploadCount}/${uploadTotal}` : ""}...
            </span>
            {uploadTotal > 1 && (
              <div className="w-32 h-1.5 bg-safariborder rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon rounded-full transition-all duration-300"
                  style={{ width: `${(uploadCount / uploadTotal) * 100}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-safariborder flex items-center justify-center text-gray-500">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                Click or drag image to upload
              </p>
              <p className="text-xs text-gray-500 mt-0.5">PNG, JPG, WebP up to 10MB</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-red-500">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
