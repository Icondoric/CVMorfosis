<template>
  <div class="space-y-3">
    <h2 class="section-title">{{ t('sections.summary') }}</h2>
    <FormField :label="t('sections.summary')">
      <AutoExpandTextarea
        v-model="cv.summary"
        :min-rows="5"
        :placeholder="t('fields.summary')"
      />
    </FormField>
    <div class="flex items-center justify-between text-xs text-[var(--apple-text-tertiary)]">
      <span>Describe tu valor diferencial, años de experiencia y principales logros.</span>
      <span>{{ cv.summary.length }} / 800</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import FormField from '@/components/ui/FormField.vue'
import AutoExpandTextarea from '@/components/ui/AutoExpandTextarea.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
</script>
