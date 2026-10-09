/** Word version of the ATS export (HarvardATS.vue): plain single column, black text */

import { BorderStyle, Paragraph, type ParagraphChild } from 'docx'
import {
  bullets, gapBefore, joined, mailLink, nameHeading, paragraph, sectionHeading, text, twips, webLink,
  type DocSection, type DocxContext,
} from './blocks'

export const ATS_LAYOUT = { sideMarginPx: 54, color: '000000', lineHeight: 1.5 }

const SECTION_GAP = 14

export function buildAts(ctx: DocxContext): DocSection[] {
  const { cv, t } = ctx
  const p = cv.personal
  const out: Paragraph[] = []
  const section = (key: string) => out.push(sectionHeading(ctx, t(`sections.${key}`), { before: SECTION_GAP }))
  const line = (children: ParagraphChild[], o = {}) => out.push(paragraph(ctx, children, o))

  // ── Header ────────────────────────────────────────────────────────────────
  if (p.fullName.trim()) out.push(nameHeading(ctx, p.fullName, { size: 22, bold: true, caps: true, tracking: 0.02 }, { after: 4 }))
  if (p.title) line([text(ctx, p.title, { size: 12 })], { after: 8, size: 12 })
  const CONTACT = { size: 10.5 }
  const contact = joined(ctx, [
    p.email && mailLink(ctx, p.email, CONTACT),
    p.phone && text(ctx, p.phone, CONTACT),
    p.location && text(ctx, p.location, CONTACT),
    p.linkedin && webLink(ctx, p.linkedin, CONTACT),
    p.website && webLink(ctx, p.website, CONTACT),
  ], ' | ', CONTACT)
  // The rule under the header is the bottom border of its last line
  out.push(new Paragraph({
    spacing: { after: twips(0) },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ctx.color, space: 8 } },
    children: contact,
  }))

  // ── Perfil ────────────────────────────────────────────────────────────────
  if (cv.summary) {
    section('summary')
    line([text(ctx, cv.summary)])
  }

  // ── Experiencia ───────────────────────────────────────────────────────────
  if (cv.experience.length) {
    section('experience')
    cv.experience.forEach((exp, i) => {
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ')
      line([text(ctx, [exp.company, exp.location].filter(Boolean).join(', '), { bold: true })], { before: gapBefore(i, 10), keepNext: true })
      line([text(ctx, exp.role, { bold: true }), ...(dates ? [text(ctx, ` | ${dates}`)] : [])], { after: 4, keepNext: true })
      out.push(...bullets(ctx, exp.bullets))
    })
  }

  // ── Educación ─────────────────────────────────────────────────────────────
  if (cv.education.length) {
    section('education')
    cv.education.forEach((edu, i) => {
      const where = edu.institution
        + (edu.graduationDate ? ` | ${edu.graduationDate}` : '')
        + (edu.location ? `, ${edu.location}` : '')
      line([text(ctx, [edu.degree, edu.field].filter(Boolean).join(' — '), { bold: true })], { before: gapBefore(i, 8), keepNext: true })
      line([text(ctx, where)], { keepNext: Boolean(edu.honors || edu.thesis) })
      if (edu.honors) line([text(ctx, edu.honors, { italics: true })], { keepNext: Boolean(edu.thesis) })
      if (edu.thesis) line([text(ctx, `${t('preview.thesis')}: ${edu.thesis}`)])
    })
  }

  // ── Habilidades blandas ───────────────────────────────────────────────────
  const skills = cv.skills.filter(s => s.trim())
  if (skills.length) {
    section('skills')
    out.push(...bullets(ctx, skills))
  }

  // ── Idiomas ───────────────────────────────────────────────────────────────
  if (cv.languages.length) {
    section('languages')
    line([text(ctx, cv.languages.map(l => `${l.name}: ${l.level}`).join(' | '))])
  }

  // ── Habilidades técnicas ──────────────────────────────────────────────────
  const programs = cv.programs.filter(s => s.trim())
  if (programs.length) {
    section('programs')
    line([text(ctx, programs.join(', '))])
  }

  // ── Logros ────────────────────────────────────────────────────────────────
  if (cv.achievements.length) {
    section('achievements')
    cv.achievements.forEach((ach, i) => {
      line([text(ctx, ach.title + (ach.year ? ` (${ach.year})` : ''), { bold: true })], { before: gapBefore(i, 6), keepNext: Boolean(ach.organization || ach.description) })
      if (ach.organization) line([text(ctx, ach.organization)], { keepNext: Boolean(ach.description) })
      if (ach.description) line([text(ctx, ach.description)])
    })
  }

  // ── Certificaciones ───────────────────────────────────────────────────────
  const certifications = cv.certifications ?? []
  if (certifications.length) {
    section('certifications')
    certifications.forEach((cert, i) => {
      const dates = [cert.date, cert.expiration].filter(Boolean).join(' - ')
      line([text(ctx, cert.name + (cert.date ? ` (${dates})` : ''), { bold: true })], { before: gapBefore(i, 6), keepNext: true })
      line(joined(ctx, [
        cert.issuer && text(ctx, cert.issuer),
        cert.credentialId && text(ctx, `ID: ${cert.credentialId}`),
        cert.url && webLink(ctx, cert.url),
      ], ' | '))
    })
  }

  // ── Publicaciones ─────────────────────────────────────────────────────────
  if (cv.publications.length) {
    section('publications')
    cv.publications.forEach((pub, i) => {
      line([text(ctx, `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}${pub.doi ? `. DOI: ${pub.doi}` : ''}.`)], { before: gapBefore(i, 6) })
    })
  }

  return [{ children: out }]
}
