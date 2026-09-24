// ─── CV Types ────────────────────────────────────────────────────────────────

export type AppLanguage = 'es' | 'en'
export type TemplateVariant = 'classic' | 'modern' | 'compact' | 'elegant' | 'elegant2' | 'wave'

export interface CVMeta {
  id: string
  language: AppLanguage
  template: TemplateVariant
  lastModified: string
}

export interface PersonalInfo {
  fullName: string
  firstName?: string
  lastName?: string
  title: string       // e.g. "Economista | Consultor Financiero"
  useTitleAsHeading?: boolean
  email: string
  phone: string
  address?: string
  postalCode?: string
  city?: string
  location: string   // e.g. "Bogotá, COL"
  linkedin: string
  website: string
  photo: string      // base64 data URL, e.g. "data:image/jpeg;base64,..."
  birthDate?: string
  birthPlace?: string
  driverLicense?: string
  gender?: string
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

export interface LanguageEntry {
  id: string
  name: string
  level: string  // e.g. "Nativo", "Avanzado (C1)"
}

export interface CVData {
  meta: CVMeta
  personal: PersonalInfo
  summary: string
  education: EducationEntry[]
  experience: ExperienceEntry[]
  skills: string[]           // Rendered separated by " | "
  achievements: Achievement[]
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
    },
    personal: {
      fullName: '',
      firstName: '',
      lastName: '',
      title: '',
      useTitleAsHeading: false,
      email: '',
      phone: '',
      address: '',
      postalCode: '',
      city: '',
      location: '',
      linkedin: '',
      website: '',
      photo: '',
      birthDate: '',
      birthPlace: '',
      driverLicense: '',
      gender: '',
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    achievements: [],
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

export function createPublication(): Publication {
  return { id: crypto.randomUUID(), authors: '', year: '', title: '', journal: '', doi: '' }
}

export function createLanguageEntry(): LanguageEntry {
  return { id: crypto.randomUUID(), name: '', level: '' }
}
