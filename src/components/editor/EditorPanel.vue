<template>
  <div ref="panelRef" class="bg-white p-4 sm:p-6 lg:p-7 space-y-5 max-w-3xl mx-auto flex flex-col">
    <!-- ── Barra Superior: Acciones Rápidas ──────────────────────────────── -->
    <div class="flex items-center justify-between pb-1">
      <span class="text-xs sm:text-[13px] font-semibold text-gray-500">
        {{ t('editor.stepByStep') }}
      </span>
      <div class="flex items-center gap-2">
        <button
          @click="requestSample"
          type="button"
          class="apple-btn text-xs font-semibold text-[#0071E3] hover:underline px-2.5 py-1 rounded-lg bg-[#0071E3]/10"
          :title="t('editor.loadSampleTitle')"
        >
          {{ t('editor.loadSample') }}
        </button>
        <button
          @click="showResetModal = true"
          type="button"
          class="apple-btn text-xs font-medium text-gray-500 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-black/5"
          :title="t('editor.clearTitle')"
        >
          {{ t('editor.clear') }}
        </button>
      </div>
    </div>

    <p
      v-if="store.saveFailed"
      role="alert"
      class="text-xs font-medium text-[var(--apple-red)] bg-red-50 border border-red-200 rounded-xl px-3 py-2 m-0"
    >
      {{ t('editor.saveFailed') }}
    </p>

    <!-- ── Selector de pasos ─────────────────────────────────────────────── -->
    <div class="space-y-2 w-full">
      <div class="flex flex-wrap items-center justify-between gap-1 px-0.5">
        <span class="text-xs sm:text-[13px] font-bold text-[#0071E3]">
          {{ t(`sections.${currentStep.key}`) }}
        </span>
        <span class="text-[11px] text-[var(--apple-text-secondary)] font-medium">
          {{ t('editor.stepOf', { current: activeStep + 1, total: steps.length }) }}
        </span>
      </div>

      <!-- Cuadrícula responsiva de 3 columnas que nunca se desborda -->
      <div class="grid grid-cols-3 gap-1 sm:gap-1.5 p-1 bg-black/[0.04] rounded-2xl border border-black/[0.05] w-full">
        <button
          v-for="(step, idx) in steps"
          :key="step.key"
          @click="activeStep = idx"
          type="button"
          class="apple-btn flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-2 rounded-xl text-[11px] sm:text-xs transition-all w-full select-none"
          :class="activeStep === idx
            ? 'bg-white text-[#0071E3] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0.5px_1px_rgba(0,0,0,0.04)]'
            : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-white/40'"
          :title="`${t(`sections.${step.key}`)} · ${t(`editor.status.${stepStatus[idx]}`)}`"
          :aria-current="activeStep === idx ? 'step' : undefined"
        >
          <span
            class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            :class="badgeClass(idx)"
          >
            <template v-if="stepStatus[idx] === 'complete'">✓</template>
            <template v-else>{{ idx + 1 }}</template>
          </span>
          <span class="truncate">{{ t(`editor.short.${step.key}`) }}</span>
        </button>
      </div>
    </div>

    <!-- ── Sección activa ────────────────────────────────────────────────── -->
    <div class="w-full py-1">
      <Transition name="fade-step" mode="out-in">
        <component :is="currentStep.component" :key="currentStep.key" />
      </Transition>
    </div>

    <!-- ── Navegación inferior ───────────────────────────────────────────── -->
    <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2 sm:gap-4 w-full">
      <button
        @click="goToStep(activeStep - 1)"
        :disabled="activeStep === 0"
        type="button"
        class="apple-btn flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition-colors flex-shrink-0"
      >
        <AppIcon name="arrowLeft" size="xs" />
        <span>{{ t('editor.previous') }}</span>
      </button>

      <button
        v-if="activeStep < steps.length - 1"
        @click="goToStep(activeStep + 1)"
        type="button"
        class="apple-btn flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-sm transition-all flex-shrink-0"
      >
        <span>{{ t('editor.next') }}</span>
        <AppIcon name="arrowRight" size="xs" />
      </button>

      <!-- Último paso: el CV está listo para descargar -->
      <button
        v-else
        @click="emit('download')"
        type="button"
        class="apple-btn flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-white bg-[#34C759] hover:bg-[#2fb350] shadow-sm transition-all flex-shrink-0"
      >
        <AppIcon name="download" size="xs" />
        <span>{{ t('editor.download') }}</span>
      </button>
    </div>

    <!-- ── Confirmación de limpieza ──────────────────────────────────────── -->
    <AppleModal
      :is-open="showResetModal"
      :title="t('editor.reset.title')"
      :subtitle="t('editor.reset.subtitle')"
      :description="t('editor.reset.body')"
      icon="trash"
      variant="danger"
      :confirm-text="t('editor.reset.confirm')"
      :cancel-text="t('editor.cancel')"
      :is-destructive="true"
      @confirm="executeReset"
      @cancel="showResetModal = false"
      @close="showResetModal = false"
    />

    <!-- ── Confirmación antes de reemplazar el CV por el ejemplo ─────────── -->
    <AppleModal
      :is-open="showSampleModal"
      :title="t('editor.sample.title')"
      :subtitle="t('editor.sample.subtitle')"
      :description="t('editor.sample.body')"
      icon="warning"
      variant="warning"
      :confirm-text="t('editor.sample.confirm')"
      :cancel-text="t('editor.cancel')"
      :is-destructive="true"
      @confirm="loadSample"
      @cancel="showSampleModal = false"
      @close="showSampleModal = false"
    />

    <!-- ── Deshacer la última eliminación ─────────────────────────────────── -->
    <Transition name="fade-step">
      <div
        v-if="store.lastRemoved"
        role="status"
        class="fixed bottom-6 left-6 z-[60] bg-[#161617] text-white text-xs font-medium pl-4 pr-2 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-white/10"
      >
        <span>{{ t('actions.removed') }}</span>
        <button
          type="button"
          class="apple-btn px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 font-semibold"
          @click="store.undoRemove"
        >{{ t('actions.undo') }}</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppleModal from '@/components/ui/AppleModal.vue'
