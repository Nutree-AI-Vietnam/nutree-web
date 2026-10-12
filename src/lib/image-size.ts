/**
 * Pixel size of a JPEG, PNG or WebP image, read from its header. Returns undefined for any other
 * or damaged file. Blog posts use it to validate images and give next/image their size.
 */
export function getImageSize(data: Buffer): { width: number; height: number } | undefined {
  try {
    return pngSize(data) ?? webpSize(data) ?? jpegSize(data);
  } catch {
    // A truncated header makes the Buffer reads above throw.
    return undefined;
  }
}

function pngSize(data: Buffer) {
  if (data.readUInt32BE(0) !== 0x89504e47 || data.toString('ascii', 12, 16) !== 'IHDR') return undefined;
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function webpSize(data: Buffer) {
  if (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP') return undefined;

  switch (data.toString('ascii', 12, 16)) {
    case 'VP8 ': // Lossy: 14-bit sizes after the frame tag and start code.
      return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
    case 'VP8L': {
      // Lossless: width − 1 and height − 1 packed into 14 bits each.
      const bits = data.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    case 'VP8X': // Extended: 24-bit canvas width − 1 and height − 1.
      return { width: data.readUIntLE(24, 3) + 1, height: data.readUIntLE(27, 3) + 1 };
    default:
      return undefined;
  }
}

/** Walks the JPEG segments to the start-of-frame marker, which holds the size. */
function jpegSize(data: Buffer) {
  if (data.readUInt16BE(0) !== 0xffd8) return undefined;

  let offset = 2;
  while (offset + 9 < data.length) {
    if (data[offset] !== 0xff) return undefined;
    const marker = data[offset + 1];
    if (marker === 0xff) {
      // Fill byte before the real marker.
      offset += 1;
      continue;
    }
    // SOF0–SOF15, except DHT (C4), JPG (C8) and DAC (CC), which share the range.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
    }
    // Restart markers and TEM have no length field.
    offset += (marker >= 0xd0 && marker <= 0xd9) || marker === 0x01 ? 2 : 2 + data.readUInt16BE(offset + 2);
  }
  return undefined;
}
