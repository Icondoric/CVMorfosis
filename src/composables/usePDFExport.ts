import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTypographyStyles } from '@/composables/useTypographyStyles'
import { useCVStore } from '@/stores/cvStore'
import { toSafeFilename } from '@/utils/filename'

const PDF_SERVER = 'http://localhost:3001/api/pdf'

export function usePDFExport() {
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)
  const { pdfConfig } = useTypographyStyles()
  const { locale, t } = useI18n()
  const store = useCVStore()

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
          pageFormat: pdfConfig.value.pageFormat,
          lang:       locale.value,
          // Shown by PDF viewers and some ATS as the document name
          title:      [store.cv.personal.fullName.trim(), 'CV'].filter(Boolean).join(' - '),
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(`Server error ${response.status}: ${err.detail ?? err.error ?? 'unknown'}`)
      }

      const blob = await response.blob()
      const url  = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const safe = toSafeFilename(filename)
      link.href     = url
      link.download = `${safe}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

    } catch (err) {
      console.error('PDF export error:', err)
      exportError.value = t('export.serverError', { detail: err instanceof Error ? err.message : String(err) })
    } finally {
      isExporting.value = false
    }
  }

  return { exportPDF, isExporting, exportError }
}
