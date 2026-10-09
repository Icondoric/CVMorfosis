/**
 * Shared building blocks for the Word (.docx) export.
 *
 * The document is assembled from the CV data with native Word structures
 * (heading styles, real bullets, tab stops, hyperlinks) so it stays editable
 * and readable by résumé parsers. It mirrors the preview's design, but Word
 * lays out and paginates the text itself.
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Header,
  HeadingLevel,
  HorizontalPositionRelativeFrom,
  ImageRun,
  LevelFormat,
  LineRuleType,
  Paragraph,
  SectionType,
  ShadingType,
  Tab,
  TabStopType,
  Table,
  TableBorders,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  TextWrappingType,
  VerticalAlign,
  VerticalPositionRelativeFrom,
  WidthType,
  type FileChild,
  type IParagraphOptions,
  type IRunOptions,
  type ParagraphChild,
} from 'docx'
import { PAGE_MARGINS, type AppLanguage, type CVData, type FontFamilyKey } from '@/types/cv.types'
import { toUrl } from '@/utils/url'

/**
 * Fonts Word can rely on. The web-only faces of the preview (Inter, Lora,
 * EB Garamond) are replaced by the closest font installed with Office.
 */
export const WORD_FONTS: Record<FontFamilyKey, string> = {
  verdana:   'Verdana',
  arial:     'Arial',
  calibri:   'Calibri',
  trebuchet: 'Trebuchet MS',
  inter:     'Calibri',
  times:     'Times New Roman',
  georgia:   'Georgia',
  garamond:  'Garamond',
  lora:      'Georgia',
}

const WORD_LANGUAGE: Record<AppLanguage, string> = { es: 'es-ES', en: 'en-US' }
const BULLETS = 'cv-bullets'

export interface DocxContext {
  cv: CVData
  /** Translator bound to the CV language */
  t: (key: string) => string
  /** Word font name */
  font: string
  /** Chosen font size relative to the design base (same factor as --cv-scale) */
  scale: number
  /** Sheet size in CSS px, as used by the preview */
  page: { widthPx: number; heightPx: number }
  /** Left/right page margin in CSS px (each template has its own) */
  sideMarginPx: number
  /** Body text colour, hex without # */
  color: string
  /** Body line height as a multiple of the font size, as in the preview's CSS */
  lineHeight: number
  /** Profile photo ready to embed (see `loadPhoto`), when the CV has one */
  photo: PhotoData | null
}

export interface PhotoData {
  type: 'png' | 'jpg' | 'gif' | 'bmp'
  data: Uint8Array
}

// ── Units ─────────────────────────────────────────────────────────────────────
// The preview is drawn at 96 px per inch; Word measures in twips (1/1440 in)
// and font sizes in half-points.

/** CSS px → twips */
export const twips = (px: number) => Math.round(px * 15)

/** Design font size in px → half-points, following the chosen font size */
export const fontSize = (ctx: DocxContext, px: number) => Math.round(px * ctx.scale * 1.5)

/** CSS line-height (a multiple of the font size) → Word line spacing */
export const lineSpacing = (ctx: DocxContext, px: number, ratio = ctx.lineHeight) => ({
  line: twips(px * ctx.scale * ratio),
  lineRule: LineRuleType.AT_LEAST,
})

/** Width available between the side margins, in twips */
export const contentWidth = (ctx: DocxContext) => twips(ctx.page.widthPx - ctx.sideMarginPx * 2)

// ── Text ──────────────────────────────────────────────────────────────────────

export interface TextStyle {
  /** Design size in px (default 11) */
  size?: number
  bold?: boolean
  italics?: boolean
  /** Hex without # */
  color?: string
  caps?: boolean
  /** CSS letter-spacing in em */
  tracking?: number
}

const BASE_SIZE = 11

function runOptions(ctx: DocxContext, style: TextStyle): IRunOptions {
  const px = style.size ?? BASE_SIZE
  return {
    font: ctx.font,
    size: fontSize(ctx, px),
    bold: style.bold,
    italics: style.italics,
    color: style.color ?? ctx.color,
    allCaps: style.caps,
    // twentieths of a point; 1 px = 0.75 pt
    characterSpacing: style.tracking ? Math.round(px * ctx.scale * style.tracking * 0.75 * 20) : undefined,
  }
}

export function text(ctx: DocxContext, value: string, style: TextStyle = {}): TextRun {
  return new TextRun({ ...runOptions(ctx, style), text: value })
}

/** A clickable address that keeps the surrounding text style */
export function link(ctx: DocxContext, label: string, target: string, style: TextStyle = {}): ExternalHyperlink {
  return new ExternalHyperlink({ link: target, children: [text(ctx, label, style)] })
}

export const mailLink = (ctx: DocxContext, email: string, style?: TextStyle) =>
  link(ctx, email, `mailto:${email}`, style)

