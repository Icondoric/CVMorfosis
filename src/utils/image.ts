/**
 * Downscales a picked image and returns it as a JPEG data URL.
 * The CV (photo included) lives in localStorage, which holds about 5 MB in
 * total: a camera photo stored as-is would make every later save fail.
 */
export async function resizeImageToDataUrl(file: File, maxSide = 400, quality = 0.85): Promise<string> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    // JPEG has no alpha: transparent PNG areas would otherwise turn black
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', quality)
  } finally {
    bitmap.close()
  }
}
