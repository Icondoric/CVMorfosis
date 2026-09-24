<template>
  <div ref="panelRef" class="bg-white p-4 sm:p-6 lg:p-7 space-y-5 max-w-3xl mx-auto flex flex-col">
    <!-- ── Barra Superior: Acciones Rápidas ──────────────────────────────── -->
    <div class="flex items-center justify-between pb-1">
      <span class="text-xs sm:text-[13px] font-semibold text-gray-500">
        Completa tu CV paso a paso
      </span>
      <div class="flex items-center gap-2">
        <button
          @click="store.loadSampleData"
          type="button"
          class="apple-btn text-xs font-semibold text-[#0071E3] hover:underline px-2.5 py-1 rounded-lg bg-[#0071E3]/10"
          title="Carga un perfil ejecutivo completo de ejemplo"
        >
          Cargar ejemplo
        </button>
        <button
          @click="confirmReset"
          type="button"
          class="apple-btn text-xs font-medium text-gray-500 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-black/5"
          title="Limpiar datos del CV"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- ── Selector de Ventanas / Pasos (100% Responsivo en Cuadrícula Apple) ── -->
    <div class="space-y-2 w-full">
      <!-- Encabezado con estado del paso actual -->
      <div class="flex flex-wrap items-center justify-between gap-1 px-0.5">
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-[#0071E3] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            {{ activeStep + 1 }}
          </span>
          <span class="text-xs sm:text-[13px] font-bold text-gray-900">
            Ventana {{ activeStep + 1 }}:
            <span class="text-[#0071E3]">{{ windowSteps[activeStep]?.label }}</span>
          </span>
        </div>

        <span class="text-[11px] text-[var(--apple-text-secondary)] font-medium">
          Paso {{ activeStep + 1 }} de {{ windowSteps.length }}
        </span>
      </div>

      <!-- Cuadrícula responsiva de 3 columnas que nunca se desborda -->
      <div class="grid grid-cols-3 gap-1 sm:gap-1.5 p-1 bg-black/[0.04] rounded-2xl border border-black/[0.05] w-full">
        <button
          v-for="(step, idx) in windowSteps"
          :key="step.key"
          @click="activeStep = idx"
          type="button"
          class="apple-btn flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-2 rounded-xl text-[11px] sm:text-xs transition-all w-full select-none"
          :class="activeStep === idx
            ? 'bg-white text-[#0071E3] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0.5px_1px_rgba(0,0,0,0.04)]'
            : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-white/40'"
          :title="step.label"
        >
          <span
            class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            :class="activeStep === idx ? 'bg-[#0071E3] text-white' : 'bg-black/10 text-gray-500'"
          >
            {{ idx + 1 }}
          </span>
          <span class="truncate">{{ step.shortLabel }}</span>
        </button>
      </div>

      <p class="text-[11px] text-[var(--apple-text-tertiary)] px-0.5 m-0 leading-tight">
        Haz clic en cualquier sección o avanza con los botones inferiores.
      </p>
    </div>

    <!-- ── Contenedor de la Ventana Activa (Enfoque individual por sección) ─ -->
    <div class="w-full py-1">
      <Transition name="fade-step" mode="out-in">
        <div :key="activeStep">
          <!-- 1. Datos personales (Unificado: Nombre completo, sin botones de carga ni pills) -->
          <SectionPersonal v-if="activeStep === 0" />

          <!-- 2. Perfil profesional -->
          <SectionSummary v-else-if="activeStep === 1" />

          <!-- 3. Experiencia profesional -->
          <SectionExperience v-else-if="activeStep === 2" />

          <!-- 4. Formación académica -->
          <SectionEducation v-else-if="activeStep === 3" />

          <!-- 5. Habilidades -->
          <SectionSkills v-else-if="activeStep === 4" />

          <!-- 6. Idiomas -->
          <SectionLanguages v-else-if="activeStep === 5" />

          <!-- 7. Logros destacados -->
          <SectionAchievements v-else-if="activeStep === 6" />

          <!-- 8. Programas / Software -->
          <SectionPrograms v-else-if="activeStep === 7" />

          <!-- 9. Publicaciones -->
          <SectionPublications v-else-if="activeStep === 8" />
        </div>
      </Transition>
    </div>

    <!-- ── Controles de Navegación Inferior (Paso Anterior / Siguiente) ───── -->
    <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2 sm:gap-4 w-full">
      <button
        @click="prevStep"
        :disabled="activeStep === 0"
        type="button"
        class="apple-btn flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition-colors flex-shrink-0"
        aria-label="Ir a la ventana anterior"
      >
        <AppIcon name="arrowLeft" size="xs" />
        <span>Anterior</span>
      </button>

      <div class="flex items-center justify-center text-center px-1">
        <span class="text-xs sm:text-[13px] font-semibold text-gray-700">
          Paso {{ activeStep + 1 }} de {{ windowSteps.length }}
        </span>
      </div>

      <button
        v-if="activeStep < windowSteps.length - 1"
        @click="nextStep"
        type="button"
        class="apple-btn flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-sm transition-all flex-shrink-0"
        aria-label="Ir a la siguiente ventana"
      >
        <span>Siguiente</span>
        <AppIcon name="arrowRight" size="xs" />
      </button>

      <button
        v-else
        @click="activeStep = 0"
        type="button"
        class="apple-btn flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-white bg-[#34C759] hover:bg-[#2fb350] shadow-sm transition-all flex-shrink-0"
        aria-label="Volver a revisar desde el inicio"
      >
        <span>Inicio</span>
        <AppIcon name="check" size="xs" />
      </button>
    </div>

    <!-- ── Modal Apple de Confirmación de Limpieza ──────────────────────── -->
    <AppleModal
      :is-open="showResetModal"
      title="Restablecer currículum"
      subtitle="Esta acción no se puede deshacer"
      description="¿Estás seguro de que deseas limpiar todos los campos del currículum? Se borrarán todos los datos ingresados para que comiences desde cero."
      icon="trash"
      variant="danger"
      confirm-text="Sí, limpiar todo"
      cancel-text="Cancelar"
      :is-destructive="true"
      @confirm="executeReset"
      @cancel="showResetModal = false"
      @close="showResetModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
import SectionPrograms from './SectionPrograms.vue'
import SectionPublications from './SectionPublications.vue'

const store = useCVStore()
const panelRef = ref<HTMLElement | null>(null)
const showResetModal = ref(false)

// ── Ventanas secuenciales ordenadas ──────────────────────────────────────────
const windowSteps = [
  { key: 'personal',     label: 'Datos Personales',      shortLabel: 'Personal' },
  { key: 'summary',      label: 'Perfil Profesional',    shortLabel: 'Perfil' },
  { key: 'experience',   label: 'Experiencia Laboral',   shortLabel: 'Experiencia' },
  { key: 'education',    label: 'Formación Académica',   shortLabel: 'Formación' },
  { key: 'skills',       label: 'Habilidades',           shortLabel: 'Habilidades' },
  { key: 'languages',    label: 'Idiomas',               shortLabel: 'Idiomas' },
  { key: 'achievements', label: 'Logros Destacados',     shortLabel: 'Logros' },
  { key: 'programs',     label: 'Programas y Software',  shortLabel: 'Software' },
  { key: 'publications', label: 'Publicaciones',         shortLabel: 'Publicaciones' },
] as const

const activeStep = ref(0)

function scrollToTop() {
  if (panelRef.value) {
    const scrollParent = panelRef.value.closest('.overflow-y-auto') || panelRef.value.parentElement
    if (scrollParent) {
      scrollParent.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function prevStep() {
  if (activeStep.value > 0) {
    activeStep.value--
    scrollToTop()
  }
}

function nextStep() {
  if (activeStep.value < windowSteps.length - 1) {
    activeStep.value++
    scrollToTop()
  }
}

function confirmReset() {
  showResetModal.value = true
}

function executeReset() {
  store.resetCV()
  activeStep.value = 0
  showResetModal.value = false
}
</script>

<style scoped>
/* Transición suave entre ventanas */
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

/* Ocultar barra de scroll horizontal antiestética en WebKit */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
