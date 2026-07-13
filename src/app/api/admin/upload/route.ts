import { createHash, randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { mutationSecurityResponse } from "@/lib/request-security";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ImageFormat {
  extension: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
}

function detectImageFormat(buffer: Buffer): ImageFormat | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { extension: "jpg", mimeType: "image/jpeg" };
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { extension: "png", mimeType: "image/png" };
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { extension: "webp", mimeType: "image/webp" };
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await mutationSecurityResponse(req, "admin-upload", 20, 60 * 60_000);
  if (blocked) return blocked;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image must be between 1 byte and 5 MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const format = detectImageFormat(buffer);
    if (!format) {
      return NextResponse.json(
        { error: "Only valid JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (cloudName && apiKey && apiSecret) {
      return NextResponse.json(
        await uploadToCloudinary(buffer, format, cloudName, apiKey, apiSecret)
      );
    }

    if (
      process.env.NODE_ENV === "production" ||
      process.env.ALLOW_LOCAL_UPLOADS !== "true"
    ) {
      return NextResponse.json(
        { error: "Cloudinary signed uploads are not configured" },
        { status: 503 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filename = `product-${Date.now()}-${randomBytes(6).toString("hex")}.${format.extension}`;
    await writeFile(path.join(uploadsDir, filename), buffer);
    return NextResponse.json({
      url: `/uploads/${filename}`,
      publicId: filename,
      local: true,
    });
  } catch (error) {
    console.error("[/api/admin/upload]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

async function uploadToCloudinary(
  buffer: Buffer,
  format: ImageFormat,
  cloudName: string,
  apiKey: string,
  apiSecret: string
): Promise<{ url: string; publicId: string }> {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "safaritech/products";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const body = new FormData();
  const fileBytes = new Uint8Array(buffer.length);
  fileBytes.set(buffer);
  body.append("file", new Blob([fileBytes], { type: format.mimeType }), `product.${format.extension}`);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("folder", folder);
  body.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: "POST", body }
  );
  const data = await response.json();
  if (
    !response.ok ||
    typeof data !== "object" ||
    data === null ||
    !("secure_url" in data) ||
    !("public_id" in data) ||
    typeof data.secure_url !== "string" ||
    typeof data.public_id !== "string"
  ) {
    throw new Error(`Cloudinary upload failed with status ${response.status}`);
  }
  return { url: data.secure_url, publicId: data.public_id };
}
