/**
 * Word versions of the three sidebar templates: Blue Sidebar
 * (HarvardCompact.vue), Dark Sidebar (HarvardElegant.vue) and Waves
 * (HarvardWave.vue).
 *
 * They share one structure — a coloured left column with the name, contact
 * details, skills and languages, and a main column with the rest — so a single
 * builder is driven by a theme. Word needs a two-cell table to put the columns
 * side by side; the colour itself is a strip behind the text that runs the
 * full height of every page (see `DocSection.sidebar`).
 *
 * Decoration that has no editable equivalent is left out: contact icons, the
 * rounded skill tags, the language level bars and the wave at the foot.
 */

import { AlignmentType, Paragraph, type ParagraphChild } from 'docx'
import {
  bullets, cell, gapBefore, joined, layoutRow, mailLink, nameHeading, paragraph, photo, sectionHeading, splitRow, text, twips, webLink,
  type BlockOptions, type DocSection, type DocxContext, type HeadingStyle, type TextStyle,
} from './blocks'

type ContactField = 'location' | 'email' | 'phone' | 'linkedin' | 'website'

interface SidebarTheme {
  layout: { sideMarginPx: number; color: string; lineHeight: number }
  sidebar: {
    width: number
    fill: string
    /** Horizontal padding inside the column */
    pad: number
    photoSize: number | null
    centered: boolean
    name: TextStyle
    title: TextStyle
    /** Regular text, and its stronger variant (language names) */
    text: TextStyle
    strong: TextStyle
    muted: TextStyle
    label: HeadingStyle
    /** Space above each block of the column */
    gap: number
    /** Whether the contact details get their own "Contact" title */
    contactLabel: boolean
    contactOrder: ContactField[]
    programs: 'list' | 'inline'
    languages: 'stacked' | 'row' | 'inline'
  }
  main: {
    /** Horizontal padding inside the column */
    pad: number
    heading: HeadingStyle
    sectionGap: number
    body: TextStyle
    company: TextStyle
    date: TextStyle
    /** Second line of an entry (role, institution, award title, issuer) */
    second: TextStyle
    detail: TextStyle
    link: TextStyle
    /** Experience header: role and dates together on the second line instead of dates on the right */
    datesWithRole: boolean
    /** Education honours on the right of the institution line instead of on their own line */
    honorsOnRight: boolean
    bulletLineHeight: number
  }
}