export const webLink = (ctx: DocxContext, address: string, style?: TextStyle) =>
  link(ctx, address, toUrl(address) ?? address, style)

/** Joins the present pieces with a separator, e.g. contact details on one line */
export function joined(ctx: DocxContext, parts: (ParagraphChild | null | undefined | false | '')[], separator: string, style: TextStyle = {}): ParagraphChild[] {
  // `field && run(…)` yields '' for an empty field
  const present = parts.filter((p): p is ParagraphChild => Boolean(p))
  return present.flatMap((part, i) => (i === 0 ? [part] : [text(ctx, separator, style), part]))
}

// ── Paragraphs ────────────────────────────────────────────────────────────────

export interface BlockOptions {
  /** Space above / below, in px */
  before?: number
  after?: number
  /** Design size that drives the line height (default 11) */
  size?: number
  /** Line height override, as a multiple of the font size */
  lineHeight?: number
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType]
  /** Keeps this paragraph on the same page as the next one */
  keepNext?: boolean
  /** Left indent in px */
  indent?: number
  /** Vertical accent line to the left of the paragraph (entries of the Executive design) */
  leftRule?: { color: string; widthPx: number; gapPx: number }
  /** Width in px of the column this paragraph sits in, when it is not the full page (table cells) */
  rowWidth?: number
}

/** How far a bullet's marker hangs to the left of its text, and the list's own indent, in px */
const BULLET_INDENT = 16
const BULLET_HANGING = 11

function blockOptions(ctx: DocxContext, o: BlockOptions, isBullet = false): IParagraphOptions {
  const indent = o.indent ?? 0
  // Word draws the rule relative to the paragraph's leftmost edge, which for a
  // bullet is its marker: widen the gap so the line stays in one place.
  const ruleGap = o.leftRule ? o.leftRule.gapPx + (isBullet ? BULLET_INDENT - BULLET_HANGING : 0) : 0
  return {
    alignment: o.alignment,
    keepNext: o.keepNext,
    indent: isBullet
      ? { left: twips(indent + BULLET_INDENT), hanging: twips(BULLET_HANGING) }
      : indent ? { left: twips(indent) } : undefined,
    border: o.leftRule
      ? { left: { style: BorderStyle.SINGLE, size: Math.round(o.leftRule.widthPx * 0.75 * 8), color: o.leftRule.color, space: Math.round(ruleGap * 0.75) } }
      : undefined,
    // A paragraph is never split across pages, as bullets are not in the preview
    keepLines: true,
    spacing: {
      before: twips(o.before ?? 0),
      after: twips(o.after ?? 0),
      ...lineSpacing(ctx, o.size ?? BASE_SIZE, o.lineHeight),
    },
  }
}

export function paragraph(ctx: DocxContext, children: ParagraphChild[], o: BlockOptions = {}): Paragraph {
  return new Paragraph({ ...blockOptions(ctx, o), children })
}

/** Left content with a second piece flushed to the right margin (company … dates) */
export function splitRow(ctx: DocxContext, left: ParagraphChild[], right: ParagraphChild[], o: BlockOptions = {}): Paragraph {
  const hasRight = right.length > 0
  return new Paragraph({
    ...blockOptions(ctx, o),
    tabStops: hasRight ? [{ type: TabStopType.RIGHT, position: o.rowWidth ? twips(o.rowWidth) : contentWidth(ctx) }] : undefined,
    children: hasRight ? [...left, new TextRun({ children: [new Tab()] }), ...right] : left,
  })
}

/** The candidate's name: Word's "Heading 1" */
export function nameHeading(ctx: DocxContext, name: string, style: TextStyle, o: BlockOptions = {}): Paragraph {
  return new Paragraph({
    ...blockOptions(ctx, { ...o, size: style.size, lineHeight: 1.2 }),
    heading: HeadingLevel.HEADING_1,
    children: [text(ctx, name, style)],
  })
}

export interface HeadingStyle {
  before?: number
  after?: number
  size?: number
  color?: string
  tracking?: number
  /** Where the horizontal rule sits: under the title, above it (as a divider from the previous section) or nowhere */
  rule?: 'bottom' | 'top' | 'none'
  ruleColor?: string
  ruleWidthPx?: number
  /** Distance between the rule and the title, in px */
  ruleGapPx?: number
  /**
   * Keep the title on the same page as what follows (default). Must be off for
   * a title alone in a table cell: there Word applies it to the whole row and
   * ends up chaining every row of the table onto one page.
   */
  keepNext?: boolean
}

