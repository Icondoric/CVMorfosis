import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import {
  type CVData,
  type TemplateVariant,
  type AppLanguage,
  createEmptyCV,
  createExperienceEntry,
  createEducationEntry,
  createAchievement,
  createPublication,
  createLanguageEntry,
} from '@/types/cv.types'

const STORAGE_KEY = 'cvjob_data'

export const useCVStore = defineStore('cv', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const cv = ref<CVData>(loadFromStorage())

  // ── Persistence ───────────────────────────────────────────────────────────
  function loadFromStorage(): CVData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CVData
        // Merge with fresh defaults so newly added fields (e.g. photo) are always present
        const empty = createEmptyCV()
        return {
          ...empty,
          ...parsed,
          personal: { ...empty.personal, ...parsed.personal },
          meta:     { ...empty.meta,     ...parsed.meta },
        }
      }
    } catch {
      // ignore
    }
    return createEmptyCV()
  }

  function saveToStorage() {
    cv.value.meta.lastModified = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cv.value))
  }

  function resetCV() {
    cv.value = createEmptyCV()
    saveToStorage()
  }

  // Auto-save on every change
  watch(cv, saveToStorage, { deep: true })

  // ── Meta ──────────────────────────────────────────────────────────────────
  function setTemplate(variant: TemplateVariant) {
    cv.value.meta.template = variant
  }

  function setLanguage(lang: AppLanguage) {
    cv.value.meta.language = lang
  }

  // ── Experience ────────────────────────────────────────────────────────────
  function addExperience() {
    cv.value.experience.push(createExperienceEntry())
  }

  function removeExperience(id: string) {
    cv.value.experience = cv.value.experience.filter((e) => e.id !== id)
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
    cv.value.education = cv.value.education.filter((e) => e.id !== id)
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  function addSkill() {
    cv.value.skills.push('')
  }

  function removeSkill(index: number) {
    cv.value.skills.splice(index, 1)
  }

  // ── Achievements ──────────────────────────────────────────────────────────
  function addAchievement() {
    cv.value.achievements.push(createAchievement())
  }

  function removeAchievement(id: string) {
    cv.value.achievements = cv.value.achievements.filter((a) => a.id !== id)
  }

  // ── Programs ──────────────────────────────────────────────────────────────
  function addProgram() {
    cv.value.programs.push('')
  }

  function removeProgram(index: number) {
    cv.value.programs.splice(index, 1)
  }

  // ── Languages ─────────────────────────────────────────────────────────────
  function addLanguage() {
    cv.value.languages.push(createLanguageEntry())
  }

  function removeLanguage(id: string) {
    cv.value.languages = cv.value.languages.filter((l) => l.id !== id)
  }

  // ── Publications ──────────────────────────────────────────────────────────
  function addPublication() {
    cv.value.publications.push(createPublication())
  }

  function removePublication(id: string) {
    cv.value.publications = cv.value.publications.filter((p) => p.id !== id)
  }

  function loadSampleData() {
    cv.value = {
      meta: {
        id: 'sample-cv',
        language: cv.value.meta.language,
        template: cv.value.meta.template,
        lastModified: new Date().toISOString(),
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
    }
    saveToStorage()
  }

  return {
    cv,
    resetCV,
    loadSampleData,
    setTemplate,
    setLanguage,
    addExperience,
    removeExperience,
    addBullet,
    removeBullet,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addAchievement,
    removeAchievement,
    addProgram,
    removeProgram,
    addLanguage,
    removeLanguage,
    addPublication,
    removePublication,
  }
})