function build(ctx: DocxContext, theme: SidebarTheme): DocSection[] {
  const { cv, t } = ctx
  const p = cv.personal
  const S = theme.sidebar
  const M = theme.main
  const sideWidth = S.width - S.pad * 2
  const mainWidth = ctx.page.widthPx - S.width - M.pad * 2
  const align = S.centered ? { alignment: AlignmentType.CENTER } : {}

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const side: Paragraph[] = []
  let sideBlocks = 0
  const label = (key: string) => {
    side.push(sectionHeading(ctx, t(`sections.${key}`), { ...S.label, before: sideBlocks++ === 0 ? S.gap : S.gap + 4 }))
  }
  const item = (children: ParagraphChild[], o: BlockOptions = {}) => side.push(paragraph(ctx, children, { after: 5, size: S.text.size, ...o }))

  const picture = S.photoSize ? photo(ctx, S.photoSize) : null
  if (picture) side.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: twips(16) }, children: [picture] }))
  if (p.fullName.trim()) side.push(nameHeading(ctx, p.fullName, S.name, { ...align, after: 4 }))
  if (p.title) side.push(paragraph(ctx, [text(ctx, p.title, S.title)], { ...align, size: S.title.size }))

  const contact: Record<ContactField, ParagraphChild | false | ''> = {
    location: p.location && text(ctx, p.location, S.text),
    email: p.email && mailLink(ctx, p.email, S.text),
    phone: p.phone && text(ctx, p.phone, S.text),
    linkedin: p.linkedin && webLink(ctx, p.linkedin, S.muted),
    website: p.website && webLink(ctx, p.website, S.muted),
  }
  const contactLines = S.contactOrder.map(f => contact[f]).filter((c): c is ParagraphChild => Boolean(c))
  if (contactLines.length) {
    if (S.contactLabel) label('contact')
    contactLines.forEach((line, i) => item([line], !S.contactLabel && i === 0 ? { before: S.gap } : {}))
    if (!S.contactLabel) sideBlocks++
  }

  const skills = cv.skills.filter(s => s.trim())
  if (skills.length) {
    label('skills')
    skills.forEach(s => item([text(ctx, s, S.text)]))
  }

  const programs = cv.programs.filter(s => s.trim())
  if (programs.length) {
    label('programs')
    if (S.programs === 'inline') item([text(ctx, programs.join(', '), S.text)], { lineHeight: 1.6 })
    else programs.forEach(s => item([text(ctx, s, S.text)]))
  }

  if (cv.languages.length) {
    label('languages')
    cv.languages.forEach(lang => {
      if (S.languages === 'row') side.push(splitRow(ctx, [text(ctx, lang.name, S.strong)], [text(ctx, lang.level, S.muted)], { after: 6, size: S.text.size, rowWidth: sideWidth }))
      else if (S.languages === 'inline') item([text(ctx, lang.name, S.strong), text(ctx, ` (${lang.level})`, S.muted)])
      else {
        item([text(ctx, lang.name, S.strong)], { after: 0, keepNext: true })
        item([text(ctx, lang.level, S.muted)])
      }
    })
  }

  // ── Main column ───────────────────────────────────────────────────────────
  const main: Paragraph[] = []
  let mainBlocks = 0
  const row: BlockOptions = { rowWidth: mainWidth }
  const section = (key: string) => main.push(sectionHeading(ctx, t(`sections.${key}`), { ...M.heading, before: mainBlocks++ === 0 ? 0 : M.sectionGap }))
  const second = (value: string, o: BlockOptions = {}) => paragraph(ctx, [text(ctx, value, M.second)], { before: 1, size: M.second.size, ...o })

  if (cv.summary) {
    section('summary')
    main.push(paragraph(ctx, [text(ctx, cv.summary, M.body)], { size: M.body.size, lineHeight: 1.6 }))
  }

  if (cv.experience.length) {
    section('experience')
    cv.experience.forEach((exp, i) => {
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ')
      if (M.datesWithRole) {
        main.push(paragraph(ctx, [text(ctx, exp.company, M.company)], { before: gapBefore(i, 14), size: M.company.size, keepNext: true }))
        main.push(paragraph(ctx, [
          text(ctx, [exp.role, dates].filter(Boolean).join(' | '), { ...M.second, italics: false, bold: true }),
          ...(exp.location ? [text(ctx, ` · ${exp.location}`, M.detail)] : []),
        ], { before: 1, after: 4, size: M.second.size, keepNext: true }))
      } else {
        main.push(splitRow(ctx, [text(ctx, exp.company, M.company)], dates ? [text(ctx, dates, M.date)] : [], { ...row, before: gapBefore(i, 12), size: M.company.size, keepNext: true }))
        main.push(second([exp.role, exp.location].filter(Boolean).join(' · '), { after: 4, keepNext: true }))
      }
      main.push(...bullets(ctx, exp.bullets, { lineHeight: M.bulletLineHeight }, M.body))
    })
  }

  if (cv.education.length) {
    section('education')
    cv.education.forEach((edu, i) => {
      const place = [edu.institution, edu.location].filter(Boolean).join(', ')
      const honorsBelow = Boolean(edu.honors) && !M.honorsOnRight
      main.push(splitRow(ctx, [text(ctx, [edu.degree, edu.field].filter(Boolean).join(' — '), M.company)], edu.graduationDate ? [text(ctx, edu.graduationDate, M.date)] : [], { ...row, before: gapBefore(i, 10), size: M.company.size, keepNext: true }))
      main.push(splitRow(ctx, [text(ctx, place, M.second)], edu.honors && M.honorsOnRight ? [text(ctx, edu.honors, M.link)] : [], { ...row, before: 1, size: M.second.size, keepNext: honorsBelow || Boolean(edu.thesis) }))
      if (honorsBelow) main.push(paragraph(ctx, [text(ctx, edu.honors, M.detail)], { before: 1, size: M.detail.size, keepNext: Boolean(edu.thesis) }))
      if (edu.thesis) main.push(paragraph(ctx, [text(ctx, `${t('preview.thesis')}: `, M.detail), text(ctx, edu.thesis, { ...M.detail, italics: true })], { before: 1, size: M.detail.size }))
    })
  }

  if (cv.achievements.length) {
    section('achievements')
    cv.achievements.forEach((ach, i) => {
      main.push(splitRow(ctx, [text(ctx, ach.organization, M.company)], ach.year ? [text(ctx, ach.year, M.date)] : [], { ...row, before: gapBefore(i, 8), size: M.company.size, keepNext: true }))
      main.push(second(ach.title, { keepNext: Boolean(ach.description) }))
      if (ach.description) main.push(paragraph(ctx, [text(ctx, ach.description, M.detail)], { before: 2, size: M.detail.size, lineHeight: 1.5 }))
    })
  }

  const certifications = cv.certifications ?? []
  if (certifications.length) {
    section('certifications')
    certifications.forEach((cert, i) => {
      const dates = [cert.date, cert.expiration].filter(Boolean).join(' - ')
      main.push(splitRow(ctx, [text(ctx, cert.name, M.company)], cert.date ? [text(ctx, dates, M.date)] : [], { ...row, before: gapBefore(i, 8), size: M.company.size, keepNext: true }))
      main.push(second(cert.issuer + (cert.credentialId ? ` · ID: ${cert.credentialId}` : ''), { keepNext: Boolean(cert.url) }))
      if (cert.url) main.push(paragraph(ctx, [webLink(ctx, cert.url, M.link)], { before: 1, size: M.link.size }))
    })
  }

  if (cv.publications.length) {
    section('publications')
    cv.publications.forEach((pub, i) => {
      main.push(paragraph(ctx, [
        text(ctx, `${pub.authors} (${pub.year}). `, M.body),
        text(ctx, pub.title, { ...M.body, italics: true }),
        text(ctx, `. ${pub.journal}${pub.doi ? `. DOI: ${pub.doi}` : ''}.`, M.body),
      ], { before: gapBefore(i, 6), size: M.body.size, lineHeight: 1.5 }))
    })
  }

  const table = layoutRow(
    [
      cell(side, { width: S.width, fill: S.fill, padding: [0, S.pad, 0, S.pad] }),
      cell(main, { width: ctx.page.widthPx - S.width, padding: [0, M.pad, 0, M.pad] }),
    ],
    [S.width, ctx.page.widthPx - S.width],
  )
  // The table spans the sheet edge to edge; the columns carry their own padding
  return [{ children: [table], margins: { left: 0, right: 0 }, sidebar: { color: S.fill, widthPx: S.width } }]
}

