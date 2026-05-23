import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const uploadTo = (formData.get('uploadTo') as string) || 'local'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 })
    }

    // If Cloudinary is configured and requested, use it
    if (uploadTo === 'cloudinary' && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const { v2: cloudinary } = await import('cloudinary')
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        })

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const folder = process.env.CLOUDINARY_FOLDER || 'safaritech'
        const result = await new Promise<{ secure_url: string; public_id: string }>(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder,
                  resource_type: 'image',
                  transformation: [{ quality: 'auto', fetch_format: 'auto' }],
                },
                (error, result) => {
                  if (error) reject(error)
                  else if (result) resolve(result)
                  else reject(new Error('No result from Cloudinary'))
                }
              )
              .end(buffer)
          }
        )

        return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed, falling back to local:', cloudinaryError)
        // Fall through to local upload
      }
    }

    // Upload to local storage
    return uploadToLocal(file)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

async function uploadToLocal(file: File): Promise<NextResponse> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Ensure the uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })

  // Generate a unique filename
  const ext = path.extname(file.name) || '.jpg'
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
  const filePath = path.join(uploadsDir, uniqueName)

  // Write the file
  await writeFile(filePath, buffer)

  // Return the public URL path
  const url = `/uploads/${uniqueName}`
  return NextResponse.json({ url })
}