import SectionPersonal from './SectionPersonal.vue'
import SectionSummary from './SectionSummary.vue'
import SectionExperience from './SectionExperience.vue'
import SectionEducation from './SectionEducation.vue'
import SectionSkills from './SectionSkills.vue'
import SectionLanguages from './SectionLanguages.vue'
import SectionAchievements from './SectionAchievements.vue'
import SectionCertifications from './SectionCertifications.vue'
import SectionPrograms from './SectionPrograms.vue'
import SectionPublications from './SectionPublications.vue'

const emit = defineEmits<{ download: [] }>()

const { t } = useI18n()
const store = useCVStore()
const panelRef = ref<HTMLElement | null>(null)

// ── Steps ─────────────────────────────────────────────────────────────────────
// `key` doubles as the i18n key of the section title, so the step, the form
// heading and the CV itself always use the same name.
type StepStatus = 'complete' | 'missing' | 'empty'

interface Step {
  key: string
  component: Component
  /** Required sections are flagged while incomplete; optional ones stay neutral */
  required: boolean
  isComplete: () => boolean
}

const filled = (values: string[]) => values.some(v => v.trim())

const steps: Step[] = [
  { key: 'personal',       component: SectionPersonal,       required: true,
    isComplete: () => Boolean(store.cv.personal.fullName.trim() && store.cv.personal.email.trim()) },
  { key: 'summary',        component: SectionSummary,        required: true,
    isComplete: () => Boolean(store.cv.summary.trim()) },
  { key: 'experience',     component: SectionExperience,     required: true,
    isComplete: () => store.cv.experience.some(e => e.company.trim() && e.role.trim()) },
  { key: 'education',      component: SectionEducation,      required: true,
    isComplete: () => store.cv.education.some(e => e.institution.trim() && e.degree.trim()) },
  { key: 'skills',         component: SectionSkills,         required: false,
    isComplete: () => filled(store.cv.skills) },
  { key: 'programs',       component: SectionPrograms,       required: false,
    isComplete: () => filled(store.cv.programs) },
  { key: 'languages',      component: SectionLanguages,      required: false,
    isComplete: () => store.cv.languages.some(l => l.name.trim()) },
  { key: 'achievements',   component: SectionAchievements,   required: false,
    isComplete: () => store.cv.achievements.some(a => a.title.trim()) },
  { key: 'certifications', component: SectionCertifications, required: false,
    isComplete: () => (store.cv.certifications ?? []).some(c => c.name.trim()) },
  { key: 'publications',   component: SectionPublications,   required: false,
    isComplete: () => store.cv.publications.some(p => p.title.trim()) },
]

const activeStep = ref(0)
const currentStep = computed(() => steps[activeStep.value]!)

const stepStatus = computed<StepStatus[]>(() =>
  steps.map(step => (step.isComplete() ? 'complete' : step.required ? 'missing' : 'empty')),
)

function badgeClass(idx: number) {
  const status = stepStatus.value[idx]
  if (status === 'complete') return 'bg-[#34C759] text-white'
  if (status === 'missing') return 'bg-amber-400 text-white'
  return activeStep.value === idx ? 'bg-[#0071E3] text-white' : 'bg-black/10 text-gray-500'
}

function goToStep(idx: number) {
  if (idx < 0 || idx >= steps.length) return
  activeStep.value = idx
  const scrollParent = panelRef.value?.closest('.overflow-y-auto') ?? panelRef.value?.parentElement
  scrollParent?.scrollTo({ top: 0, behavior: 'smooth' })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Reset ─────────────────────────────────────────────────────────────────────
const showResetModal = ref(false)

function executeReset() {
  store.resetCV()
  activeStep.value = 0
  showResetModal.value = false
}

// ── Sample ────────────────────────────────────────────────────────────────────
// The sample replaces the whole CV: ask first when there is something to lose
const showSampleModal = ref(false)

function requestSample() {
  if (store.hasContent) showSampleModal.value = true
  else loadSample()
}

function loadSample() {
  store.loadSampleData()
  showSampleModal.value = false
}

// ── Undo ──────────────────────────────────────────────────────────────────────
// The undo offer for a removed entry expires on its own
const UNDO_WINDOW_MS = 8000
let undoTimer: ReturnType<typeof setTimeout> | undefined
watch(() => store.lastRemoved, removed => {
  clearTimeout(undoTimer)
  if (removed) undoTimer = setTimeout(store.dismissUndo, UNDO_WINDOW_MS)
})
</script>

<style scoped>
/* Transición suave entre pasos */
.fade-step-enter-active,
.fade-step-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-step-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-step-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
