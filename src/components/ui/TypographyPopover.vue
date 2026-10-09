<template>
  <Teleport to="body">
    <!-- Backdrop invisible para cerrar al hacer clic fuera -->
    <div
      class="fixed inset-0 z-40"
      @click="$emit('close')"
    />

    <!-- Popover panel -->
    <div
      :style="anchorStyle"
      class="fixed z-50 w-80 max-w-[calc(100vw-1.5rem)] overflow-y-auto bg-white/98 backdrop-blur-2xl border border-gray-200/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.08)]"
      role="dialog"
      :aria-label="t('typography.title')"
      @click.stop
    >
      <!-- ── Header ──────────────────────────────────────────────────────── -->
      <div class="px-4 pt-4 pb-2 border-b border-gray-100 flex items-center justify-between">
        <p class="text-[13px] font-semibold text-gray-800 tracking-tight">{{ t('typography.title') }}</p>
        <button
          @click="$emit('close')"
          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          :aria-label="t('typography.close')"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="p-4 space-y-5">

        <!-- ── 1. Fuente ───────────────────────────────────────────────── -->
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{{ t('typography.font') }}</p>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="font in FONT_FAMILIES"
              :key="font.key"
              @click="store.setTypography({ fontFamily: font.key })"
              class="px-3 py-2 rounded-xl text-[11px] text-left transition-all border leading-tight"
              :class="
                typography.fontFamily === font.key
                  ? 'bg-[#0071E3] text-white border-[#0071E3] font-semibold shadow-[0_2px_8px_rgba(0,113,227,0.3)]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              "
              :style="{ fontFamily: font.stack }"
            >
              <span class="block text-[13px] leading-none mb-0.5" :style="{ fontFamily: font.stack }">Aa</span>
              {{ font.label }}
            </button>
          </div>
        </div>

        <!-- Divisor -->
        <div class="h-px bg-gray-100" />

        <!-- ── 2. Tamaño de letra ──────────────────────────────────────── -->
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{{ t('typography.fontSize') }}</p>
          <div class="flex items-center gap-3">
            <button
              @click="decreaseSize"
              :disabled="typography.fontSize <= MIN_SIZE"
              class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center font-bold text-gray-700 text-lg transition-colors select-none"
              :aria-label="t('typography.decreaseSize')"
            >−</button>

            <div class="flex-1 text-center">
              <span class="text-[22px] font-semibold text-gray-800 leading-none tabular-nums">
                {{ typography.fontSize }}
              </span>
              <span class="text-[11px] text-gray-400 ml-1">px</span>
            </div>

            <button
              @click="increaseSize"
              :disabled="typography.fontSize >= MAX_SIZE"
              class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center font-bold text-gray-700 text-lg transition-colors select-none"
              :aria-label="t('typography.increaseSize')"
            >+</button>
          </div>
        </div>

        <!-- Divisor -->
        <div class="h-px bg-gray-100" />

        <!-- ── 3. Formato de hoja ─────────────────────────────────────── -->
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{{ t('typography.pageFormat') }}</p>
          <div class="flex gap-2">
            <button
              v-for="ps in PAGE_SIZES"
              :key="ps.key"
              @click="store.setTypography({ pageSize: ps.key })"
              class="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-[11px] font-medium transition-all"
              :class="
                typography.pageSize === ps.key
                  ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-[0_2px_8px_rgba(0,113,227,0.3)]'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              "
            >
              <!-- Mini icono de página proporcional -->
              <svg
                :width="ps.key === 'legal' ? 10 : 12"
                :height="ps.key === 'a4' ? 17 : ps.key === 'legal' ? 20 : 15"
                viewBox="0 0 12 15"
                fill="none"
                class="opacity-70"
              >
                <rect
                  x="0.5" y="0.5"
                  :width="ps.key === 'legal' ? 9 : 11"
                  :height="ps.key === 'a4' ? 16 : ps.key === 'legal' ? 19 : 14"
                  rx="1.5"
                  :stroke="typography.pageSize === ps.key ? 'white' : '#9ca3af'"
                  fill="none"
                />
              </svg>
              <span>{{ t(`typography.pageSizes.${ps.key}`) }}</span>
              <span
                class="text-[9px] opacity-60 leading-none"
              >{{ ps.dimensions }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { useTypographyStyles } from '@/composables/useTypographyStyles'
import { FONT_FAMILIES, PAGE_SIZES, FONT_SIZES } from '@/types/cv.types'

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps<{
  /** Distance in px from the bottom of the viewport to the top of the toolbar */
  anchorBottom: number
}>()

defineEmits<{ close: [] }>()

// ── Store & composable ────────────────────────────────────────────────────────
const { t } = useI18n()
const store = useCVStore()
const { typography } = useTypographyStyles()

// ── Font size limits & steps ──────────────────────────────────────────────────
const MIN_SIZE = FONT_SIZES[0]!
const MAX_SIZE = FONT_SIZES[FONT_SIZES.length - 1]!
const STEP     = 0.5

function decreaseSize() {
  const next = Math.max(MIN_SIZE, Math.round((typography.value.fontSize - STEP) * 10) / 10)
  store.setTypography({ fontSize: next })
}

function increaseSize() {
  const next = Math.min(MAX_SIZE, Math.round((typography.value.fontSize + STEP) * 10) / 10)
  store.setTypography({ fontSize: next })
}

// ── Posicionamiento: flota centrado sobre el toolbar ─────────────────────────
const GAP = 12
const anchorStyle = computed(() => ({
  bottom: `${props.anchorBottom + GAP}px`,
  left:   '50%',
  transform: 'translateX(-50%)',
  // Nunca más alto que el espacio disponible sobre el toolbar
  maxHeight: `calc(100vh - ${props.anchorBottom + GAP * 2}px)`,
}))
</script>
