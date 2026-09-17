import { ref } from 'vue'

const PDF_SERVER = 'http://localhost:3001/api/pdf'

export function usePDFExport() {
  const isExporting = ref(false)

  async function exportPDF(element: HTMLElement, filename: string = 'cv-harvard') {
    isExporting.value = true
    try {
      // Send the inner HTML of the CV element to Puppeteer backend
      // Puppeteer renders it in headless Chrome → perfect CSS support (oklch, fonts, etc.)
      const response = await fetch(PDF_SERVER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: element.outerHTML,
          filename,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(`Server error ${response.status}: ${err.detail ?? err.error ?? 'unknown'}`)
      }

      // Download the returned PDF blob
      const blob = await response.blob()
      const url  = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const safeName = filename.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase()
      link.href     = url
      link.download = `${safeName}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

    } catch (err) {
      console.error('PDF export error:', err)
      alert(`Error al exportar el PDF:\n${err}\n\nAsegúrate de que el servidor PDF esté corriendo:\nnpm run server`)
    } finally {
      isExporting.value = false
    }
  }

  return { exportPDF, isExporting }
}
