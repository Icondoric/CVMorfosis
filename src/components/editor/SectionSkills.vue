<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.skills') }}</h2>
    <p class="text-xs text-gray-400">{{ t('editor.skillsHint') }}</p>

    <TagListEditor
      v-model="cv.skills"
      :label="t('fields.skill')"
      :add-label="t('actions.addSkill')"
      :placeholder="t('fields.skillPlaceholder')"
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