// A hairline in a tone of the column, standing in for the translucent CSS borders
const rule = (color: string, widthPx = 1): Pick<HeadingStyle, 'rule' | 'ruleColor' | 'ruleWidthPx' | 'ruleGapPx'> =>
  ({ rule: 'bottom', ruleColor: color, ruleWidthPx: widthPx, ruleGapPx: 3 })

// ── Blue Sidebar (HarvardCompact.vue) ────────────────────────────────────────

const COMPACT: SidebarTheme = {
  layout: { sideMarginPx: 40, color: '111111', lineHeight: 1.45 },
  sidebar: {
    width: 230, fill: '1A365D', pad: 22, photoSize: null, centered: false,
    name: { size: 16, bold: true, caps: true, tracking: 0.08, color: 'FFFFFF' },
    title: { size: 10, color: 'A8C4E0' },
    text: { size: 10, color: 'CCD9E8' },
    strong: { size: 10, bold: true, color: 'FFFFFF' },
    muted: { size: 10, color: 'A8C4E0' },
    label: { size: 10, color: 'FFFFFF', tracking: 0.1, after: 7, ...rule('5F7290') },
    gap: 14, contactLabel: false,
    contactOrder: ['location', 'email', 'phone', 'linkedin', 'website'],
    programs: 'list', languages: 'stacked',
  },
  main: {
    pad: 40, sectionGap: 16,
    heading: { size: 10.5, color: '1A365D', tracking: 0.06, ...rule('1A365D', 1.5) },
    body: { size: 10, color: '111111' },
    company: { size: 10.5, bold: true },
    date: { size: 10, color: '555555' },
    second: { size: 10, italics: true, color: '444444' },
    detail: { size: 10, color: '555555' },
    link: { size: 10, color: '1A365D' },
    datesWithRole: false, honorsOnRight: false, bulletLineHeight: 1.45,
  },
}

