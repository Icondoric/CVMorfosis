<template>
  <div class="space-y-3">
    <h2 class="section-title">{{ t('sections.summary') }}</h2>
    <AutoExpandTextarea
      v-model="cv.summary"
      :min-rows="5"
      :placeholder="t('fields.summary')"
      :aria-label="t('sections.summary')"
    />
    <div class="flex items-center justify-between gap-3 text-xs text-[var(--apple-text-tertiary)]">
      <span>{{ t('editor.summaryHint') }}</span>
      <span
        class="flex-shrink-0 tabular-nums"
        :class="{ 'text-amber-600 font-semibold': tooLong }"
        :title="tooLong ? t('editor.summaryTooLong', { max: MAX_LENGTH }) : undefined"
      >{{ cv.summary.length }} / {{ MAX_LENGTH }}</span>
    </div>
    <p v-if="tooLong" class="text-[11px] text-amber-600 m-0">{{ t('editor.summaryTooLong', { max: MAX_LENGTH }) }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import AutoExpandTextarea from '@/components/ui/AutoExpandTextarea.vue'

const { t } = useI18n()
const { cv } = storeToRefs(useCVStore())

/** A longer summary still exports; recruiters and ATS previews just stop reading it */
const MAX_LENGTH = 800
const tooLong = computed(() => cv.value.summary.length > MAX_LENGTH)
</script>
