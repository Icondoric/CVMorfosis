/**
 * Word version of the Executive template (HarvardModern.vue): a full-width
 * navy band with the name and contact details, then a single column whose
 * entries carry a navy accent line on the left.
 */

import { type Paragraph } from 'docx'
import {
  bullets, cell, gapBefore, joined, layoutRow, mailLink, nameHeading, paragraph, sectionHeading, splitRow, text, webLink,
  type BlockOptions, type DocSection, type DocxContext,
} from './blocks'

export const MODERN_LAYOUT = { sideMarginPx: 56, color: '1A1A1A', lineHeight: 1.45 }

const NAVY = '1A365D'
const SECTION_GAP = 20
const DATE = { size: 10, bold: true, color: NAVY }
const SUBTLE = { size: 10.5, italics: true, color: '555555' }
/** Entries sit to the right of a 2 px accent line */
const ENTRY: BlockOptions = { indent: 16, leftRule: { color: NAVY, widthPx: 2, gapPx: 14 } }

export function buildModern(ctx: DocxContext): DocSection[] {
  const { cv, t } = ctx
  const p = cv.personal
  const side = MODERN_LAYOUT.sideMarginPx

  // ── Band ──────────────────────────────────────────────────────────────────
  // A shaded cell as wide as the sheet. It lives in its own section with no
  // margins so the colour reaches the top and side edges of the first page.
  const CONTACT = { size: 10, color: 'CCD9E8' }
  const band: Paragraph[] = []
  if (p.fullName.trim()) band.push(nameHeading(ctx, p.fullName, { size: 26, bold: true, caps: true, tracking: 0.05, color: 'FFFFFF' }, { after: 6 }))
  if (p.title) band.push(paragraph(ctx, [text(ctx, p.title, { size: 13, color: 'A8C4E0' })], { after: 10, size: 13 }))
  const contact = joined(ctx, [
    p.location && text(ctx, p.location, CONTACT),
    p.email && mailLink(ctx, p.email, CONTACT),
    p.phone && text(ctx, p.phone, CONTACT),
    p.linkedin && webLink(ctx, p.linkedin, CONTACT),
    p.website && webLink(ctx, p.website, CONTACT),
  ], '   ·   ', CONTACT)
  if (contact.length) band.push(paragraph(ctx, contact, { size: 10 }))

  const header = layoutRow(
    [cell(band, { width: ctx.page.widthPx, fill: NAVY, padding: [36, side, 28, side] })],
    [ctx.page.widthPx],
  )

  // ── Body ──────────────────────────────────────────────────────────────────
  const out: Paragraph[] = []
  let first = true
  const section = (key: string) => {
    // The paragraph Word needs to close the band's section already adds some space
    out.push(sectionHeading(ctx, t(`sections.${key}`), {
      before: first ? 14 : SECTION_GAP, after: 10, size: 11, color: NAVY, tracking: 0.08, ruleColor: NAVY, ruleWidthPx: 2, ruleGapPx: 4,
    }))
    first = false
  }

  if (cv.summary) {
    section('summary')
    out.push(paragraph(ctx, [text(ctx, cv.summary, { color: '333333' })], { lineHeight: 1.6 }))
  }

  if (cv.experience.length) {
    section('experience')
    cv.experience.forEach((exp, i) => {
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ')
      out.push(splitRow(ctx, [text(ctx, exp.role, { bold: true })], dates ? [text(ctx, dates, DATE)] : [], { ...ENTRY, before: gapBefore(i, 14), keepNext: true }))
      out.push(paragraph(ctx, [text(ctx, [exp.company, exp.location].filter(Boolean).join(' · '), SUBTLE)], { ...ENTRY, before: 2, after: 5, size: 10.5, keepNext: true }))
      out.push(...bullets(ctx, exp.bullets, { ...ENTRY, lineHeight: 1.5 }))
    })
  }

  if (cv.education.length) {
    section('education')
    cv.education.forEach((edu, i) => {
      const place = [edu.institution, edu.location].filter(Boolean).join(', ')
      const hasMore = Boolean(edu.honors || edu.thesis)
      out.push(splitRow(ctx, [text(ctx, [edu.degree, edu.field].filter(Boolean).join(' — '), { bold: true })], edu.graduationDate ? [text(ctx, edu.graduationDate, DATE)] : [], { ...ENTRY, before: gapBefore(i, 10), keepNext: true }))
      out.push(paragraph(ctx, [text(ctx, place, SUBTLE)], { ...ENTRY, before: 2, size: 10.5, keepNext: hasMore }))
      if (edu.honors) out.push(paragraph(ctx, [text(ctx, edu.honors, { size: 10, color: '888888' })], { ...ENTRY, before: 1, size: 10, keepNext: Boolean(edu.thesis) }))
      if (edu.thesis) out.push(paragraph(ctx, [text(ctx, `${t('preview.thesis')}: `, { size: 10, color: '555555' }), text(ctx, edu.thesis, { size: 10, color: '555555', italics: true })], { ...ENTRY, before: 1, size: 10 }))
    })
  }

  const skills = cv.skills.filter(s => s.trim())
  if (skills.length) {
    section('skills')
    out.push(paragraph(ctx, [text(ctx, skills.join(', '), { size: 10, color: NAVY })], { size: 10, lineHeight: 1.6 }))
  }

  if (cv.achievements.length) {
    section('achievements')
    cv.achievements.forEach((ach, i) => {
      out.push(splitRow(ctx, [text(ctx, ach.organization, { bold: true })], ach.year ? [text(ctx, ach.year, { size: 10, color: '888888' })] : [], { before: gapBefore(i, 8), keepNext: true }))
      out.push(paragraph(ctx, [text(ctx, ach.title, { italics: true, color: '444444' })], { keepNext: Boolean(ach.description) }))
      if (ach.description) out.push(paragraph(ctx, [text(ctx, ach.description, { color: '555555' })], { before: 2 }))
    })
  }

  const programs = cv.programs.filter(s => s.trim())
  if (programs.length) {
    section('programs')
    out.push(paragraph(ctx, [text(ctx, programs.join(', '), { size: 10 })], { size: 10, lineHeight: 1.6 }))
  }

  const certifications = cv.certifications ?? []
  if (certifications.length) {
    section('certifications')
    certifications.forEach((cert, i) => {
      const dates = [cert.date, cert.expiration].filter(Boolean).join(' - ')
      out.push(splitRow(ctx, [text(ctx, cert.name, { bold: true })], cert.date ? [text(ctx, dates, DATE)] : [], { ...ENTRY, before: gapBefore(i, 10), keepNext: true }))
      out.push(paragraph(ctx, [text(ctx, cert.issuer + (cert.credentialId ? ` · ID: ${cert.credentialId}` : ''), SUBTLE)], { ...ENTRY, before: 2, size: 10.5, keepNext: Boolean(cert.url) }))
      if (cert.url) out.push(paragraph(ctx, [webLink(ctx, cert.url, { size: 10, color: NAVY })], { ...ENTRY, before: 1, size: 10 }))
    })
  }

  if (cv.languages.length) {
    section('languages')
    cv.languages.forEach(lang => out.push(paragraph(ctx, [text(ctx, lang.name, { bold: true }), text(ctx, `: ${lang.level}`)], { after: 3 })))
  }

  if (cv.publications.length) {
    section('publications')
    cv.publications.forEach((pub, i) => {
      out.push(paragraph(ctx, [
        text(ctx, `${pub.authors} (${pub.year}). `),
        text(ctx, pub.title, { italics: true }),
        text(ctx, `. ${pub.journal}${pub.doi ? `. DOI: ${pub.doi}` : ''}.`),
      ], { before: gapBefore(i, 6), lineHeight: 1.5 }))
    })
  }

  return [
    { children: [header], margins: { top: 0, left: 0, right: 0 } },
    { children: out },
  ]
}
