<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.programs') }}</h2>
    <p class="text-xs text-gray-400">{{ t('editor.programsHint') }}</p>
    <TagListEditor
      v-model="cv.programs"
      :label="t('fields.program')"
      :add-label="t('actions.addProgram')"
      placeholder="Power BI"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import TagListEditor from '@/components/ui/TagListEditor.vue'

const { t } = useI18n()
const { cv } = storeToRefs(useCVStore())
</script>
