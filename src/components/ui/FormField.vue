<template>
  <div class="mb-2">
    <label v-if="label" class="block text-xs font-medium text-gray-600 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-400 ml-0.5">*</span>
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  required?: boolean
}>()
</script>
