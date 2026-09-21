import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/auth';
import { supabase } from '@/lib/storage';
import { addMediaItem } from '@/lib/cmsStorage';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await verifyAdminRequest(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // MIME type check
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Please upload a JPG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    // File size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit. Please upload an optimized image.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const filename = `${cleanBase}-${Date.now()}${ext}`;

    let publicUrl = '';

    // 1. If Supabase Storage is configured, upload to bucket
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('hariprasadam-media')
          .upload(`uploads/${filename}`, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('hariprasadam-media')
            .getPublicUrl(`uploads/${filename}`);
          publicUrl = publicUrlData.publicUrl;
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, saving to local public directory:', err);
      }
    }

    // 2. Local fallback storage in /public/images/uploads/
    if (!publicUrl) {
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const localFilePath = path.join(uploadDir, filename);
      fs.writeFileSync(localFilePath, buffer);
      publicUrl = `/images/uploads/${filename}`;
    }

    // Record in media registry
    const mediaRecord = await addMediaItem({
      filename,
      url: publicUrl,
      size: file.size,
      mimeType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media: mediaRecord,
      message: 'Image uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
