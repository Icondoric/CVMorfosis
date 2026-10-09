/**
 * Turns a free-text name into a download-safe file name.
 * Accents are folded to their base letter first ("María" → "maria"),
 * so they are not lost to the replacement character.
 */
export function toSafeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9_-]/gi, '_')
    .toLowerCase()
}
