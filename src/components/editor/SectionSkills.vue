<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.skills') }}</h2>
    <p class="text-xs text-gray-400">{{ t('sections.skills') }} — {{ t('fields.skillPlaceholder') }}</p>

    <div class="space-y-2">
      <div
        v-for="(skill, idx) in cv.skills"
        :key="idx"
        class="flex gap-2"
      >
        <input
          v-model="cv.skills[idx]"
          type="text"
          class="form-input flex-1"
          :placeholder="t('fields.skillPlaceholder')"
        />
        <button @click="store.removeSkill(idx)" class="text-gray-400 hover:text-red-500 text-sm px-2">✕</button>
      </div>
    </div>

    <button @click="store.addSkill()" class="btn-add">
      {{ t('actions.addSkill') }}
    </button>

    <div v-if="cv.skills.filter(s => s.trim()).length" class="mt-3 p-3 bg-gray-50 rounded-lg">
      <p class="text-xs text-gray-400 mb-1">Vista previa:</p>
      <p class="text-sm text-gray-700">{{ cv.skills.filter(s => s.trim()).join(' | ') }}</p>
    </div>
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
