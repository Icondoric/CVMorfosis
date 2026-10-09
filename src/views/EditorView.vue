<template>
  <div class="min-h-screen w-full flex flex-col bg-[#F5F5F7] text-[var(--apple-text-primary)]">
    <!-- ── 1. Barra de Navegación Superior (Header) ────────────────────────── -->
    <!-- Ocupa todo el ancho superior, con un fondo gris muy oscuro (casi negro), altura compacta -->
    <header class="w-full bg-[#161617] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <!-- Lado Izquierdo: Botón minimalista de retroceso con flecha y texto 'CV' en blanco -->
      <button
        @click="goHome"
        class="apple-btn flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        :aria-label="t('header.back')"
        :title="t('header.back')"
      >
        <AppIcon name="arrowLeft" size="sm" class="text-white" />
        <span class="text-sm font-semibold tracking-tight text-white">CV</span>
      </button>

      <!-- Centro: Título del documento 'CV sin título' como h1 semántico + nube con check -->
      <div class="flex items-center gap-2">
        <h1 class="text-xs sm:text-sm font-medium text-white tracking-tight m-0">
          {{ documentTitle }}
        </h1>
        <AppIcon
          name="cloudCheck"
          size="xs"
          class="text-emerald-400 flex-shrink-0"
          :title="t('header.autosaved')"
          :aria-label="t('header.autosaved')"
        />
      </div>

      <!-- Lado Derecho: Selector de idioma, botón 3 puntos, botón 'Descargar' azul -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Selector de idioma (ej. 'ES' con flecha desplegable) -->
        <div class="relative">
          <button
            @click="showLangMenu = !showLangMenu"
            class="apple-btn flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
            :aria-label="t('header.language')"
            :aria-expanded="showLangMenu"
            aria-haspopup="true"
          >
            <span>{{ currentLang.toUpperCase() }}</span>
            <AppIcon name="chevronDown" size="xs" class="text-gray-300" />
          </button>

          <div
            v-if="showLangMenu"
            class="absolute right-0 mt-1.5 w-28 bg-[#1D1D1F] border border-white/10 rounded-xl shadow-xl py-1 z-30 text-xs text-white"
            role="menu"
            :aria-label="t('header.language')"
          >
            <button
              @click="switchLanguage('es'); showLangMenu = false;"
              class="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between"
              role="menuitem"
            >
              <span>Español</span>
              <span v-if="currentLang === 'es'" class="text-[#0071E3] font-bold">✓</span>
            </button>
            <button
              @click="switchLanguage('en'); showLangMenu = false;"
              class="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between"
              role="menuitem"
            >
              <span>English</span>
              <span v-if="currentLang === 'en'" class="text-[#0071E3] font-bold">✓</span>
            </button>
          </div>
        </div>

        <!-- Exportación ATS: una sola columna, la más segura para filtros automáticos -->
        <DownloadMenu
          :label="t('header.exportAts')"
          :title="t('header.exportAtsTitle')"
          :busy="isBusy && pendingExport.mode === 'ats'"
          @select="format => requestExport('ats', format)"
        >
          <template #icon><AppIcon name="ats" size="xs" class="text-[#34C759]" /></template>
        </DownloadMenu>

        <!-- Descarga del diseño que se ve en la vista previa -->
        <DownloadMenu
          primary
          :label="t('header.download')"
          :busy="isBusy && pendingExport.mode === 'visual'"
          :word-available="hasDocxVersion(store.cv.meta.template)"
          @select="format => requestExport('visual', format)"
        >
          <template #icon><AppIcon name="download" size="xs" /></template>
        </DownloadMenu>
      </div>
    </header>

    <!-- ── 2. Layout Principal (Split-Screen Layout) ───────────────────────── -->
    <!-- Dos paneles principales de ancho similar con fino divisor vertical -->
    <div class="w-full flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      <!-- Mobile Switcher (Visible only on < lg screens) -->
      <div class="lg:hidden p-2.5 bg-white border-b border-[#E5E5EA] flex justify-center">
        <div class="apple-segmented-track p-0.5">
          <button
            @click="mobileTab = 'editor'"
            class="apple-segmented-item apple-btn px-4 py-1 text-xs font-semibold"
            :class="{ active: mobileTab === 'editor' }"
          >
            {{ t('header.tabEditor') }}
          </button>
          <button
            @click="mobileTab = 'preview'"
            class="apple-segmented-item apple-btn px-4 py-1 text-xs font-semibold"
            :class="{ active: mobileTab === 'preview' }"
          >
            {{ t('header.tabPreview') }}
          </button>
        </div>
      </div>

      <!-- ── 3. Panel Izquierdo (Editor de Contenido) ──────────────────────── -->
      <!-- Fondo blanco, padding generoso, scrollable -->
      <aside
        class="w-full lg:w-1/2 overflow-y-auto bg-white border-r border-[#E5E5EA] flex-shrink-0"
        :class="{ 'hidden lg:block': mobileTab !== 'editor' }"
      >
        <EditorPanel @download="requestExport('visual', 'pdf')" />
      </aside>

      <!-- ── 4. Panel Derecho (Vista Previa en Vivo) ───────────────────────── -->
      <!-- Fondo gris muy claro, en el centro contenedor A4 con sombra suave -->
      <section
        class="flex-1 w-full lg:w-1/2 overflow-y-auto bg-[#F5F5F7] p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start relative"
        :class="{ 'hidden lg:flex': mobileTab !== 'preview' }"
      >
        <PreviewPanel ref="previewRef" />
      </section>
    </div>

    <!-- ── Modales Apple (Diseño consistente con desenfoque de fondo) ───── -->
    <!-- Advertencia de CV en progreso -->
    <AppleModal
      :is-open="showWarning"
      :title="t('header.inProgress.title')"
      :subtitle="t('header.inProgress.subtitle')"
      :description="t('header.inProgress.body')"
      icon="warning"
      variant="warning"
      :confirm-text="t('header.inProgress.confirm')"
      :cancel-text="t('header.inProgress.cancel')"
      @confirm="confirmExport"
      @cancel="cancelExport"
      @close="cancelExport"
    />

    <!-- Error en la exportación a PDF -->
    <AppleModal
      :is-open="!!failure"
      :title="t('header.exportError.title')"
      :subtitle="t('header.exportError.subtitle')"
      :description="failure || ''"
      icon="warning"
      variant="danger"
      :confirm-text="t('header.exportError.ok')"
      :show-cancel="false"
      @confirm="clearFailure"
      @close="clearFailure"
    />

    <!-- ── ATS Toast ──────────────────────────────────────────────────────── -->
    <Transition name="toast">
      <div
        v-if="showAtsToast"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#161617] text-white text-xs font-medium px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10"
      >
        <AppIcon name="check" size="sm" class="text-emerald-400 flex-shrink-0" />
        <span>{{ t('header.atsToast') }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { usePDFExport } from '@/composables/usePDFExport'
import { useDocxExport } from '@/composables/useDocxExport'
import { hasDocxVersion } from '@/docx/designs'
import DownloadMenu, { type ExportFormat } from '@/components/ui/DownloadMenu.vue'
import EditorPanel from '@/components/editor/EditorPanel.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppleModal from '@/components/ui/AppleModal.vue'

const router = useRouter()
const { locale, t } = useI18n()
const store = useCVStore()
// A saved CV keeps its language across reloads
locale.value = store.cv.meta.language
const { exportPDF: doExport, isExporting, exportError } = usePDFExport()
const { exportDocx, isExportingDocx, docxError } = useDocxExport()

const previewRef = ref<InstanceType<typeof PreviewPanel> | null>(null)
const showWarning = ref(false)
const showAtsToast = ref(false)
const showLangMenu = ref(false)
const mobileTab = ref<'editor' | 'preview'>('editor')

type ExportMode = 'visual' | 'ats'
/** What the user asked to download; kept while the "CV incomplete" warning is open */
const pendingExport = ref<{ mode: ExportMode; format: ExportFormat }>({ mode: 'visual', format: 'pdf' })

const isBusy = computed(() => isExporting.value || isExportingDocx.value)
const failure = computed(() => exportError.value || docxError.value)

function clearFailure() {
  exportError.value = null
  docxError.value = null
}

const currentLang = computed(() => store.cv.meta.language)
const isComplete = computed(() => previewRef.value?.isComplete ?? true)

const documentTitle = computed(() => {
  const name = store.cv.personal.fullName
  return name ? t('header.documentTitle', { name }) : t('header.untitled')
})

function goHome() {
  router.push('/')
}

function switchLanguage(lang: 'es' | 'en') {
  store.setLanguage(lang)
  locale.value = lang
}

// ── Export ────────────────────────────────────────────────────────────────────
function requestExport(mode: ExportMode, format: ExportFormat) {
  pendingExport.value = { mode, format }
  if (!isComplete.value) showWarning.value = true
  else runExport()
}

function cancelExport() {
  showWarning.value = false
}

function confirmExport() {
  showWarning.value = false
  runExport()
}

async function runExport() {
  const { mode, format } = pendingExport.value
  if (format === 'pdf') return mode === 'ats' ? runAtsExport() : runVisualExport()

  const template = store.cv.meta.template
  const name = store.cv.personal.fullName || 'cv-profesional'
  if (mode === 'ats') await exportDocx('ats', `${name}_ATS`)
  else if (hasDocxVersion(template)) await exportDocx(template, `${name}_visual`)
}

async function runVisualExport() {
  const el = previewRef.value?.getEl()
  if (el) {
    const name = store.cv.personal.fullName || 'cv-profesional'
    await doExport(el, `${name}_visual`)
  }
}

async function runAtsExport() {
  const el = previewRef.value?.getAtsEl()
  if (el) {
    const name = store.cv.personal.fullName || 'cv-profesional'
    await doExport(el, `${name}_ATS`)
    showAtsToast.value = true
    setTimeout(() => { showAtsToast.value = false }, 4000)
  }
}
</script>

<style>
/* Modal transition */
.modal-enter-active, .modal-leave-active {
  transition: all 0.2s ease-out;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* Toast transition */
.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease-out;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
