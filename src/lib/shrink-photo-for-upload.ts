// The backend stores catalog photos at 1024 px, and the admin proxy runs on
// Vercel, which refuses request bodies over 4.5 MB, so photos shrink first.
const MAX_SIDE_PX = 1024;
const JPEG_QUALITY = 0.92;

export const PHOTO_FILE_TYPES = 'image/jpeg,image/png,image/webp';

/** The photo as a JPEG of at most 1024 px, transparency flattened onto white. */
export async function shrinkPhotoForUpload(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('This file could not be read as a photo. Use a JPEG, PNG or WebP image.');
  }
  try {
    const scale = Math.min(1, MAX_SIDE_PX / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser cannot resize photos.');
    // JPEG has no transparency; without a fill, see-through areas turn black.
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('The photo could not be resized.'))),
        'image/jpeg',
        JPEG_QUALITY
      );
    });
  } finally {
    bitmap.close();
  }
}
