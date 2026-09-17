<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.programs') }}</h2>
    <div class="space-y-2">
      <div v-for="(prog, idx) in cv.programs" :key="idx" class="flex gap-2">
        <input v-model="cv.programs[idx]" type="text" class="form-input flex-1" placeholder="Power BI" />
        <button @click="store.removeProgram(idx)" class="text-gray-400 hover:text-red-500 text-sm px-2">✕</button>
      </div>
    </div>
    <button @click="store.addProgram()" class="btn-add">{{ t('actions.addProgram') }}</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
</script>
