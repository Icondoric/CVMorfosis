<template>
  <div class="w-full max-w-[860px] space-y-4">

    <!-- Template switcher -->
    <div class="flex items-center justify-center gap-2 flex-wrap">
      <button
        v-for="tmpl in templates"
        :key="tmpl.key"
        @click="store.setTemplate(tmpl.key as TemplateVariant)"
        class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
        :class="cv.meta.template === tmpl.key
          ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
      >
        {{ tmpl.icon }} {{ t(`templates.${tmpl.key}`) }}
      </button>
    </div>

    <!-- CV completeness warning banner -->
    <div
      v-if="!isComplete"
      class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
    >
      <span class="text-amber-500 text-lg flex-shrink-0">⚠️</span>
      <div>
        <p class="text-sm font-semibold text-amber-700">CV incompleto</p>
        <p class="text-xs text-amber-600 mt-0.5">
          Faltan campos requeridos:
          <span class="font-medium">{{ missingFields.join(', ') }}</span>.
          Puedes exportarlo igualmente, pero puede quedar con espacios vacíos.
        </p>
      </div>
    </div>

    <!--
      ── WYSIWYG Preview wrapper ───────────────────────────────────────────────
      Scales the 816px CV to fit the panel width exactly (Letter format).
      Uses transform:scale so the CV renders at its true size internally
      (exact same as what Puppeteer sees), then visually shrinks to fit.
      NO overflow-hidden, NO rounded-lg — the CV itself defines its boundaries.
    -->
    <div ref="scaleWrapperEl" class="w-full relative" :style="wrapperStyle">
      <!-- White drop shadow to simulate paper -->
      <div
        ref="cvEl"
        :style="cvScaleStyle"
        style="transform-origin: top left; box-shadow: 0 4px 32px rgba(0,0,0,0.18);"
      >
        <HarvardClassic  v-if="cv.meta.template === 'classic'" />
        <HarvardModern   v-else-if="cv.meta.template === 'modern'" />
        <HarvardCompact  v-else-if="cv.meta.template === 'compact'" />
        <HarvardElegant  v-else-if="cv.meta.template === 'elegant'" />
        <HarvardElegant2 v-else-if="cv.meta.template === 'elegant2'" />
      </div>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import type { TemplateVariant } from '@/types/cv.types'
import HarvardClassic  from './templates/HarvardClassic.vue'
import HarvardModern   from './templates/HarvardModern.vue'
import HarvardCompact  from './templates/HarvardCompact.vue'
import HarvardElegant  from './templates/HarvardElegant.vue'
import HarvardElegant2 from './templates/HarvardElegant2.vue'
import HarvardATS      from './templates/HarvardATS.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)

// ── Refs ─────────────────────────────────────────────────────────────────────
const cvEl           = ref<HTMLElement>()
const atsEl          = ref<HTMLElement>()
const scaleWrapperEl = ref<HTMLElement>()

// ── WYSIWYG scale ─────────────────────────────────────────────────────────────
// CV is always 816px wide internally (Letter standard: 8.5" x 11" @ 96dpi = 816 x 1056 px)
const CV_WIDTH  = 816
const CV_HEIGHT = 1056   // Letter at 96dpi

const scale = ref(1)

function updateScale() {
  if (!scaleWrapperEl.value) return
  const panelWidth = scaleWrapperEl.value.clientWidth
  scale.value = Math.min(1, panelWidth / CV_WIDTH)
}

// Wrapper height = scaled CV height so it doesn't overlap content below
const wrapperStyle = computed(() => ({
  height: `${CV_HEIGHT * scale.value}px`,
}))

// CV transform: scale to panel width, origin top-left
const cvScaleStyle = computed(() => ({
  width: `${CV_WIDTH}px`,
  transform: `scale(${scale.value})`,
}))

// Update scale on mount and on resize
let ro: ResizeObserver | null = null
onMounted(() => {
  updateScale()
  if (scaleWrapperEl.value) {
    ro = new ResizeObserver(updateScale)
    ro.observe(scaleWrapperEl.value)
  }
})
onUnmounted(() => ro?.disconnect())

// ── Templates list ────────────────────────────────────────────────────────────
const templates = [
  { key: 'classic',  icon: '📜' },
  { key: 'modern',   icon: '✨' },
  { key: 'compact',  icon: '📦' },
  { key: 'elegant',  icon: '🎨' },
  { key: 'elegant2', icon: '🖋️' },
] as const

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