/** A section title: Word's "Heading 2" */
export function sectionHeading(ctx: DocxContext, title: string, o: HeadingStyle = {}): Paragraph {
  const size = o.size ?? 11.5
  const rule = o.rule ?? 'bottom'
  const line = {
    style: BorderStyle.SINGLE,
    // eighths of a point
    size: Math.round((o.ruleWidthPx ?? 1) * 0.75 * 8),
    color: o.ruleColor ?? ctx.color,
    space: Math.round((o.ruleGapPx ?? 3) * 0.75),
  }
  return new Paragraph({
    ...blockOptions(ctx, { before: o.before, after: o.after ?? 8, size, lineHeight: 1.3, keepNext: o.keepNext ?? true }),
    heading: HeadingLevel.HEADING_2,
    border: rule === 'none' ? undefined : { [rule]: line },
    children: [text(ctx, title, { size, bold: true, caps: true, tracking: o.tracking ?? 0.06, color: o.color })],
  })
}

/** A real Word list item */
export function bullet(ctx: DocxContext, value: string, o: BlockOptions = {}, style: TextStyle = {}): Paragraph {
  return new Paragraph({
    ...blockOptions(ctx, { after: 2, size: style.size, ...o }, true),
    numbering: { reference: BULLETS, level: 0 },
    children: [text(ctx, value, style)],
  })
}

/**
 * A bulleted list. Word paginates on its own, so the first and the last pair
 * of items are tied together: no single bullet is left alone on either side
 * of a page break (the same rule the preview's paginator applies).
 */
export function bullets(ctx: DocxContext, values: string[], o: BlockOptions = {}, style: TextStyle = {}): Paragraph[] {
  const items = values.filter(v => v.trim())
  return items.map((value, i) => bullet(ctx, value, { ...o, keepNext: i === 0 || i === items.length - 2 }, style))
}

/** Spacing helper: the first entry of a section sits right under its title */
export const gapBefore = (index: number, px: number) => (index === 0 ? 0 : px)

// ── Layout tables and images ──────────────────────────────────────────────────

export interface CellOptions {
  /** Width in px */
  width: number
  /** Background, hex without # */
  fill?: string
  /** Inner margins in px: top, right, bottom, left */
  padding?: [number, number, number, number]
  verticalAlign?: 'top' | 'center'
  /** Thin line along the bottom edge of the cell */
  bottomRule?: { color: string; widthPx: number }
}

