/**
 * Word (.docx) export entry point. Import it lazily (`await import('@/docx')`):
 * it pulls in the docx library, which the editor does not need until the user
 * asks for a Word file.
 */

import { Packer } from 'docx'
import {
  DEFAULT_TYPOGRAPHY, FONT_FAMILIES, PAGE_SIZES,
  type AppLanguage, type CVData, type CVTypography,
} from '@/types/cv.types'
import { WORD_FONTS, createDocument, loadPhoto, type DocSection, type DocxContext } from './blocks'
import { ATS_LAYOUT, buildAts } from './ats'
import { CLASSIC_LAYOUT, buildClassic } from './classic'
import { MINIMAL_LAYOUT, buildMinimal, buildMinimalSide } from './minimal'
import { MODERN_LAYOUT, buildModern } from './modern'
import { COMPACT_LAYOUT, ELEGANT_LAYOUT, WAVE_LAYOUT, buildCompact, buildElegant, buildWave } from './sidebar'
import type { DocxTemplate } from './designs'

interface Layout { sideMarginPx: number; color: string; lineHeight: number }

/** Every template listed in `designs.ts` has a builder here; `ats` is the plain parser-friendly design */
export type DocxDesign = DocxTemplate | 'ats'

const BUILDERS: Record<DocxDesign, { layout: Layout; build: (ctx: DocxContext) => DocSection[] }> = {
  classic:  { layout: CLASSIC_LAYOUT, build: buildClassic },
  modern:   { layout: MODERN_LAYOUT,  build: buildModern },
  elegant3: { layout: MINIMAL_LAYOUT, build: buildMinimal },
  elegant2: { layout: MINIMAL_LAYOUT, build: buildMinimalSide },
  compact:  { layout: COMPACT_LAYOUT, build: buildCompact },
  elegant:  { layout: ELEGANT_LAYOUT, build: buildElegant },
  wave:     { layout: WAVE_LAYOUT,    build: buildWave },
  ats:      { layout: ATS_LAYOUT,     build: buildAts },
}

export interface DocxExportInput {
  cv: CVData
  design: DocxDesign
  /** Translator already set to the CV language */
  t: (key: string) => string
  lang: AppLanguage
}

export async function buildCvDocx({ cv, design, t, lang }: DocxExportInput): Promise<Blob> {
  const typography: CVTypography = { ...DEFAULT_TYPOGRAPHY, ...(cv.meta.typography ?? {}) }
  const page = PAGE_SIZES.find(p => p.key === typography.pageSize) ?? PAGE_SIZES[0]
  const fontKey = FONT_FAMILIES.some(f => f.key === typography.fontFamily) ? typography.fontFamily : DEFAULT_TYPOGRAPHY.fontFamily
  const { layout, build } = BUILDERS[design]

  const ctx: DocxContext = {
    cv,
    t,
    font: WORD_FONTS[fontKey],
    scale: typography.fontSize / DEFAULT_TYPOGRAPHY.fontSize,
    page: { widthPx: page.widthPx, heightPx: page.heightPx },
    photo: cv.personal.photo ? await loadPhoto(cv.personal.photo) : null,
    ...layout,
  }
  return Packer.toBlob(createDocument(ctx, build(ctx), lang))
}