// ── Dark Sidebar (HarvardElegant.vue) ────────────────────────────────────────

const ELEGANT: SidebarTheme = {
  layout: { sideMarginPx: 40, color: '1A1A1A', lineHeight: 1.45 },
  sidebar: {
    width: 246, fill: '2C3E50', pad: 24, photoSize: 88, centered: true,
    name: { size: 17, bold: true, caps: true, tracking: 0.06, color: 'FFFFFF' },
    title: { size: 10, color: 'A8C4D4', tracking: 0.04 },
    text: { size: 10, color: 'C8DAE4' },
    strong: { size: 10, bold: true, color: 'FFFFFF' },
    muted: { size: 10, color: 'A8C4D4' },
    label: { size: 10, color: '4A90A4', tracking: 0.08, after: 10, rule: 'none' },
    gap: 20, contactLabel: true,
    contactOrder: ['phone', 'location', 'email', 'linkedin', 'website'],
    programs: 'inline', languages: 'row',
  },
  main: {
    pad: 40, sectionGap: 22,
    heading: { size: 10.5, color: '2C3E50', tracking: 0.07, after: 10, ...rule('2C3E50', 2) },
    body: { size: 10.5, color: '333333' },
    company: { size: 11, bold: true },
    date: { size: 10, color: '888888' },
    second: { size: 10, italics: true, color: '4A90A4' },
    detail: { size: 10, color: '444444' },
    link: { size: 10, color: '555555' },
    datesWithRole: true, honorsOnRight: false, bulletLineHeight: 1.5,
  },
}

// ── Waves (HarvardWave.vue) ──────────────────────────────────────────────────

const WAVE: SidebarTheme = {
  layout: { sideMarginPx: 48, color: '1D1D1F', lineHeight: 1.45 },
  sidebar: {
    width: 250, fill: 'EBF3FB', pad: 24, photoSize: 96, centered: false,
    name: { size: 19, bold: true, caps: true, tracking: -0.01, color: '0F172A' },
    title: { size: 11, color: '0071E3' },
    text: { size: 10, color: '334155' },
    strong: { size: 10, bold: true, color: '0F172A' },
    muted: { size: 10, color: '64748B' },
    label: { size: 10, color: '1A365D', tracking: 0.08, after: 10, ...rule('C9D5E3') },
    gap: 22, contactLabel: true,
    contactOrder: ['email', 'phone', 'location', 'linkedin', 'website'],
    programs: 'list', languages: 'inline',
  },
  main: {
    pad: 48, sectionGap: 22,
    heading: { size: 11, color: '1A365D', tracking: 0.08, ...rule('1A365D', 1.5) },
    body: { size: 11, color: '334155' },
    company: { size: 11, bold: true, color: '0F172A' },
    date: { size: 10, color: '64748B' },
    second: { size: 10, italics: true, color: '334155' },
    detail: { size: 10, color: '64748B' },
    link: { size: 10, color: '0071E3' },
    datesWithRole: false, honorsOnRight: true, bulletLineHeight: 1.45,
  },
}

export const COMPACT_LAYOUT = COMPACT.layout
export const ELEGANT_LAYOUT = ELEGANT.layout
export const WAVE_LAYOUT = WAVE.layout

export const buildCompact = (ctx: DocxContext) => build(ctx, COMPACT)
export const buildElegant = (ctx: DocxContext) => build(ctx, ELEGANT)
export const buildWave = (ctx: DocxContext) => build(ctx, WAVE)
