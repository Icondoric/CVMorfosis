import type { TemplateVariant } from '@/types/cv.types'

/**
 * Preview templates that have a Word version. Kept apart from the builders so
 * the UI can ask "is Word available?" without loading the docx library.
 */
export const DOCX_TEMPLATES = ['classic', 'modern', 'elegant3', 'elegant2', 'compact', 'elegant', 'wave'] as const satisfies readonly TemplateVariant[]

export type DocxTemplate = (typeof DOCX_TEMPLATES)[number]

export const hasDocxVersion = (template: TemplateVariant): template is DocxTemplate =>
  (DOCX_TEMPLATES as readonly TemplateVariant[]).includes(template)
