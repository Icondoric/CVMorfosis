<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- ── Navbar ─────────────────────────────────────────────────────────── -->
    <header class="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <span class="text-xl">🎓</span>
        <span class="font-semibold text-gray-800 text-lg">{{ t('nav.appName') }}</span>
      </div>

      <div class="flex items-center gap-3">
        <!-- Language toggle -->
        <div class="flex items-center rounded-lg border border-gray-200 overflow-hidden">
          <button
            v-for="lang in (['es', 'en'] as const)"
            :key="lang"
            @click="switchLanguage(lang)"
            class="px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
            :class="currentLang === lang
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'"
          >
            {{ lang.toUpperCase() }}
          </button>
        </div>

        <!-- ATS export button -->
        <button
          @click="handleAtsExport"
          :disabled="isExporting"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-green-600 text-green-700 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-60 cursor-pointer"
          title="Exporta una versión simplificada y optimizada para filtros ATS de empresas"
        >
          <span>🤖</span>
          {{ isExporting ? 'Generando...' : 'Exportar ATS' }}
        </button>

        <!-- Visual PDF export button -->
        <button
          @click="handleExport"
          :disabled="isExporting"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
          :class="isExporting ? 'bg-gray-300 text-gray-600' : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)]'"
          title="Exporta el PDF con el diseño visual completo"
        >
          <span>{{ isExporting ? '⏳' : '📥' }}</span>
          {{ isExporting ? t('export.preparing') : t('nav.export') }}
        </button>
      </div>
    </header>

    <!-- ── Main layout: Editor | Preview ──────────────────────────────────── -->
    <main class="flex flex-1 overflow-hidden">
      <aside class="w-[480px] min-w-[380px] bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <EditorPanel />
      </aside>
      <section class="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-4">
        <PreviewPanel ref="previewRef" />
      </section>
    </main>

    <!-- ── Export warning modal ───────────────────────────────────────────── -->
    <Transition name="modal">
      <div
        v-if="showWarning"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="cancelExport"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-2xl">⚠️</div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">CV incompleto</h3>
              <p class="text-sm text-gray-500 mt-0.5">Algunos campos obligatorios aún no están completos.</p>
            </div>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p class="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">Campos faltantes:</p>
            <ul class="space-y-1">
              <li v-for="field in missingFields" :key="field" class="flex items-center gap-2 text-sm text-amber-800">
                <span class="text-amber-400">•</span>{{ field }}
              </li>
            </ul>
          </div>
          <p class="text-sm text-gray-600">
            Puedes exportar el PDF ahora y los campos vacíos quedarán en blanco, o regresar al editor para completarlo.
          </p>
          <div class="flex gap-3 pt-1">
            <button @click="cancelExport" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              ✏️ Completar CV
            </button>
            <button @click="confirmExport" class="flex-1 py-2.5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-light)] transition-colors cursor-pointer">
              📥 Exportar de todas formas
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── ATS info toast ─────────────────────────────────────────────────── -->
    <Transition name="toast">
      <div
        v-if="showAtsToast"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-green-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
      >
        <span class="text-lg">🤖</span>
        <div>
          <p class="font-semibold">PDF ATS generado</p>
          <p class="text-xs text-green-200 mt-0.5">Single-column, sin foto ni barras visuales. Optimizado para filtros automáticos.</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { usePDFExport } from '@/composables/usePDFExport'
import EditorPanel from '@/components/editor/EditorPanel.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'

const { t, locale } = useI18n()
const store = useCVStore()
const { exportPDF: doExport, isExporting } = usePDFExport()

const previewRef  = ref<InstanceType<typeof PreviewPanel> | null>(null)
const showWarning = ref(false)
const showAtsToast = ref(false)
// Track which mode triggered the warning (visual or ATS)
const pendingExportMode = ref<'visual' | 'ats'>('visual')

const currentLang   = computed(() => store.cv.meta.language)
const missingFields = computed(() => previewRef.value?.missingFields ?? [])
const isComplete    = computed(() => previewRef.value?.isComplete ?? true)

function switchLanguage(lang: 'es' | 'en') {
  store.setLanguage(lang)
  locale.value = lang
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
    const name = store.cv.personal.fullName || 'cv-harvard'
    await doExport(el, `${name}_visual`)
  }
}

async function runAtsExport() {
  const el = previewRef.value?.getAtsEl()
  if (el) {
    const name = store.cv.personal.fullName || 'cv-harvard'
    await doExport(el, `${name}_ATS`)
    // Show success toast
    showAtsToast.value = true
    setTimeout(() => { showAtsToast.value = false }, 4000)
  }
}
</script>

<style>
/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative { transition: transform 0.2s ease; }
.modal-enter-from .relative { transform: scale(0.95) translateY(8px); }

/* Toast transition */
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(20px); }
.toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
</style>
