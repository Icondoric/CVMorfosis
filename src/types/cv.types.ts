// ─── CV Types ────────────────────────────────────────────────────────────────

export type AppLanguage = 'es' | 'en'
export type TemplateVariant = 'classic' | 'modern' | 'compact' | 'elegant' | 'elegant2' | 'elegant3' | 'wave'

// ─── Typography ───────────────────────────────────────────────────────────────

/**
 * System fonts are followed by a metric-compatible web font (Arimo, Tinos,
 * Carlito, Gelasio) so the PDF keeps the same line breaks on machines that
 * lack the original, e.g. a Linux PDF server. Web fonts are loaded in index.html.
 */
export const FONT_FAMILIES = [
  // ── Sans-serif ────────────────────────────────────────────────────────────
  { key: 'verdana',   label: 'Verdana',         stack: "Verdana, Geneva, 'DejaVu Sans', Tahoma, sans-serif" },
  { key: 'arial',     label: 'Arial',           stack: "Arial, Arimo, 'Helvetica Neue', Helvetica, sans-serif" },
  { key: 'calibri',   label: 'Calibri',         stack: "Calibri, Carlito, 'Gill Sans', 'Gill Sans MT', sans-serif" },
  { key: 'trebuchet', label: 'Trebuchet MS',    stack: "'Trebuchet MS', Helvetica, sans-serif" },
  { key: 'inter',     label: 'Inter',           stack: "'Inter', system-ui, sans-serif" },
  // ── Serif ─────────────────────────────────────────────────────────────────
  { key: 'times',     label: 'Times New Roman', stack: "'Times New Roman', Times, Tinos, serif" },
  { key: 'georgia',   label: 'Georgia',         stack: "Georgia, Gelasio, 'Times New Roman', serif" },
  { key: 'garamond',  label: 'Garamond',        stack: "'EB Garamond', Garamond, Georgia, serif" },
  { key: 'lora',      label: 'Lora',            stack: "'Lora', 'Times New Roman', serif" },
] as const

export type FontFamilyKey = typeof FONT_FAMILIES[number]['key']

/** Available body font sizes in px */
export const FONT_SIZES = [9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13] as const
export type FontSizeValue = typeof FONT_SIZES[number]

/** Available page/paper formats */
export const PAGE_SIZES = [
  { key: 'letter', label: 'Letter', dimensions: '8.5×11"',   widthPx: 816,  heightPx: 1056, puppeteerFormat: 'Letter' },
  { key: 'a4',     label: 'A4',     dimensions: '210×297mm', widthPx: 794,  heightPx: 1123, puppeteerFormat: 'A4'     },
  { key: 'legal',  label: 'Legal',  dimensions: '8.5×14"',   widthPx: 816,  heightPx: 1344, puppeteerFormat: 'Legal'  },
] as const

export type PageSizeKey = typeof PAGE_SIZES[number]['key']

/**
 * Vertical margins (px) kept free of content on every sheet. The first sheet's
 * top margin comes from each template's own padding, so its header can bleed.
 */
export const PAGE_MARGINS = { top: 44, bottom: 44 } as const

export interface CVTypography {
  fontFamily: FontFamilyKey
  fontSize:   number       // px value, e.g. 11
  pageSize:   PageSizeKey
}

export const DEFAULT_TYPOGRAPHY: CVTypography = {
  fontFamily: 'verdana',
  fontSize:   11,
  pageSize:   'letter',
}

export interface CVMeta {
  id: string
  language:   AppLanguage
  template:   TemplateVariant
  lastModified: string
  typography: CVTypography
}

export interface PersonalInfo {
  fullName: string
  title: string       // e.g. "Economista | Consultor Financiero"
  email: string
  phone: string
  location: string   // e.g. "Bogotá, COL"
  linkedin: string
  website: string
  photo: string      // base64 data URL, e.g. "data:image/jpeg;base64,..."
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string    // "Presente" | "Present" | specific date
  location: string
  bullets: string[]
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
  location: string
  honors: string
  thesis: string
}

export interface Achievement {
  id: string
  organization: string
  title: string
  description: string
  year: string
}

export interface Publication {
  id: string
  authors: string
  year: string
  title: string
  journal: string
  doi: string
}

/**
 * Standard proficiency levels (CEFR), in the same order for every language so
 * a level can be translated by position when the CV language changes.
 */
export const LANGUAGE_LEVELS: Record<AppLanguage, readonly string[]> = {
  es: ['Nativo', 'Bilingüe (C2)', 'Avanzado (C1)', 'Intermedio alto (B2)', 'Intermedio (B1)', 'Básico (A2)', 'Principiante (A1)'],
  en: ['Native', 'Proficient (C2)', 'Advanced (C1)', 'Upper intermediate (B2)', 'Intermediate (B1)', 'Elementary (A2)', 'Beginner (A1)'],
}

export interface LanguageEntry {
  id: string
  name: string
  level: string  // e.g. "Nativo", "Avanzado (C1)"
}

export interface Certification {
  id: string
  name: string          // Nombre del certificado/curso
  issuer: string        // Organización emisora (e.g. "Google", "Coursera", "AWS")
  date: string          // Fecha de emisión o año
  expiration?: string   // Fecha de vencimiento (opcional)
  credentialId?: string // ID o código de credencial (opcional)
  url?: string          // URL de verificación (opcional)
}

export interface CVData {
  meta: CVMeta
  personal: PersonalInfo
  summary: string
  education: EducationEntry[]
  experience: ExperienceEntry[]
  skills: string[]           // Rendered separated by " | "
  achievements: Achievement[]
  certifications: Certification[]
  programs: string[]         // Software: Power BI, MATLAB...
  languages: LanguageEntry[]
  publications: Publication[]
}

// ─── Default / Empty CV ───────────────────────────────────────────────────────

export function createEmptyCV(): CVData {
  return {
    meta: {
      id: crypto.randomUUID(),
      language: 'es',
      template: 'classic',
      lastModified: new Date().toISOString(),
      typography: { ...DEFAULT_TYPOGRAPHY },
    },
    personal: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      photo: '',
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    achievements: [],
    certifications: [],
    programs: [],
    languages: [],
    publications: [],
  }
}

export function createExperienceEntry(): ExperienceEntry {
  return { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''] }
}

export function createEducationEntry(): EducationEntry {
  return { id: crypto.randomUUID(), institution: '', degree: '', field: '', graduationDate: '', location: '', honors: '', thesis: '' }
}

export function createAchievement(): Achievement {
  return { id: crypto.randomUUID(), organization: '', title: '', description: '', year: '' }
}

export function createCertification(): Certification {
  return { id: crypto.randomUUID(), name: '', issuer: '', date: '', expiration: '', credentialId: '', url: '' }
}

export function createPublication(): Publication {
  return { id: crypto.randomUUID(), authors: '', year: '', title: '', journal: '', doi: '' }
}

export function createLanguageEntry(): LanguageEntry {
  return { id: crypto.randomUUID(), name: '', level: '' }
}
