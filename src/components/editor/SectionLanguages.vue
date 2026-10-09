<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.languages') }}</h2>
    <div v-for="(lang, idx) in cv.languages" :key="lang.id" class="entry-card">
      <div class="entry-header">
        <span class="entry-index">{{ idx + 1 }}</span>
        <EntryControls
          :index="idx"
          :count="cv.languages.length"
          @up="store.moveEntry('languages', lang.id, -1)"
          @down="store.moveEntry('languages', lang.id, 1)"
          @remove="store.removeLanguage(lang.id)"
        />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField :label="t('fields.languageName')" required v-slot="{ id }">
          <input :id="id" v-model="lang.name" type="text" class="form-input" placeholder="Español" />
        </FormField>
        <FormField :label="t('fields.languageLevel')" required v-slot="{ id }">
          <select :id="id" v-model="lang.level" class="form-input">
            <option value="" disabled>{{ t('fields.selectLevel') }}</option>
            <option v-for="level in levelOptions(lang.level)" :key="level" :value="level">{{ level }}</option>
          </select>
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
import { LANGUAGE_LEVELS, type AppLanguage } from '@/types/cv.types'
import EntryControls from '@/components/ui/EntryControls.vue'

const { t, locale } = useI18n()

/** Standard levels in the CV language, plus the current value if it was typed freely before */
function levelOptions(current: string): string[] {
  const levels = [...LANGUAGE_LEVELS[locale.value as AppLanguage]]
  return current && !levels.includes(current) ? [current, ...levels] : levels
}
const store = useCVStore()
const { cv } = storeToRefs(store)
</script>
