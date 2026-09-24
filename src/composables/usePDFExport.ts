import { ref } from 'vue'

const PDF_SERVER = 'http://localhost:3001/api/pdf'

export function usePDFExport() {
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)

  async function exportPDF(element: HTMLElement, filename: string = 'cv-harvard') {
    isExporting.value = true
    exportError.value = null
    try {
      // ── Collect ALL styles from the document head ─────────────────────────
      // This is critical: Vue scoped styles (.foo[data-v-XXXX]) live in <head>
      // not in the element's outerHTML. Without them, Puppeteer renders unstyled.
      const allStyles = Array.from(document.querySelectorAll('style'))
        .map(s => s.innerHTML)
        .join('\n')

      // Also pick up any <link rel="stylesheet"> hrefs (production build)
      const linkedStyles = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      ).map(l => `@import url("${l.href}");`).join('\n')

      const response = await fetch(PDF_SERVER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html:    element.outerHTML,
          styles:  linkedStyles + '\n' + allStyles,
          filename,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(`Server error ${response.status}: ${err.detail ?? err.error ?? 'unknown'}`)
      }

      const blob = await response.blob()
      const url  = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const safe = filename.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()
      link.href     = url
      link.download = `${safe}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

    } catch (err) {
      console.error('PDF export error:', err)
      exportError.value = `Error al exportar el PDF. Asegúrate de que el servidor PDF esté corriendo: npm run server (${err instanceof Error ? err.message : String(err)})`
    } finally {
      isExporting.value = false
    }
  }

  return { exportPDF, isExporting, exportError }
}
