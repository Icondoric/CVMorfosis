<template>
  <div ref="rootEl" class="relative">
    <button
      type="button"
      :disabled="busy"
      class="apple-btn flex items-center gap-1.5 py-1.5 rounded-xl font-semibold text-xs sm:text-[13px] text-white disabled:opacity-50 transition-all"
      :class="primary
        ? 'px-4 bg-[#0071E3] hover:bg-[#0077ED] shadow-[0_2px_8px_rgba(0,113,227,0.35)]'
        : 'px-3 bg-white/10 hover:bg-white/15 border border-white/15'"
      :title="title"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      <slot name="icon" />
      <span>{{ busy ? t('header.generating') : label }}</span>
      <AppIcon name="chevronDown" size="xs" class="opacity-70" />
    </button>

    <div
      v-if="open"
      role="menu"
      class="absolute right-0 mt-1.5 w-56 bg-[#1D1D1F] border border-white/10 rounded-xl shadow-xl py-1.5 z-30 text-xs text-white"
    >
      <button type="button" role="menuitem" class="w-full text-left px-3.5 py-2 hover:bg-white/10" @click="choose('pdf')">
        {{ t('header.formatPdf') }}
      </button>
      <button
        type="button"
        role="menuitem"
        class="w-full text-left px-3.5 py-2 hover:bg-white/10 disabled:opacity-45 disabled:hover:bg-transparent"
        :disabled="!wordAvailable"
        @click="choose('docx')"
      >
        {{ t('header.formatWord') }}
        <span v-if="!wordAvailable" class="block text-[10.5px] text-gray-400 mt-0.5 leading-snug">{{ t('header.wordUnavailable') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onClickOutside } from '@vueuse/core'
import AppIcon from '@/components/ui/AppIcon.vue'

export type ExportFormat = 'pdf' | 'docx'

withDefaults(defineProps<{
  label: string
  title?: string
  /** Main call to action (solid) vs secondary (outlined) */
  primary?: boolean
  busy?: boolean
  /** Whether the current design has a Word version */
  wordAvailable?: boolean
}>(), { wordAvailable: true })

const emit = defineEmits<{ select: [format: ExportFormat] }>()
const { t } = useI18n()

const open = ref(false)
const rootEl = ref<HTMLElement>()
onClickOutside(rootEl, () => { open.value = false })

function choose(format: ExportFormat) {
  open.value = false
  emit('select', format)
}
</script>