export function cell(children: (Paragraph | Table)[], o: CellOptions): TableCell {
  const [top, right, bottom, left] = o.padding ?? [0, 0, 0, 0]
  return new TableCell({
    width: { size: twips(o.width), type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    margins: { top: twips(top), right: twips(right), bottom: twips(bottom), left: twips(left) },
    verticalAlign: o.verticalAlign === 'center' ? VerticalAlign.CENTER : VerticalAlign.TOP,
    borders: o.bottomRule
      ? { bottom: { style: BorderStyle.SINGLE, size: Math.round(o.bottomRule.widthPx * 0.75 * 8), color: o.bottomRule.color } }
      : undefined,
    // A cell must hold at least one paragraph
    children: children.length ? children : [new Paragraph({})],
  })
}

/** A borderless one-row table used purely for layout (side-by-side blocks, colour bands) */
export function layoutRow(cells: TableCell[], widthsPx: number[], o: { bottomRule?: { color: string; widthPx: number } } = {}): Table {
  return layoutTable([cells], widthsPx, o)
}

/** A borderless table used purely for layout; every row has one cell per column width */
export function layoutTable(rows: TableCell[][], widthsPx: number[], o: { bottomRule?: { color: string; widthPx: number } } = {}): Table {
  return new Table({
    width: { size: twips(widthsPx.reduce((a, b) => a + b, 0)), type: WidthType.DXA },
    columnWidths: widthsPx.map(twips),
    layout: TableLayoutType.FIXED,
    borders: {
      ...TableBorders.NONE,
      ...(o.bottomRule && { bottom: { style: BorderStyle.SINGLE, size: Math.round(o.bottomRule.widthPx * 0.75 * 8), color: o.bottomRule.color } }),
    },
    rows: rows.map(cells => new TableRow({ children: cells })),
  })
}

const PHOTO_PIXELS = 400

/**
 * Prepares the CV photo (a data URL) for embedding. Templates show it in a
 * square frame cropped to the centre; Word would stretch it instead, so the
 * crop is done here. Returns null when there is no usable photo.
 */
export async function loadPhoto(dataUrl: string): Promise<PhotoData | null> {
  const match = /^data:image\/(png|jpe?g|gif|bmp);base64,(.+)$/i.exec(dataUrl)
  if (!match) return null
  const bytes = (base64: string) => Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  const original: PhotoData = { type: match[1]!.toLowerCase().replace('jpeg', 'jpg') as PhotoData['type'], data: bytes(match[2]!) }

  // No canvas outside a browser: embed the photo as it is
  if (typeof document === 'undefined') return original
  try {
    const bitmap = await createImageBitmap(await (await fetch(dataUrl)).blob())
    const side = Math.min(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = Math.min(side, PHOTO_PIXELS)
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return original
    ctx2d.fillStyle = '#ffffff'
    ctx2d.fillRect(0, 0, canvas.width, canvas.height)
    ctx2d.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    return { type: 'jpg', data: bytes(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]!) }
  } catch {
    return original
  }
}

/**
 * Word joins two tables that touch into one. This near-invisible paragraph
 * keeps consecutive layout tables apart.
 */
export function tableSeparator(): Paragraph {
  return new Paragraph({ spacing: { line: 20, lineRule: LineRuleType.EXACT }, children: [new TextRun({ text: '', size: 2 })] })
}

/** The profile photo as a square inline image, or null when the CV has none */
export function photo(ctx: DocxContext, sizePx: number): ImageRun | null {
  if (!ctx.photo) return null
  return new ImageRun({ ...ctx.photo, transformation: { width: sizePx, height: sizePx } })
}

// ── Document ──────────────────────────────────────────────────────────────────

/** A run of content with its own page margins (px); sections after the first continue on the same page */
export interface DocSection {
  children: FileChild[]
  margins?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  /**
   * A colour strip down the left of every page, from edge to edge (sidebar
   * designs). It is drawn behind the text from the page header, so the page
   * keeps its normal margins and the column stays ordinary, editable text.
   */
  sidebar?: { color: string; widthPx: number }
}

/** A 1×1 bitmap of one colour; Word stretches it to the size it is given */
function solidBitmap(hex: string): Uint8Array {
  const bytes = new Uint8Array(58)
  const view = new DataView(bytes.buffer)
  bytes.set([0x42, 0x4d])                 // "BM"
  view.setUint32(2, 58, true)             // file size
  view.setUint32(10, 54, true)            // pixel data offset
  view.setUint32(14, 40, true)            // info header size
  view.setInt32(18, 1, true)              // width
  view.setInt32(22, 1, true)              // height
  view.setUint16(26, 1, true)             // planes
  view.setUint16(28, 24, true)            // bits per pixel
  view.setUint32(34, 4, true)             // pixel data size (one padded row)
  const value = parseInt(hex, 16)
  bytes.set([value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff], 54) // B, G, R
  return bytes
}


function sidebarHeader(ctx: DocxContext, sidebar: NonNullable<DocSection['sidebar']>): Header {
  return new Header({
    children: [new Paragraph({
      children: [new ImageRun({
        type: 'bmp',
        data: solidBitmap(sidebar.color),
        transformation: { width: sidebar.widthPx, height: ctx.page.heightPx },
        floating: {
          horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
          verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
          behindDocument: true,
          allowOverlap: true,
          wrap: { type: TextWrappingType.NONE },
        },
        altText: { title: 'Sidebar', description: 'Decorative sidebar background', name: 'sidebar-background' },
      })],
    })],
  })
}

export function createDocument(ctx: DocxContext, sections: DocSection[], lang: AppLanguage): Document {
  const name = ctx.cv.personal.fullName.trim()
  const base = { font: ctx.font, size: fontSize(ctx, BASE_SIZE), color: ctx.color, language: { value: WORD_LANGUAGE[lang] } }
  // Headings keep Word's style names (navigation pane, parsers) but our look
  const heading = { run: { ...base, bold: true }, paragraph: { spacing: { before: 0, after: 0 } } }

  return new Document({
    creator: name || undefined,
    title: [name, 'CV'].filter(Boolean).join(' - '),
    styles: {
      default: {
        document: { run: base, paragraph: { spacing: { before: 0, after: 0 } } },
        heading1: heading,
        heading2: heading,
      },
    },
    numbering: {
      config: [{
        reference: BULLETS,
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: twips(BULLET_INDENT), hanging: twips(BULLET_HANGING) } } },
        }],
      }],
    },
    sections: sections.map((section, i) => ({
      headers: section.sidebar ? { default: sidebarHeader(ctx, section.sidebar) } : undefined,
      properties: {
        type: i === 0 ? undefined : SectionType.CONTINUOUS,
        page: {
          size: { width: twips(ctx.page.widthPx), height: twips(ctx.page.heightPx) },
          margin: {
            top: twips(section.margins?.top ?? PAGE_MARGINS.top),
            bottom: twips(section.margins?.bottom ?? PAGE_MARGINS.bottom),
            left: twips(section.margins?.left ?? ctx.sideMarginPx),
            right: twips(section.margins?.right ?? ctx.sideMarginPx),
            // The background strip must start at the very top of the sheet
            ...(section.sidebar && { header: 0 }),
          },
        },
      },
      children: section.children,
    })),
  })
}
