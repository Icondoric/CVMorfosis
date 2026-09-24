<template>
  <div class="min-h-screen w-full flex flex-col bg-[#F5F5F7] text-[var(--apple-text-primary)]">
    <!-- ── 1. Barra de Navegación Superior (Header) ────────────────────────── -->
    <!-- Ocupa todo el ancho superior, con un fondo gris muy oscuro (casi negro), altura compacta -->
    <header class="w-full bg-[#161617] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <!-- Lado Izquierdo: Botón minimalista de retroceso con flecha y texto 'CV' en blanco -->
      <button
        @click="goHome"
        class="apple-btn flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        aria-label="Volver a la página principal de CVMorfosis"
        title="Volver al inicio"
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
          title="Guardado automático en tu navegador"
          aria-label="Guardado automático activo"
        />
      </div>

      <!-- Lado Derecho: Selector de idioma, botón 3 puntos, botón 'Descargar' azul -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Selector de idioma (ej. 'ES' con flecha desplegable) -->
        <div class="relative">
          <button
            @click="showLangMenu = !showLangMenu"
            class="apple-btn flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
            aria-label="Selector de idioma"
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
            aria-label="Idiomas disponibles"
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

        <!-- Botón redondo gris oscuro con tres puntos verticales (menú de opciones) -->
        <div class="relative">
          <button
            @click="showOptionsMenu = !showOptionsMenu"
            class="apple-btn w-8 h-8 rounded-full bg-[#2C2C2E] hover:bg-[#3A3A3C] text-gray-200 flex items-center justify-center transition-colors"
            aria-label="Opciones avanzadas del currículum"
            :aria-expanded="showOptionsMenu"
            aria-haspopup="true"
            title="Opciones avanzadas"
          >
            <AppIcon name="dotsVertical" size="xs" />
          </button>

          <div
            v-if="showOptionsMenu"
            class="absolute right-0 mt-1.5 w-52 bg-[#1D1D1F] border border-white/10 rounded-xl shadow-xl py-1.5 z-30 text-xs text-white"
          >
            <button
              @click="handleAtsExport(); showOptionsMenu = false;"
              class="w-full text-left px-3.5 py-2 hover:bg-white/10 flex items-center gap-2"
            >
              <AppIcon name="ats" size="xs" class="text-[#34C759]" />
              <span>Exportar versión ATS</span>
            </button>
            <button
              @click="store.loadSampleData(); showOptionsMenu = false;"
              class="w-full text-left px-3.5 py-2 hover:bg-white/10 flex items-center gap-2"
            >
              <AppIcon name="skills" size="xs" class="text-amber-400" />
              <span>Cargar perfil de ejemplo</span>
            </button>
            <hr class="border-white/10 my-1" />
            <button
              @click="confirmReset(); showOptionsMenu = false;"
              class="w-full text-left px-3.5 py-2 hover:bg-red-950/40 text-red-400 flex items-center gap-2"
            >
              <span>Restablecer todo el CV</span>
            </button>
          </div>
        </div>

        <!-- Botón principal rectangular bordes redondeados, azul vibrante, texto blanco 'Descargar' + icono -->
        <button
          @click="handleExport"
          :disabled="isExporting"
          class="apple-btn flex items-center gap-2 px-4 py-1.5 rounded-xl font-semibold text-xs sm:text-[13px] text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-[0_2px_8px_rgba(0,113,227,0.35)] disabled:opacity-50 transition-all"
        >
          <AppIcon :name="isExporting ? 'warning' : 'download'" size="xs" :class="{ 'animate-pulse': isExporting }" />
          <span>{{ isExporting ? 'Generando...' : 'Descargar' }}</span>
        </button>
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
            Editor de Contenido
          </button>
          <button
            @click="mobileTab = 'preview'"
            class="apple-segmented-item apple-btn px-4 py-1 text-xs font-semibold"
            :class="{ active: mobileTab === 'preview' }"
          >
            Vista Previa en Vivo
          </button>
        </div>
      </div>

      <!-- ── 3. Panel Izquierdo (Editor de Contenido) ──────────────────────── -->
      <!-- Fondo blanco, padding generoso, scrollable -->
      <aside
        class="w-full lg:w-1/2 overflow-y-auto bg-white border-r border-[#E5E5EA] flex-shrink-0"
        :class="{ 'hidden lg:block': mobileTab !== 'editor' }"
      >
        <EditorPanel />
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
    <!-- 1. Advertencia de CV en progreso -->
    <AppleModal
      :is-open="showWarning"
      title="CV en progreso"
      subtitle="Faltan algunos datos en el formulario"
      description="Puedes exportar tu PDF ahora mismo o regresar al editor para añadir más detalles a tu currículum."
      icon="warning"
      variant="warning"
      confirm-text="Descargar de todos modos"
      cancel-text="Seguir editando"
      @confirm="confirmExport"
      @cancel="cancelExport"
      @close="cancelExport"
    />

    <!-- 2. Confirmación de Restablecimiento -->
    <AppleModal
      :is-open="showResetModal"
      title="Restablecer currículum"
      subtitle="Esta acción no se puede deshacer"
      description="¿Estás seguro de que deseas restablecer todo el currículum? Se borrarán todos los datos ingresados para comenzar desde cero."
      icon="trash"
      variant="danger"
      confirm-text="Sí, restablecer todo"
      cancel-text="Cancelar"
      :is-destructive="true"
      @confirm="executeReset"
      @cancel="showResetModal = false"
      @close="showResetModal = false"
    />

    <!-- 3. Error en la exportación a PDF -->
    <AppleModal
      :is-open="!!exportError"
      title="Error al exportar PDF"
      subtitle="Servicio de PDF no disponible"
      :description="exportError || ''"
      icon="warning"
      variant="danger"
      confirm-text="Entendido"
      :show-cancel="false"
      @confirm="exportError = null"
      @close="exportError = null"
    />

    <!-- ── ATS Toast ──────────────────────────────────────────────────────── -->
    <Transition name="toast">
      <div
        v-if="showAtsToast"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#161617] text-white text-xs font-medium px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10"
      >
        <AppIcon name="check" size="sm" class="text-emerald-400 flex-shrink-0" />
        <span>PDF ATS generado y optimizado para reclutadores.</span>
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
import EditorPanel from '@/components/editor/EditorPanel.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppleModal from '@/components/ui/AppleModal.vue'

