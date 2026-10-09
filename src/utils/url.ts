/** Makes a user-typed address ("linkedin.com/in/ana") usable as a link target */
export function toUrl(value: string | undefined): string | undefined {
  const url = value?.trim()
  if (!url) return undefined
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`
}
