const MONTHS: Record<string, number> = {
  ene: 1, enero: 1, jan: 1, january: 1,
  feb: 2, febrero: 2, february: 2,
  mar: 3, marzo: 3, march: 3,
  abr: 4, abril: 4, apr: 4, april: 4,
  may: 5, mayo: 5,
  jun: 6, junio: 6, june: 6,
  jul: 7, julio: 7, july: 7,
  ago: 8, agosto: 8, aug: 8, august: 8,
  sep: 9, sept: 9, septiembre: 9, setiembre: 9, september: 9,
  oct: 10, octubre: 10, october: 10,
  nov: 11, noviembre: 11, november: 11,
  dic: 12, diciembre: 12, dec: 12, december: 12,
}

const PRESENT = /^(presente|present|actualidad|actual|current)$/i

function format(month: number, year: string): string | null {
  return month >= 1 && month <= 12 ? `${String(month).padStart(2, '0')}/${year}` : null
}

/**
 * Normalizes a CV date to `MM/YYYY` (or `YYYY`), the form résumé parsers read
 * most reliably. Accepts "3/2020", "2020-03", "marzo 2020", "Mar. 2020", "2020".
 * Returns null when the text is not a recognizable month/year.
 */
export function normalizeMonthYear(raw: string): string | null {
  const text = raw.trim()
  if (!text || PRESENT.test(text)) return text

  let m = /^(\d{4})$/.exec(text)
  if (m) return m[1]!

  m = /^(\d{1,2})\s*[/\-. ]\s*(\d{4})$/.exec(text)
  if (m) return format(Number(m[1]), m[2]!)

  m = /^(\d{4})\s*[/\-.]\s*(\d{1,2})$/.exec(text)
  if (m) return format(Number(m[2]), m[1]!)

  m = /^([a-záéíóú]+)\.?,?\s+(?:de\s+)?(\d{4})$/i.exec(text)
  if (m) {
    const month = MONTHS[m[1]!.toLowerCase()]
    return month ? format(month, m[2]!) : null
  }
  return null
}
