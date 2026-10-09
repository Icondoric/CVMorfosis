import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { toSafeFilename } from '@/utils/filename'
import type { AppLanguage } from '@/types/cv.types'
import type { DocxDesign } from '@/docx'

export function useDocxExport() {
  const isExportingDocx = ref(false)
  const docxError = ref<string | null>(null)
  const { t, locale } = useI18n()
  const store = useCVStore()

  async function exportDocx(design: DocxDesign, filename: string) {
    isExportingDocx.value = true
    docxError.value = null
    try {
      // Loaded on demand: the docx library is only needed for this download
      const { buildCvDocx } = await import('@/docx')
      const blob = await buildCvDocx({ cv: store.cv, design, t, lang: locale.value as AppLanguage })

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${toSafeFilename(filename)}.docx`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('DOCX export error:', err)
      docxError.value = t('export.docxError', { detail: err instanceof Error ? err.message : String(err) })
    } finally {
      isExportingDocx.value = false
    }
  }

  return { exportDocx, isExportingDocx, docxError }
}
