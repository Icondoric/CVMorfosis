<template>
  <div class="mb-3">
    <label
      v-if="label"
      :for="inputId"
      class="block text-[13px] sm:text-[13.5px] font-medium text-[var(--apple-text-secondary)] mb-1.5 tracking-tight"
    >
      {{ label }}
      <span v-if="required" class="text-[var(--apple-red)] ml-0.5" aria-hidden="true">*</span>
      <span v-if="required" class="sr-only">(campo obligatorio)</span>
    </label>
    <slot :id="inputId" />
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

const props = defineProps<{
  id?: string
  label?: string
  required?: boolean
}>()

const inputId = props.id || useId()
</script>
