<template>
  <div class="w-full">
    <input
      :id="id"
      v-model="model"
      type="text"
      class="form-input"
      :class="{ 'border-amber-400': showHint }"
      :placeholder="placeholder ?? t('fields.datePlaceholder')"
      :disabled="disabled"
      @focus="touched = false"
      @blur="onBlur"
    />
    <p v-if="showHint" class="mt-1 text-[11px] text-amber-600">{{ t('fields.dateHint') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { normalizeMonthYear } from '@/utils/date'

defineProps<{
  id?: string
  placeholder?: string
  disabled?: boolean
}>()

const model = defineModel<string>({ default: '' })
const { t } = useI18n()

// Only nag once the user has left the field
const touched = ref(false)
const showHint = computed(() => touched.value && normalizeMonthYear(model.value) === null)

/** Rewrites recognizable dates ("marzo 2020", "2020-03") as MM/YYYY */
function onBlur() {
  touched.value = true
  const normalized = normalizeMonthYear(model.value)
  if (normalized !== null && normalized !== model.value) model.value = normalized
}
</script>
