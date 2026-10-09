import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  type CVData,
  type TemplateVariant,
  type AppLanguage,
  type CVTypography,
  DEFAULT_TYPOGRAPHY,
  LANGUAGE_LEVELS,
  createEmptyCV,
  createExperienceEntry,
  createEducationEntry,
  createAchievement,
  createCertification,
  createPublication,
  createLanguageEntry,
} from '@/types/cv.types'

const STORAGE_KEY = 'cvjob_data'

/** Lists whose entries carry an id and can be reordered, removed and restored */
export type EntryListKey = 'experience' | 'education' | 'achievements' | 'certifications' | 'languages' | 'publications'

/** "Present" as an end date is written in the language of the CV */
const PRESENT_WORD: Record<AppLanguage, string> = { es: 'Presente', en: 'Present' }
const PRESENT_PATTERN = /^(presente|present)$/i

export const useCVStore = defineStore('cv', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const cv = ref<CVData>(loadFromStorage())

  // ── Persistence ───────────────────────────────────────────────────────────
  function loadFromStorage(): CVData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CVData
        const empty = createEmptyCV()
        const storedTypo = parsed.meta?.typography
        // 'helvetica' was removed: it rendered as Arial on Windows
        const storedFont: string | undefined = storedTypo?.fontFamily
        const fontFamily = !storedTypo
          ? DEFAULT_TYPOGRAPHY.fontFamily
          : storedFont === 'helvetica' ? 'arial' : storedTypo.fontFamily

        return {
          ...empty,
          ...parsed,
          personal:       { ...empty.personal, ...parsed.personal },
          meta:           {
            ...empty.meta,
            ...parsed.meta,
            // Backwards-compat: old CVs won't have typography
            typography: { ...DEFAULT_TYPOGRAPHY, ...(storedTypo ?? {}), fontFamily },
          },
          certifications: parsed.certifications ?? [],
        }
      }
    } catch {
      // ignore
    }
    return createEmptyCV()
  }

  /** True when the last auto-save was rejected (browser storage full or blocked) */
  const saveFailed = ref(false)

  // Stamping lastModified changes the CV, which fires the auto-save watcher
  // again: the content snapshot lets that second run stop instead of saving twice.
  let savedSnapshot = ''

  function saveToStorage() {
    const snapshot = JSON.stringify({ ...cv.value, meta: { ...cv.value.meta, lastModified: '' } })
    if (snapshot === savedSnapshot) return
    savedSnapshot = snapshot
    cv.value.meta.lastModified = new Date().toISOString()
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv.value))
      saveFailed.value = false
    } catch {
      saveFailed.value = true
    }
  }

  function resetCV() {
    cv.value = createEmptyCV()
    lastRemoved.value = null
    saveToStorage()
  }

  /** Whether the user has typed anything worth protecting from an overwrite */
  const hasContent = computed(() => {
    const c = cv.value
    return Boolean(
      c.personal.fullName.trim() || c.personal.email.trim() || c.summary.trim() ||
      c.experience.length || c.education.length || c.achievements.length ||
      c.certifications?.length || c.languages.length || c.publications.length ||
      c.skills.some(s => s.trim()) || c.programs.some(p => p.trim()),
    )
  })

  // ── Entry lists: remove with undo, reorder ────────────────────────────────
  const lastRemoved = ref<{ list: EntryListKey; index: number; item: unknown } | null>(null)

  function removeEntry(list: EntryListKey, id: string) {
    const items = (cv.value[list] ?? []) as { id: string }[]
    const index = items.findIndex(i => i.id === id)
    if (index < 0) return
    const [item] = items.splice(index, 1)
    lastRemoved.value = { list, index, item }
  }

  function undoRemove() {
    const removed = lastRemoved.value
    if (!removed) return
    const items = cv.value[removed.list] as unknown[]
    items.splice(Math.min(removed.index, items.length), 0, removed.item)
    lastRemoved.value = null
  }

  function dismissUndo() {
    lastRemoved.value = null
  }

  /** Moves an entry one position up (-1) or down (1) within its list */
  function moveEntry(list: EntryListKey, id: string, offset: -1 | 1) {
    const items = (cv.value[list] ?? []) as { id: string }[]
    const from = items.findIndex(i => i.id === id)
    const to = from + offset
    if (from < 0 || to < 0 || to >= items.length) return
    const [item] = items.splice(from, 1)
    items.splice(to, 0, item!)
  }

  /** Rewrites "Present" end dates and standard language levels in the CV language */
  function syncLocalizedWords() {
    const lang = cv.value.meta.language
    const word = PRESENT_WORD[lang]
    for (const entry of cv.value.experience) {
      if (PRESENT_PATTERN.test(entry.endDate.trim()) && entry.endDate !== word) entry.endDate = word
    }
    for (const entry of cv.value.languages) {
      for (const levels of Object.values(LANGUAGE_LEVELS)) {
        const position = levels.indexOf(entry.level)
        if (position >= 0) entry.level = LANGUAGE_LEVELS[lang][position]!
      }
    }
  }
  syncLocalizedWords()

  // Auto-save on every change
  watch(cv, saveToStorage, { deep: true })

  // ── Meta ──────────────────────────────────────────────────────────────────
  function setTemplate(variant: TemplateVariant) {
    cv.value.meta.template = variant
  }

  function setLanguage(lang: AppLanguage) {
    cv.value.meta.language = lang
    syncLocalizedWords()
  }

  function setTypography(partial: Partial<CVTypography>) {
    cv.value.meta.typography = {
      ...DEFAULT_TYPOGRAPHY,
      ...cv.value.meta.typography,
      ...partial,
    }
  }

  // ── Experience ────────────────────────────────────────────────────────────
  function addExperience() {
    cv.value.experience.push(createExperienceEntry())
  }

  function removeExperience(id: string) {
    removeEntry('experience', id)
  }

  function addBullet(experienceId: string) {
    const entry = cv.value.experience.find((e) => e.id === experienceId)
    if (entry) entry.bullets.push('')
  }

  function removeBullet(experienceId: string, index: number) {
    const entry = cv.value.experience.find((e) => e.id === experienceId)
    if (entry) entry.bullets.splice(index, 1)
  }

  // ── Education ─────────────────────────────────────────────────────────────
  function addEducation() {
    cv.value.education.push(createEducationEntry())
  }

  function removeEducation(id: string) {
    removeEntry('education', id)
  }

  // ── Achievements ──────────────────────────────────────────────────────────
  function addAchievement() {
    cv.value.achievements.push(createAchievement())
  }

  function removeAchievement(id: string) {
    removeEntry('achievements', id)
  }

  // ── Certifications ────────────────────────────────────────────────────────
  function addCertification() {
    if (!cv.value.certifications) cv.value.certifications = []
    cv.value.certifications.push(createCertification())
  }

  function removeCertification(id: string) {
    removeEntry('certifications', id)
  }

  // ── Languages ─────────────────────────────────────────────────────────────
  function addLanguage() {
    cv.value.languages.push(createLanguageEntry())
  }

  function removeLanguage(id: string) {
    removeEntry('languages', id)
  }

  // ── Publications ──────────────────────────────────────────────────────────
  function addPublication() {
    cv.value.publications.push(createPublication())
  }

  function removePublication(id: string) {
    removeEntry('publications', id)
  }

  function loadSampleData() {
    lastRemoved.value = null
    cv.value = {
      meta: {
        id: 'sample-cv',
        language: cv.value.meta.language,
        template: cv.value.meta.template,
        lastModified: new Date().toISOString(),
        typography: { ...DEFAULT_TYPOGRAPHY, ...(cv.value.meta.typography ?? {}) },
      },
      personal: {
        fullName: 'CARLOS ALBERTO MENDOZA',
        title: 'Director de Operaciones & Estrategia Empresarial',
        email: 'carlos.mendoza@email.com',
        phone: '+57 310 456 7890',
        location: 'Bogotá, Colombia',
        linkedin: 'linkedin.com/in/carlos-mendoza-ops',
        website: 'carlosmendoza.dev',
        photo: '',
      },
      summary: 'Líder ejecutivo con más de 10 años de experiencia transformando modelos operativos, liderando equipos multidisciplinarios y optimizando costes en empresas de tecnología y consultoría estratégica en América Latina. Especializado en gestión de cambio, escalabilidad de productos y excelencia operativa respaldada por datos.',
      education: [
        {
          id: 'edu-1',
          institution: 'Universidad de los Andes',
          degree: 'Maestría en Administración de Empresas (MBA)',
          field: 'Estrategia y Finanzas',
          graduationDate: '2019',
          location: 'Bogotá, Colombia',
          honors: 'Graduado con Honores Summa Cum Laude',
          thesis: 'Optimización de Cadenas de Suministro Digitales en Mercados Emergentes',
        },
        {
          id: 'edu-2',
          institution: 'Pontificia Universidad Javeriana',
          degree: 'Pregrado en Ingeniería Industrial',
          field: 'Ingeniería y Operaciones',
          graduationDate: '2015',
          location: 'Bogotá, Colombia',
          honors: 'Beca de Excelencia Académica',
          thesis: '',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Kushki Pagos LatAm',
          role: 'Head of Global Operations',
          startDate: '2021',
          endDate: 'Presente',
          location: 'Bogotá / Remoto',
          bullets: [
            'Lideré la reestructuración del departamento de operaciones en 5 países, reduciendo el costo unitario de procesamiento en un 28%.',
            'Diseñé e implementé el nuevo marco operativo para integraciones B2B empresariales, reduciendo el tiempo de incorporación de 45 a 14 días.',
            'Gestioné un equipo directo de 35 ingenieros y analistas de operaciones, logrando una tasa de retención de talento del 94%.',
          ],
        },
        {
          id: 'exp-2',
          company: 'McKinsey & Company',
          role: 'Consultor Senior de Estrategia',
          startDate: '2017',
          endDate: '2021',
          location: 'Bogotá, Colombia',
          bullets: [
            'Asesoré a juntas directivas de entidades financieras líderes en fusiones, adquisiciones y transformación digital a gran escala.',
            'Identifiqué sinergias operativas estimadas en $18M USD para un conglomerado bancario de la región andina.',
            'Coordiné diagnósticos operativos y planes de choque de eficiencia para 8 corporaciones multinacionales.',
          ],
        },
      ],
      skills: [
        'Estrategia Corporativa',
        'Gestión de Operaciones',
        'Transformación Digital',
        'Finanzas Corporativas',
        'Metodologías Ágiles (Scrum/Kanban)',
        'Liderazgo de Equipos',
        'Negociación B2B',
        'Modelado Financiero',
      ],
      achievements: [
        {
          id: 'ach-1',
          organization: 'Cámara Colombiana de Comercio Electrónico',
          title: 'Líder Transformador del Año en Operaciones FinTech',
          description: 'Reconocimiento otorgado por la estandarización de procesos de pagos transfronterizos.',
          year: '2023',
        },
      ],
      programs: [
        'Python',
        'SQL Avanzado',
        'Power BI',
        'Tableau',
        'SAP S/4HANA',
        'Jira Enterprise',
        'Salesforce CRM',
      ],
      languages: [
        { id: 'lang-1', name: 'Español', level: 'Nativo' },
        { id: 'lang-2', name: 'Inglés', level: 'Profesional Avanzado (C1 - TOEFL 112)' },
        { id: 'lang-3', name: 'Portugués', level: 'Intermedio (B2)' },
      ],
      publications: [
        {
          id: 'pub-1',
          authors: 'Mendoza, C. & Restrepo, F.',
          year: '2022',
          title: 'Eficiencia Operacional y Resiliencia en Ecosistemas FinTech',
          journal: 'Revista Latinoamericana de Administración y Estrategia',
          doi: '10.1016/j.laae.2022.04.011',
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'Professional Scrum Master I (PSM I)',
          issuer: 'Scrum.org',
          date: '2022',
          expiration: '',
          credentialId: 'PSM-I-982741',
          url: 'https://www.scrum.org/certificates',
        },
        {
          id: 'cert-2',
          name: 'Google Data Analytics Professional Certificate',
          issuer: 'Google / Coursera',
          date: '2021',
          expiration: '',
          credentialId: 'GDAT-2021-88421',
          url: 'https://coursera.org/verify/professional-cert/GDAT2021',
        },
      ],
    }
    saveToStorage()
  }

  return {
    cv,
    hasContent,
    saveFailed,
    lastRemoved,
    undoRemove,
    dismissUndo,
    moveEntry,
    resetCV,
    loadSampleData,
    setTemplate,
    setLanguage,
    setTypography,
    addExperience,
    removeExperience,
    addBullet,
    removeBullet,
    addEducation,
    removeEducation,
    addAchievement,
    removeAchievement,
    addCertification,
    removeCertification,
    addLanguage,
    removeLanguage,
    addPublication,
    removePublication,
  }
})
