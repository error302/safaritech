import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import cloudinary from "@/lib/cloudinary";

export const maxDuration = 60; // Allow up to 60 seconds for upload on Vercel

export async function POST(req: NextRequest) {
  try {
    // Check authentication - only admins can upload
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to upload images. Please sign in and try again." },
        { status: 401 }
      );
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can upload images." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || process.env.CLOUDINARY_FOLDER || "safaritech";

    if (!file) {
      return NextResponse.json({ error: "No file provided. Please select a file to upload." }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `Invalid file type: "${file.type}". Only image files (PNG, JPG, WebP, etc.) are allowed.` },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { error: `File size (${sizeMB}MB) exceeds the 10MB limit. Please compress the image and try again.` },
        { status: 400 }
      );
    }

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Missing Cloudinary environment variables:", {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      });
      return NextResponse.json(
        { error: "Image upload is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables." },
        { status: 500 }
      );
    }

    // Convert File to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
      transformation: [
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Provide user-friendly error messages for common Cloudinary errors
    let message = "Upload failed. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("Invalid API Key")) {
        message = "Cloudinary API key is invalid. Please check your configuration.";
      } else if (error.message.includes("Invalid cloud name")) {
        message = "Cloudinary cloud name is invalid. Please check your configuration.";
      } else if (error.message.includes("not found")) {
        message = "Cloudinary service unavailable. Please try again later.";
      } else {
        message = error.message;
      }
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
