import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Increase body size limit for image uploads (default is 4.5MB on Vercel)
// In Next.js App Router, we use the runtime config approach
export const runtime = "nodejs";
export const maxDuration = 30; // seconds

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication - only admins can upload
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const uploadTo = (formData.get("uploadTo") as string) || "local";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
    }

    let url = "";

    if (uploadTo === "cloudinary") {
      // Upload to Cloudinary
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json(
          { error: "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables, or use Local Storage instead." },
          { status: 500 }
        );
      }

      const folder = process.env.CLOUDINARY_FOLDER || "safaritech";
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convert to base64 data URI for Cloudinary upload
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      url = result.secure_url;
    } else {
      // Upload to local storage (public/uploads)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const ext = path.extname(file.name) || ".png";
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      // Ensure the uploads directory exists
      await mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, uniqueName);
      await writeFile(filePath, buffer);

      url = `/uploads/${uniqueName}`;
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
