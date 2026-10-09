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
          <span
            v-if="tmpl.ats"
            class="px-1 rounded text-[9px] font-bold leading-[14px] tracking-wide bg-emerald-500/15 text-emerald-700"
            :title="t('templates.atsFriendly')"
          >ATS</span>
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
        <p class="text-xs font-semibold text-amber-800">{{ t('preview.incompleteTitle') }}</p>
        <p class="text-[11px] text-amber-700/90 mt-0.5 leading-relaxed">
          {{ t('preview.missingFields') }}
          <span class="font-semibold">{{ missingFields.join(', ') }}</span>.
          {{ t('preview.incompleteHint') }}
        </p>
      </div>
    </div>

    <!-- Multi-page indicator banner -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-2 py-1.5 px-4 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-sm mx-auto text-xs text-gray-700 w-fit"
    >
      <AppIcon name="fileText" size="xs" class="text-[#0071E3]" />
      <span class="font-semibold text-gray-900">{{ t('preview.sheets', { count: totalPages }) }}</span>
      <span class="text-gray-300">·</span>
      <span class="text-gray-500">{{ t(`typography.pageSizes.${pageConfig.key}`) }} ({{ pageWidth }} × {{ pageHeight }} px)</span>
      <span class="text-gray-300">·</span>
      <span class="text-emerald-600 font-medium text-[11px] flex items-center gap-1">
        <span>✓ {{ t('preview.printSplitActive') }}</span>
      </span>
    </div>

    <!--
      ── WYSIWYG Preview wrapper ───────────────────────────────────────────────
      Scales the CV (page width from pageConfig) to fit the panel width exactly.
      Uses transform:scale so the CV renders at its true size internally
      (exact same as what Puppeteer sees), then visually shrinks to fit.
    -->
    <div ref="scaleWrapperEl" class="w-full relative flex justify-center" :style="wrapperStyle">
      <!-- Apple multi-layered paper drop shadow -->
      <div
        ref="cvEl"
        :style="cvScaleStyle"
        class="relative bg-white"
        style="transform-origin: top center; box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.1);"
      >
        <HarvardWave     v-if="cv.meta.template === 'wave'" />
        <HarvardClassic  v-else-if="cv.meta.template === 'classic'" />
        <HarvardModern   v-else-if="cv.meta.template === 'modern'" />
        <HarvardCompact  v-else-if="cv.meta.template === 'compact'" />
        <HarvardElegant  v-else-if="cv.meta.template === 'elegant'" />
        <HarvardElegant2 v-else-if="cv.meta.template === 'elegant2'" />
        <HarvardElegant2 v-else-if="cv.meta.template === 'elegant3'" stacked />
        <HarvardWave     v-else />

        <!-- ── Badges de identificación de hoja (Esquina superior derecha de cada hoja) ── -->
        <template v-if="totalPages > 1">
          <div
            v-for="pageIndex in totalPages"
            :key="'badge-' + pageIndex"
            class="absolute right-4 pointer-events-none select-none z-30"
            :style="{ top: `${(pageIndex - 1) * pageHeight + 14}px` }"
          >
            <div
              class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight bg-[#161617]/75 text-white backdrop-blur-md shadow-sm border border-white/20 flex items-center gap-1"
            >
              <span>{{ t('preview.sheetOf', { current: pageIndex, total: totalPages }) }}</span>
            </div>
          </div>

          <!-- ── Separadores visuales de salto de hoja ────────────────────────── -->
          <div
            v-for="pageIndex in (totalPages - 1)"
            :key="'break-' + pageIndex"
            class="absolute left-0 w-full pointer-events-none select-none z-30"
            :style="{ top: `${pageIndex * pageHeight}px` }"
          >
            <div class="relative w-full -translate-y-1/2 flex items-center justify-center">
              <!-- Banda divisoria simulando separación física entre hojas -->
              <div
                class="w-full h-8 flex items-center justify-center relative"
                style="
                  background: linear-gradient(to bottom, rgba(230,230,235,0.92) 0%, rgba(245,245,247,0.98) 50%, rgba(230,230,235,0.92) 100%);
                  border-top: 1.5px solid rgba(0,0,0,0.12);
                  border-bottom: 1.5px solid rgba(0,0,0,0.12);
                  box-shadow: inset 0 3px 6px rgba(0,0,0,0.06), inset 0 -3px 6px rgba(0,0,0,0.06);
                "
              >
                <!-- Línea punteada de corte central -->
                <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-400/80"></div>

                <!-- Badge estilo Apple centrado -->
                <div
                  class="relative z-10 px-3 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm border border-gray-300/80 bg-white text-gray-700"
                >
                  <span class="text-xs">✂</span>
                  <span>{{ t('preview.pageBreak', { current: pageIndex, next: pageIndex + 1 }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- ── Floating Bottom Toolbar (Barra de Herramientas Flotante) ────────── -->
    <div
      ref="toolbarEl"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[45] bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl px-3.5 py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] flex items-center gap-1 sm:gap-2"
    >
      <!-- Tipografía -->
      <button
        @click="toggleTypographyPopover"
        class="apple-btn p-2 rounded-xl transition-colors font-bold text-xs"
        :class="showTypographyPopover
          ? 'bg-[#0071E3]/10 text-[#0071E3]'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
        :title="t('toolbar.typography')"
        aria-haspopup="dialog"
        :aria-expanded="showTypographyPopover"
      >
        Aa
      </button>

      <div class="h-4 w-px bg-gray-200 my-auto mx-1"></div>

      <!-- Pantalla completa -->
      <button
        @click="toggleFullscreen"
        class="apple-btn p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        :title="t('toolbar.fullscreen')"
      >
        <AppIcon name="maximize" size="sm" />
      </button>
    </div>

    <TypographyPopover
      v-if="showTypographyPopover"
      :anchor-bottom="toolbarAnchorBottom"
      @close="showTypographyPopover = false"
    />

    <!-- ATS template: rendered off-screen, used only for export -->
    <div
      ref="atsEl"
      aria-hidden="true"
      :style="{ width: `${pageWidth}px` }"
      style="
        position: fixed;
        top: -99999px;
        left: 0;
        pointer-events: none;
        opacity: 0;
        z-index: -9999;
      "
    >
      <HarvardATS />
    </div>

    <p class="text-center text-xs text-gray-400">
      {{ t('preview.autosaved', { date: lastModified }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useEventListener } from '@vueuse/core'
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
import TypographyPopover from '@/components/ui/TypographyPopover.vue'
import { useTypographyStyles } from '@/composables/useTypographyStyles'
import { usePagination } from '@/composables/usePagination'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
const { pageConfig } = useTypographyStyles()

// ── Refs ─────────────────────────────────────────────────────────────────────
const cvEl           = ref<HTMLElement>()
const atsEl          = ref<HTMLElement>()
const scaleWrapperEl = ref<HTMLElement>()
const toolbarEl      = ref<HTMLElement>()

// ── WYSIWYG scale & dimensions ───────────────────────────────────────────────
const pageWidth  = computed(() => pageConfig.value.widthPx)
const pageHeight = computed(() => pageConfig.value.heightPx)

const scale = ref(1)

// The inner CV roots: what gets paginated and what is sent to the PDF server
const getCvRoot  = () => cvEl.value?.querySelector<HTMLElement>('.cv-preview')
const getAtsRoot = () => atsEl.value?.querySelector<HTMLElement>('.cv-preview')

// Same sheet splitting the PDF gets (see usePagination)
const { totalPages } = usePagination(getCvRoot, pageHeight, [cv])
usePagination(getAtsRoot, pageHeight, [cv])

const totalCanvasHeight = computed(() => totalPages.value * pageHeight.value)

function updateDimensions() {
  requestAnimationFrame(() => {
    if (scaleWrapperEl.value) {
      const panelWidth = scaleWrapperEl.value.clientWidth
      if (panelWidth > 0) {
        scale.value = Math.min(1, panelWidth / pageWidth.value)
      }
    }
  })
}

// Wrapper height = scaled total sheets height
const wrapperStyle = computed(() => ({
  height: `${totalCanvasHeight.value * scale.value}px`,
}))

// CV transform: scale to panel width, origin top-left
const cvScaleStyle = computed(() => ({
  width: `${pageWidth.value}px`,
  minHeight: `${totalCanvasHeight.value}px`,
  transform: `scale(${scale.value})`,
}))

// Update the scale on mount and when the panel is resized
let ro: ResizeObserver | null = null
onMounted(() => {
  nextTick(() => {
    updateDimensions()
    if (scaleWrapperEl.value) {
      ro = new ResizeObserver(() => updateDimensions())
      ro.observe(scaleWrapperEl.value)
    }
  })
})

onUnmounted(() => ro?.disconnect())

// Re-fit the sheet once the DOM reflects a new page size (Letter / A4 / Legal)
watch(pageConfig, updateDimensions, { flush: 'post' })

// ── Typography popover ────────────────────────────────────────────────────────
const showTypographyPopover = ref(false)
const toolbarAnchorBottom   = ref(0)

/** Distance from the bottom of the viewport to the top edge of the toolbar */
function updateToolbarAnchor() {
  if (!toolbarEl.value) return
  toolbarAnchorBottom.value = window.innerHeight - toolbarEl.value.getBoundingClientRect().top
}

function toggleTypographyPopover() {
  updateToolbarAnchor()
  showTypographyPopover.value = !showTypographyPopover.value
}

useEventListener(window, 'resize', () => {
  if (showTypographyPopover.value) updateToolbarAnchor()
})
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') showTypographyPopover.value = false
})

// ── Templates list ────────────────────────────────────────────────────────────
// Single-column layouts first: they are the ones résumé parsers (ATS) read most reliably
const templates = [
  { key: 'classic',  iconName: 'classic',  ats: true },
  { key: 'modern',   iconName: 'modern',   ats: true },
  { key: 'elegant3', iconName: 'elegant3', ats: true },
  { key: 'elegant2', iconName: 'elegant2', ats: false },
  { key: 'compact',  iconName: 'compact',  ats: false },
  { key: 'elegant',  iconName: 'elegant',  ats: false },
  { key: 'wave',     iconName: 'modern',   ats: false },
] as const

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
  if (!p.fullName.trim())          missing.push(t('fields.fullName'))
  if (!p.email.trim())             missing.push(t('fields.email'))
  if (!cv.value.summary.trim())    missing.push(t('sections.summary'))
  if (!cv.value.education.length)  missing.push(t('sections.education'))
  if (!cv.value.experience.length) missing.push(t('sections.experience'))
  return missing
})

const isComplete = computed(() => missingFields.value.length === 0)

// ── Expose to App.vue ─────────────────────────────────────────────────────────
defineExpose({
  // For visual PDF: the inner CV div (not the scale wrapper or break overlays)
  getEl:    getCvRoot,
  // For ATS PDF: the hidden ATS template
  getAtsEl: getAtsRoot,
  isComplete,
  missingFields,
})
</script>
