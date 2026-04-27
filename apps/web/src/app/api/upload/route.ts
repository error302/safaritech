import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 })
    }

    const uploadTo = formData.get('uploadTo') as string || 'cloudinary'
    const folder = (formData.get('folder') as string) || 'safaritech'

    if (uploadTo === 'local') {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const filepath = join(uploadDir, filename)
      const bytes = await file.arrayBuffer()
      await writeFile(filepath, Buffer.from(bytes))
      const url = `/uploads/${filename}`
      return NextResponse.json({ url, filename, path: url })
    }

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    // Fallback to local storage if Cloudinary not configured
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filepath = join(uploadDir, filename)
    const bytes2 = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes2))
    const url = `/uploads/${filename}`
    return NextResponse.json({ url, filename, path: url })
  }

  const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const timestamp = Math.round(Date.now() / 1000)
    const signature = await generateSignature(timestamp, apiSecret, folder)

    const form = new FormData()
    form.append('file', dataUri)
    form.append('timestamp', String(timestamp))
    form.append('signature', signature)
    form.append('api_key', apiKey)
    form.append('folder', folder)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: form }
    )

    if (!res.ok) {
      const errorData = await res.json()
      return NextResponse.json({ error: errorData.error?.message || 'Upload failed' }, { status: 500 })
    }

    const result = await res.json()
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    )
  }
}

async function generateSignature(timestamp: number, apiSecret: string, folder: string): Promise<string> {
  const text = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json({ error: 'No publicId provided' }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    const timestamp = Math.round(Date.now() / 1000)
    const signature = await generateSignature(timestamp, apiSecret, '')
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          api_key: apiKey,
          timestamp: String(timestamp),
          signature: signature,
          params_to_sign: paramsToSign,
          public_id: publicId,
        }),
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    return NextResponse.json({ result: 'ok' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}