const router = useRouter()
const { locale } = useI18n()
const store = useCVStore()
const { exportPDF: doExport, isExporting, exportError } = usePDFExport()

const previewRef = ref<InstanceType<typeof PreviewPanel> | null>(null)
const showWarning = ref(false)
const showResetModal = ref(false)
const showAtsToast = ref(false)
const showLangMenu = ref(false)
const showOptionsMenu = ref(false)
const mobileTab = ref<'editor' | 'preview'>('editor')
const pendingExportMode = ref<'visual' | 'ats'>('visual')

const currentLang = computed(() => store.cv.meta.language)
const isComplete = computed(() => previewRef.value?.isComplete ?? true)

const documentTitle = computed(() => {
  return store.cv.personal.fullName ? `CV - ${store.cv.personal.fullName}` : 'CV sin título'
})

function goHome() {
  router.push('/')
}

function switchLanguage(lang: 'es' | 'en') {
  store.setLanguage(lang)
  locale.value = lang
}

function confirmReset() {
  showResetModal.value = true
}

function executeReset() {
  store.resetCV()
  showResetModal.value = false
}

// ── Visual PDF export ─────────────────────────────────────────────────────────
function handleExport() {
  pendingExportMode.value = 'visual'
  if (!isComplete.value) {
    showWarning.value = true
  } else {
    runVisualExport()
  }
}

// ── ATS PDF export ────────────────────────────────────────────────────────────
function handleAtsExport() {
  pendingExportMode.value = 'ats'
  if (!isComplete.value) {
    showWarning.value = true
  } else {
    runAtsExport()
  }
}

function cancelExport() {
  showWarning.value = false
}

function confirmExport() {
  showWarning.value = false
  if (pendingExportMode.value === 'ats') {
    runAtsExport()
  } else {
    runVisualExport()
  }
}

async function runVisualExport() {
  const el = previewRef.value?.getEl()
  if (el) {
    const name = store.cv.personal.fullName || store.cv.personal.firstName || 'cv-profesional'
    await doExport(el, `${name}_visual`)
  }
}

async function runAtsExport() {
  const el = previewRef.value?.getAtsEl()
  if (el) {
    const name = store.cv.personal.fullName || store.cv.personal.firstName || 'cv-profesional'
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
