<template>
  <div class="w-full max-w-[860px] space-y-4">

    <!-- Template switcher (Apple Segmented Capsule) -->
    <div class="flex items-center justify-center">
      <div class="apple-segmented-track shadow-sm p-1 max-w-full flex-wrap gap-0.5 justify-center">
        <button
          v-for="tmpl in templates"
          :key="tmpl.key"
          @click="store.setTemplate(tmpl.key as TemplateVariant)"
          class="apple-segmented-item apple-btn px-3 py-1.5 text-xs sm:text-[13px] flex items-center gap-1.5"
          :class="{ active: cv.meta.template === tmpl.key }"
        >
          <AppIcon :name="tmpl.iconName" size="xs" />
          <span>{{ t(`templates.${tmpl.key}`) }}</span>
        </button>
      </div>
    </div>

    <!-- CV completeness warning banner (Apple Callout) -->
    <div
      v-if="!isComplete"
      class="flex items-start gap-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl px-4 py-3"
    >
      <AppIcon name="warning" size="sm" class="text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p class="text-xs font-semibold text-amber-800">CV incompleto</p>
        <p class="text-[11px] text-amber-700/90 mt-0.5 leading-relaxed">
          Faltan campos requeridos:
          <span class="font-semibold">{{ missingFields.join(', ') }}</span>.
          Puedes exportarlo igualmente, pero puede quedar con espacios vacíos.
        </p>
      </div>
    </div>

    <!--
      ── WYSIWYG Preview wrapper ───────────────────────────────────────────────
      Scales the 816px CV to fit the panel width exactly (Letter format).
      Uses transform:scale so the CV renders at its true size internally
      (exact same as what Puppeteer sees), then visually shrinks to fit.
    -->
    <div ref="scaleWrapperEl" class="w-full relative flex justify-center" :style="wrapperStyle">
      <!-- Apple multi-layered paper drop shadow -->
      <div
        ref="cvEl"
        :style="cvScaleStyle"
        style="transform-origin: top center; box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.1);"
      >
        <HarvardWave     v-if="cv.meta.template === 'wave'" />
        <HarvardClassic  v-else-if="cv.meta.template === 'classic'" />
        <HarvardModern   v-else-if="cv.meta.template === 'modern'" />
        <HarvardCompact  v-else-if="cv.meta.template === 'compact'" />
        <HarvardElegant  v-else-if="cv.meta.template === 'elegant'" />
        <HarvardElegant2 v-else-if="cv.meta.template === 'elegant2'" />
        <HarvardWave     v-else />
      </div>
    </div>

    <!-- ── Floating Bottom Toolbar (Barra de Herramientas Flotante) ────────── -->
    <div
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl px-3.5 py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] flex items-center gap-1 sm:gap-2"
    >
      <!-- Formato / Página -->
      <button
        @click="cycleTemplate"
        class="apple-btn p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        title="Alternar plantilla"
      >
        <AppIcon name="fileText" size="sm" />
      </button>

      <!-- Tipografía -->
      <button
        class="apple-btn p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors font-bold text-xs"
        title="Tipografía"
      >
        Aa
      </button>

      <!-- Interlineado -->
      <button
        class="apple-btn p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        title="Interlineado"
      >
        <AppIcon name="lineSpacing" size="sm" />
      </button>

      <!-- Diseño de plantilla -->
      <button
        @click="cycleTemplate"
        class="apple-btn p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        title="Diseño de plantilla"
      >
        <AppIcon name="classic" size="sm" />
      </button>

      <!-- Selector de color -->
      <button
        class="apple-btn p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        title="Selector de color"
      >
        <AppIcon name="palette" size="sm" />
      </button>

      <div class="h-4 w-px bg-gray-200 my-auto mx-1"></div>

      <!-- Pantalla completa -->
      <button
        @click="toggleFullscreen"
        class="apple-btn p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        title="Pantalla completa"
      >
        <AppIcon name="maximize" size="sm" />
      </button>
    </div>

    <!-- ATS template: rendered off-screen, used only for export -->
    <div
      ref="atsEl"
      aria-hidden="true"
      style="
        position: fixed;
        top: -99999px;
        left: 0;
        width: 816px;
        pointer-events: none;
        opacity: 0;
        z-index: -9999;
      "
    >
      <HarvardATS />
    </div>

    <p class="text-center text-xs text-gray-400">
      Guardado automáticamente · Última modificación: {{ lastModified }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import type { TemplateVariant } from '@/types/cv.types'
import HarvardWave     from './templates/HarvardWave.vue'
import HarvardClassic  from './templates/HarvardClassic.vue'
import HarvardModern   from './templates/HarvardModern.vue'
import HarvardCompact  from './templates/HarvardCompact.vue'
import HarvardElegant  from './templates/HarvardElegant.vue'
import HarvardElegant2 from './templates/HarvardElegant2.vue'
import HarvardATS      from './templates/HarvardATS.vue'
import AppIcon         from '@/components/ui/AppIcon.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)

// ── Refs ─────────────────────────────────────────────────────────────────────
const cvEl           = ref<HTMLElement>()
const atsEl          = ref<HTMLElement>()
const scaleWrapperEl = ref<HTMLElement>()

// ── WYSIWYG scale & dimensions ───────────────────────────────────────────────
// CV is always 816px wide internally (Letter standard: 8.5" x 11" @ 96dpi = 816 x 1056 px)
const CV_WIDTH  = 816
const CV_HEIGHT = 1056   // Letter at 96dpi

const scale = ref(1)
const actualCvHeight = ref(CV_HEIGHT)

function updateDimensions() {
  requestAnimationFrame(() => {
    if (scaleWrapperEl.value) {
      const panelWidth = scaleWrapperEl.value.clientWidth
      if (panelWidth > 0) {
        scale.value = Math.min(1, panelWidth / CV_WIDTH)
      }
    }
    if (cvEl.value) {
      const inner = cvEl.value.firstElementChild as HTMLElement | null
      if (inner && inner.offsetHeight > 0) {
        actualCvHeight.value = Math.max(CV_HEIGHT, inner.offsetHeight)
      }
    }
  })
}

// Wrapper height = scaled CV height so it fits seamlessly and never cuts off content
const wrapperStyle = computed(() => ({
  height: `${actualCvHeight.value * scale.value}px`,
}))

// CV transform: scale to panel width, origin top-left
const cvScaleStyle = computed(() => ({
  width: `${CV_WIDTH}px`,
  transform: `scale(${scale.value})`,
}))

// Update dimensions on mount, resize, and CV content changes
let ro: ResizeObserver | null = null
onMounted(() => {
  nextTick(() => {
    updateDimensions()
    if (scaleWrapperEl.value) {
      ro = new ResizeObserver(() => updateDimensions())
      ro.observe(scaleWrapperEl.value)
    }
    if (cvEl.value) {
      ro?.observe(cvEl.value)
    }
  })
})

onUnmounted(() => ro?.disconnect())

// ── Templates list ────────────────────────────────────────────────────────────
const templates = [
  { key: 'wave',     iconName: 'modern' },
  { key: 'classic',  iconName: 'classic' },
  { key: 'modern',   iconName: 'modern' },
  { key: 'compact',  iconName: 'compact' },
  { key: 'elegant',  iconName: 'elegant' },
  { key: 'elegant2', iconName: 'elegant2' },
] as const

function cycleTemplate() {
  const keys: TemplateVariant[] = ['wave', 'classic', 'modern', 'compact', 'elegant', 'elegant2']
  const currentIndex = keys.indexOf(cv.value.meta.template)
  const nextIndex = (currentIndex + 1) % keys.length
  store.setTemplate(keys[nextIndex]!)
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
  } else {
    document.exitFullscreen().catch(() => {})
  }
}

const lastModified = computed(() =>
  new Date(cv.value.meta.lastModified).toLocaleString()
)

// ── Completeness check ────────────────────────────────────────────────────────
const missingFields = computed(() => {
  const missing: string[] = []
  const p = cv.value.personal
  if (!p.fullName.trim())          missing.push('Nombre completo')
  if (!p.email.trim())             missing.push('Email')
  if (!cv.value.summary.trim())    missing.push('Perfil profesional')
  if (!cv.value.education.length)  missing.push('Educación')
  if (!cv.value.experience.length) missing.push('Experiencia')
  return missing
})

const isComplete = computed(() => missingFields.value.length === 0)

// ── Expose to App.vue ─────────────────────────────────────────────────────────
defineExpose({
  // For visual PDF: the inner CV div (not the scale wrapper)
  getEl:    () => cvEl.value?.firstElementChild as HTMLElement | undefined,
  // For ATS PDF: the hidden ATS template
  getAtsEl: () => atsEl.value?.firstElementChild as HTMLElement | undefined,
  isComplete,
  missingFields,
})
</script>
