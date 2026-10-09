/**
 * Word versions of the two Minimal templates (HarvardElegant2.vue): large
 * name on the left, contact details on the right, then the sections.
 *
 *  - Minimal (`stacked`): each section title sits above its content, with a
 *    thin divider between sections. Plain paragraphs, no table in the body.
 *  - Minimal Side: titles in a narrow left column beside their content. Word
 *    needs a two-column table for that, one row per section.
 */

import { AlignmentType, Paragraph } from 'docx'
import {
  bullets, cell, gapBefore, joined, layoutRow, layoutTable, mailLink, nameHeading, paragraph, photo, sectionHeading, tableSeparator, text, webLink,
  type BlockOptions, type DocSection, type DocxContext, type TextStyle,
} from './blocks'

export const MINIMAL_LAYOUT = { sideMarginPx: 54, color: '2D2D2D', lineHeight: 1.45 }

const LINK = '3A6FA8'
const PHOTO_SIZE = 88
const CONTACT_WIDTH = 140
const LABEL_COLUMN = 0.22

/** The two templates differ in a few sizes and tones, as their CSS does */
interface Look {
  /** Smallest text size in px */
  small: number
  /** First line of an entry (company, degree, organization, issuer) and its trailing detail */
  level1: string
  level1Meta: string
  /** Long text is justified in the side layout, ragged-right in the stacked one */
  body: BlockOptions
}

const STACKED: Look = { small: 10, level1: '444444', level1Meta: '777777', body: {} }
const SIDE: Look = { small: 9.5, level1: '888888', level1Meta: 'AAAAAA', body: { alignment: AlignmentType.JUSTIFIED } }

interface Section { key: string; body: Paragraph[] }

function header(ctx: DocxContext, look: Look, width: number) {
  const p = ctx.cv.personal
  const identity: Paragraph[] = []
  if (p.fullName.trim()) identity.push(nameHeading(ctx, p.fullName, { size: 34, bold: true, caps: true, tracking: 0.04, color: '1A1A1A' }, { after: 6 }))
  if (p.title) identity.push(paragraph(ctx, [text(ctx, p.title, { caps: true, tracking: 0.08 })]))

  const CONTACT = { size: look.small, italics: true, color: '555555' }
  const CONTACT_LINK = { ...CONTACT, color: LINK }
  const right = { alignment: AlignmentType.RIGHT, size: look.small, lineHeight: 1.7 }
  const contact = [
    p.phone && paragraph(ctx, [text(ctx, p.phone, CONTACT)], right),
    p.location && paragraph(ctx, [text(ctx, p.location, CONTACT)], right),
    p.email && paragraph(ctx, [mailLink(ctx, p.email, CONTACT_LINK)], right),
    p.linkedin && paragraph(ctx, [webLink(ctx, p.linkedin, CONTACT_LINK)], right),
    p.website && paragraph(ctx, [webLink(ctx, p.website, CONTACT_LINK)], right),
  ].filter((x): x is Paragraph => Boolean(x))

  const picture = photo(ctx, PHOTO_SIZE)
  const photoWidth = picture ? PHOTO_SIZE + 18 : 0
  const nameWidth = width - photoWidth - CONTACT_WIDTH
  return layoutRow(
    [
      ...(picture ? [cell([new Paragraph({ children: [picture] })], { width: photoWidth, padding: [2, 18, 14, 0] })] : []),
      cell(identity, { width: nameWidth, padding: [0, 12, 14, 0] }),
      cell(contact, { width: CONTACT_WIDTH, padding: [4, 0, 14, 0] }),
    ],
    [...(picture ? [photoWidth] : []), nameWidth, CONTACT_WIDTH],
    { bottomRule: { color: 'BBBBBB', widthPx: 1 } },
  )
}

