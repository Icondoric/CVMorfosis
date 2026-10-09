/** Word version of the Classic template (HarvardClassic.vue): one column, centered header */

import { AlignmentType, type Paragraph } from 'docx'
import {
  bullets, gapBefore, joined, mailLink, nameHeading, paragraph, sectionHeading, splitRow, text, webLink,
  type DocSection, type DocxContext,
} from './blocks'

export const CLASSIC_LAYOUT = { sideMarginPx: 58, color: '111111', lineHeight: 1.45 }

const SECTION_GAP = 16
const DATE = { size: 10.5, color: '444444' }
const SUBTLE = { italics: true, color: '333333' }

export function buildClassic(ctx: DocxContext): DocSection[] {
  const { cv, t } = ctx
  const p = cv.personal
  const out: Paragraph[] = []
  const section = (key: string) => out.push(sectionHeading(ctx, t(`sections.${key}`), { before: SECTION_GAP, ruleWidthPx: 1.5 }))

  // ── Header ────────────────────────────────────────────────────────────────
  const CONTACT = { size: 10.5, color: '333333' }
  if (p.fullName.trim()) {
    out.push(nameHeading(ctx, p.fullName, { size: 22, bold: true, caps: true, tracking: 0.1 }, { alignment: AlignmentType.CENTER, after: 6 }))
  }
  if (p.title) {
    out.push(paragraph(ctx, [text(ctx, p.title, { size: 12, italics: true, color: '444444' })], { alignment: AlignmentType.CENTER, after: 6, size: 12 }))
  }
  const contact = joined(ctx, [
    p.location && text(ctx, p.location, CONTACT),
    p.email && mailLink(ctx, p.email, CONTACT),
    p.phone && text(ctx, p.phone, CONTACT),
    p.linkedin && webLink(ctx, p.linkedin, CONTACT),
    p.website && webLink(ctx, p.website, CONTACT),
  ], '  ·  ', CONTACT)
  if (contact.length) out.push(paragraph(ctx, contact, { alignment: AlignmentType.CENTER, after: 4, size: 10.5 }))

  // ── Perfil ────────────────────────────────────────────────────────────────
  if (cv.summary) {
    section('summary')
    out.push(paragraph(ctx, [text(ctx, cv.summary)], { lineHeight: 1.55 }))
  }

  // ── Experiencia ───────────────────────────────────────────────────────────
  if (cv.experience.length) {
    section('experience')
    cv.experience.forEach((exp, i) => {
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ')
      out.push(splitRow(ctx, [text(ctx, exp.company, { bold: true })], dates ? [text(ctx, dates, DATE)] : [], { before: gapBefore(i, 12), keepNext: true }))
      out.push(paragraph(ctx, [text(ctx, [exp.role, exp.location].filter(Boolean).join(' · '), SUBTLE)], { after: 4, keepNext: true }))
      out.push(...bullets(ctx, exp.bullets))
    })
  }

  // ── Educación ─────────────────────────────────────────────────────────────
  if (cv.education.length) {
    section('education')
    cv.education.forEach((edu, i) => {
      const degree = [edu.degree, edu.field].filter(Boolean).join(' — ')
      const place = [edu.institution, edu.location].filter(Boolean).join(', ')
      out.push(splitRow(ctx, [text(ctx, degree, { bold: true })], edu.graduationDate ? [text(ctx, edu.graduationDate, DATE)] : [], { before: gapBefore(i, 10), keepNext: true }))
      out.push(splitRow(ctx, [text(ctx, place, SUBTLE)], edu.honors ? [text(ctx, edu.honors, { size: 10, color: '555555' })] : [], { keepNext: Boolean(edu.thesis) }))
      if (edu.thesis) {
        out.push(paragraph(ctx, [text(ctx, `${t('preview.thesis')}: `, DATE), text(ctx, edu.thesis, { ...DATE, italics: true })], { before: 2, size: 10.5 }))
      }
    })
  }

  // ── Habilidades blandas ───────────────────────────────────────────────────
  const skills = cv.skills.filter(s => s.trim())
  if (skills.length) {
    section('skills')
    out.push(paragraph(ctx, [text(ctx, skills.join(' | '))]))
  }

  // ── Logros ────────────────────────────────────────────────────────────────
  if (cv.achievements.length) {
    section('achievements')
    cv.achievements.forEach((ach, i) => {
      out.push(splitRow(ctx, [text(ctx, ach.organization, { bold: true })], ach.year ? [text(ctx, ach.year, DATE)] : [], { before: gapBefore(i, 8), keepNext: true }))
      out.push(paragraph(ctx, [text(ctx, ach.title, SUBTLE)], { keepNext: Boolean(ach.description) }))
      if (ach.description) out.push(paragraph(ctx, [text(ctx, ach.description, { color: '444444' })], { before: 2, lineHeight: 1.4 }))
    })
  }

  // ── Habilidades técnicas ──────────────────────────────────────────────────
  const programs = cv.programs.filter(s => s.trim())
  if (programs.length) {
    section('programs')
    out.push(paragraph(ctx, [text(ctx, programs.join(' | '))], { lineHeight: 1.6 }))
  }

  // ── Certificaciones ───────────────────────────────────────────────────────
  const certifications = cv.certifications ?? []
  if (certifications.length) {
    section('certifications')
    certifications.forEach((cert, i) => {
      const dates = [cert.date, cert.expiration].filter(Boolean).join(' - ')
      const SMALL = { size: 10, color: '555555' }
      const hasDetail = Boolean(cert.credentialId || cert.url)
      out.push(splitRow(
        ctx,
        [text(ctx, cert.name, { bold: true }), ...(cert.issuer ? [text(ctx, ` — ${cert.issuer}`, SUBTLE)] : [])],
        cert.date ? [text(ctx, dates, DATE)] : [],
        { before: gapBefore(i, 8), keepNext: hasDetail },
      ))
      if (hasDetail) {
        out.push(paragraph(ctx, joined(ctx, [
          cert.credentialId && text(ctx, `${t('preview.credentialId')}: ${cert.credentialId}`, SMALL),
          cert.url && webLink(ctx, cert.url, { size: 10, color: '0071E3' }),
        ], ' | ', SMALL), { before: 1, size: 10 }))
      }
    })
  }

  // ── Idiomas ───────────────────────────────────────────────────────────────
  if (cv.languages.length) {
    section('languages')
    cv.languages.forEach(lang => {
      out.push(paragraph(ctx, [text(ctx, lang.name, { bold: true }), text(ctx, `: ${lang.level}`)], { after: 3 }))
    })
  }

  // ── Publicaciones ─────────────────────────────────────────────────────────
  if (cv.publications.length) {
    section('publications')
    cv.publications.forEach((pub, i) => {
      out.push(paragraph(ctx, [
        text(ctx, `${pub.authors} (${pub.year}). `),
        text(ctx, pub.title, { italics: true }),
        text(ctx, `. ${pub.journal}${pub.doi ? `. DOI: ${pub.doi}` : ''}.`),
      ], { before: gapBefore(i, 8), lineHeight: 1.4 }))
    })
  }

  return [{ children: out }]
}
