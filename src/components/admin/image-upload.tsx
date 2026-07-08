"use client";

import * as React from "react";
import { Upload, X, Loader2, ImageIcon, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (url: string) => void;
  adminFetch: (url: string, opts?: RequestInit) => Promise<Response>;
  label?: string;
}

/**
 * Image upload field with two modes:
 * 1. Upload a file → POST /api/admin/upload → returns URL
 * 2. Paste a URL directly
 *
 * Shows a preview thumbnail and a remove button.
 */
export function ImageUpload({ value, onChange, adminFetch, label = "Image" }: Props) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const applyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput((v) => !v)}
          className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link2 className="h-3 w-3" />
          {showUrlInput ? "Upload instead" : "Paste URL instead"}
        </button>
      </div>

      {/* Preview + upload dropzone */}
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="relative h-20 w-20 shrink-0 rounded-lg border border-border bg-secondary/30 overflow-hidden">
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Remove image"
                className="absolute top-1 right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground/40">
              <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Upload / URL input */}
        <div className="flex-1 min-w-0">
          {showUrlInput ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={applyUrl}
                className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border bg-card text-xs font-medium hover:bg-secondary transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Set
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={cn(
                "w-full h-20 rounded-lg border border-dashed border-border bg-secondary/20 hover:bg-secondary/40 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground",
                uploading && "opacity-70 cursor-wait"
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-xs">Uploading…</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-xs font-medium">
                    Click to upload
                  </span>
                  <span className="text-[10px]">PNG, JPG, WebP up to 10MB</span>
                </>
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-[11px] text-destructive">{error}</p>
      )}

      {value && !showUrlInput && (
        <p className="mt-1.5 text-[10px] font-mono text-muted-foreground truncate">
          {value}
        </p>
      )}
    </div>
  );
}
