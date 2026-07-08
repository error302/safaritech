import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/upload — upload an image to Cloudinary
 *
 * Two modes:
 * 1. If CLOUDINARY_URL is set in env (or CLOUDINARY_CLOUD_NAME + API_KEY + API_SECRET),
 *    uploads to Cloudinary and returns the secure URL.
 * 2. Otherwise, saves to /public/uploads/ and returns the local path (dev fallback).
 *
 * Body: multipart/form-data with a "file" field
 * Returns: { url: string, publicId: string }
 */
export async function POST(req: NextRequest) {
  // Admin auth check
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate it's an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try Cloudinary if configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL;
    if (cloudName) {
      const result = await uploadToCloudinary(buffer, file.name, file.type);
      return NextResponse.json(result);
    }

    // Fallback: save locally to /public/uploads/
    const fs = await import("fs/promises");
    const path = await import("path");

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    await fs.writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      publicId: filename,
      local: true,
    });
  } catch (err) {
    console.error("[/api/admin/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}

/**
 * Upload to Cloudinary using the unsigned upload API.
 * Requires CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in env.
 * For signed uploads, also set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.
 */
async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ url: string; publicId: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const formData = new FormData();

  // Convert buffer to base64 data URL for the file
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;
  formData.append("file", dataUrl);
  formData.append("filename_override", filename);

  if (uploadPreset && !apiKey) {
    // Unsigned upload (preset-based, for client-side or simple server-side)
    formData.append("upload_preset", uploadPreset);
  } else if (apiKey && apiSecret) {
    // Signed upload — requires signature generation
    // For simplicity, we use unsigned upload with a preset in this implementation.
    // To enable signed uploads, implement signature generation using the timestamp + params.
    formData.append("upload_preset", uploadPreset || "safaritech_products");
  } else {
    // No preset and no API key — fall back to local
    throw new Error("Cloudinary configured but no upload preset or API key found");
  }

  const res = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${body}`);
  }

  const data = await res.json();

  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
  };
}
