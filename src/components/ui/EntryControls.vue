<template>
  <div class="flex items-center gap-0.5">
    <button
      type="button"
      class="btn-remove"
      :disabled="index === 0"
      :class="{ 'opacity-30 pointer-events-none': index === 0 }"
      :title="t('actions.moveUp')"
      :aria-label="t('actions.moveUp')"
      @click="emit('up')"
    >↑</button>
    <button
      type="button"
      class="btn-remove"
      :disabled="index === count - 1"
      :class="{ 'opacity-30 pointer-events-none': index === count - 1 }"
      :title="t('actions.moveDown')"
      :aria-label="t('actions.moveDown')"
      @click="emit('down')"
    >↓</button>
    <button
      type="button"
      class="btn-remove"
      :title="t('actions.remove')"
      :aria-label="t('actions.remove')"
      @click="emit('remove')"
    >✕</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  /** Position of the entry in its list */
  index: number
  /** Number of entries in the list */
  count: number
}>()

const emit = defineEmits<{ up: []; down: []; remove: [] }>()
const { t } = useI18n()
</script>