/** The content of every non-empty section, without its title */
function sections(ctx: DocxContext, look: Look): Section[] {
  const { cv, t } = ctx
  const BODY: TextStyle = { size: 10.5, color: '333333' }
  const LEVEL1: TextStyle = { size: 10.5, bold: true, color: look.level1 }
  const META: TextStyle = { size: 10.5, color: look.level1Meta }
  const LEVEL2: TextStyle = { size: 10.5, bold: true, color: '2D2D2D' }
  const SMALL: TextStyle = { size: look.small, color: '666666' }
  const result: Section[] = []
  const add = (key: string, body: Paragraph[]) => { if (body.length) result.push({ key, body }) }

  if (cv.summary) add('summary', [paragraph(ctx, [text(ctx, cv.summary, { color: '333333' })], { ...look.body, lineHeight: 1.55 })])

  add('experience', cv.experience.flatMap((exp, i) => {
    const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ')
    return [
      paragraph(ctx, [text(ctx, exp.company, LEVEL1), ...(exp.location ? [text(ctx, ` — ${exp.location}`, META)] : [])], { before: gapBefore(i, 14), after: 1, size: 10.5, keepNext: true }),
      paragraph(ctx, [text(ctx, exp.role, LEVEL2), ...(dates ? [text(ctx, ` | ${dates}`, { size: 10.5, color: '2D2D2D' })] : [])], { after: 4, size: 10.5, keepNext: true }),
      ...bullets(ctx, exp.bullets, { ...look.body, lineHeight: 1.55 }, BODY),
    ]
  }))

  add('education', cv.education.flatMap((edu, i) => {
    const detail = [edu.graduationDate, edu.location].filter(Boolean).join(', ')
    const hasMore = Boolean(edu.honors || edu.thesis)
    return [
      paragraph(ctx, [text(ctx, [edu.degree, edu.field].filter(Boolean).join(' — '), LEVEL1)], { before: gapBefore(i, 14), after: 1, size: 10.5, keepNext: true }),
      paragraph(ctx, [text(ctx, edu.institution, { size: 10.5, italics: true }), ...(detail ? [text(ctx, ` | ${detail}`, { size: 10.5 })] : [])], { size: 10.5, keepNext: hasMore }),
      ...(edu.honors ? [paragraph(ctx, [text(ctx, edu.honors, { size: look.small, italics: true, color: '888888' })], { before: 2, size: look.small, keepNext: Boolean(edu.thesis) })] : []),
      ...(edu.thesis ? [paragraph(ctx, [text(ctx, `${t('preview.thesis')}: `, SMALL), text(ctx, edu.thesis, { ...SMALL, italics: true })], { before: 2, size: look.small })] : []),
    ]
  }))

  const skills = cv.skills.filter(s => s.trim())
  if (skills.length) add('skills', [paragraph(ctx, [text(ctx, skills.join(' | '), { color: '333333' })], { lineHeight: 1.7 })])

  add('achievements', cv.achievements.flatMap((ach, i) => [
    paragraph(ctx, [text(ctx, ach.organization, LEVEL1), ...(ach.year ? [text(ctx, ` — ${ach.year}`, META)] : [])], { before: gapBefore(i, 14), after: 1, size: 10.5, keepNext: true }),
    paragraph(ctx, [text(ctx, ach.title, LEVEL2)], { after: ach.description ? 3 : 0, size: 10.5, keepNext: Boolean(ach.description) }),
    ...(ach.description ? [paragraph(ctx, [text(ctx, ach.description, BODY)], { size: 10.5, lineHeight: 1.5 })] : []),
  ]))

  const programs = cv.programs.filter(s => s.trim())
  if (programs.length) add('programs', [paragraph(ctx, [text(ctx, programs.join(' | '), { color: '333333' })], { lineHeight: 1.7 })])

  add('certifications', (cv.certifications ?? []).flatMap((cert, i) => {
    const dates = [cert.date, cert.expiration].filter(Boolean).join(' - ')
    const hasDetail = Boolean(cert.credentialId || cert.url)
    return [
      paragraph(ctx, [text(ctx, cert.issuer, LEVEL1), ...(cert.date ? [text(ctx, ` — ${dates}`, META)] : [])], { before: gapBefore(i, 12), after: 1, size: 10.5, keepNext: true }),
      paragraph(ctx, [text(ctx, cert.name, LEVEL2)], { after: hasDetail ? 2 : 0, size: 10.5, keepNext: hasDetail }),
      ...(hasDetail ? [paragraph(ctx, joined(ctx, [
        cert.credentialId && text(ctx, `ID: ${cert.credentialId}`, SMALL),
        cert.url && webLink(ctx, cert.url, { size: look.small, color: LINK }),
      ], ' · ', SMALL), { size: look.small })] : []),
    ]
  }))

  add('languages', cv.languages.map(lang => paragraph(ctx, [text(ctx, `${lang.name}: ${lang.level}`, BODY)], { size: 10.5, lineHeight: 1.6 })))

  add('publications', cv.publications.map((pub, i) => paragraph(ctx, [
    text(ctx, `${pub.authors} (${pub.year}). `, BODY),
    text(ctx, pub.title, { ...BODY, italics: true }),
    text(ctx, `. ${pub.journal}${pub.doi ? `. DOI: ${pub.doi}` : ''}.`, BODY),
  ], { before: gapBefore(i, 8), size: 10.5, lineHeight: 1.5 })))

  return result
}

/** Minimal: titles above their content */
export function buildMinimal(ctx: DocxContext): DocSection[] {
  const width = ctx.page.widthPx - MINIMAL_LAYOUT.sideMarginPx * 2
  const HEADING = { size: 10, color: '1A1A1A', tracking: 0.08 }
  // From the second section on, the title carries the divider that closes the previous one
  const body = sections(ctx, STACKED).flatMap(({ key, body }, i) => [
    sectionHeading(ctx, ctx.t(`sections.${key}`), i === 0
      ? { ...HEADING, before: 22, rule: 'none' }
      : { ...HEADING, before: 12, rule: 'top', ruleColor: 'D0D0D0', ruleGapPx: 14 }),
    ...body,
  ])
  return [{ children: [header(ctx, STACKED, width), ...body] }]
}

/** Minimal Side: titles in a left column, one table row per section */
export function buildMinimalSide(ctx: DocxContext): DocSection[] {
  const width = ctx.page.widthPx - MINIMAL_LAYOUT.sideMarginPx * 2
  const labelWidth = Math.round(width * LABEL_COLUMN)
  const bodyWidth = width - labelWidth
  const all = sections(ctx, SIDE)

  const rows = all.map(({ key, body }, i) => {
    const last = i === all.length - 1
    return [
      cell(
        [sectionHeading(ctx, ctx.t(`sections.${key}`), { size: 8.5, color: '1A1A1A', tracking: 0.08, rule: 'none', after: 0, keepNext: false })],
        { width: labelWidth, padding: [i === 0 ? 22 : 16, 20, 12, 0] },
      ),
      // The divider only spans the content column, as in the preview
      cell(body, { width: bodyWidth, padding: [i === 0 ? 22 : 14, 0, 12, 0], bottomRule: last ? undefined : { color: 'D0D0D0', widthPx: 1 } }),
    ]
  })

  return [{ children: [header(ctx, SIDE, width), ...(rows.length ? [tableSeparator(), layoutTable(rows, [labelWidth, bodyWidth])] : [])] }]
}
