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

  return {
    cv,
    resetCV,
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
