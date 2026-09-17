<template>
  <div class="space-y-3">
    <h2 class="section-title">{{ t('sections.summary') }}</h2>
    <FormField :label="t('sections.summary')">
      <textarea
        v-model="cv.summary"
        rows="7"
        class="form-input resize-none"
        :placeholder="t('fields.summary')"
      />
    </FormField>
    <p class="text-xs text-gray-400">{{ cv.summary.length }} / 800</p>
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
