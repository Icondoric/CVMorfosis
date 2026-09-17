<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.languages') }}</h2>
    <div v-for="(lang, idx) in cv.languages" :key="lang.id" class="entry-card">
      <div class="entry-header">
        <span class="entry-index">{{ idx + 1 }}</span>
        <button @click="store.removeLanguage(lang.id)" class="btn-remove">✕</button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <FormField :label="t('fields.languageName')" required>
          <input v-model="lang.name" type="text" class="form-input" placeholder="Español" />
        </FormField>
        <FormField :label="t('fields.languageLevel')" required>
          <input v-model="lang.level" type="text" class="form-input" placeholder="Nativo / Avanzado (C1)" />
        </FormField>
      </div>
    </div>
    <button @click="store.addLanguage()" class="btn-add">{{ t('actions.addLanguage') }}</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import FormField from '@/components/ui/FormField.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
</script>
