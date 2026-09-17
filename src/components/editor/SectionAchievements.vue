<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.achievements') }}</h2>

    <div v-for="(item, idx) in cv.achievements" :key="item.id" class="entry-card">
      <div class="entry-header">
        <span class="entry-index">{{ idx + 1 }}</span>
        <button @click="store.removeAchievement(item.id)" class="btn-remove">✕</button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <FormField :label="t('fields.organization')" required>
          <input v-model="item.organization" type="text" class="form-input" placeholder="BBVA Banco" />
        </FormField>
        <FormField :label="t('fields.year')">
          <input v-model="item.year" type="text" class="form-input" placeholder="2018" />
        </FormField>
        <FormField :label="t('fields.achievementTitle')" class="col-span-2" required>
          <input v-model="item.title" type="text" class="form-input" placeholder="Reconocimiento como Líder en Innovación" />
        </FormField>
        <FormField :label="t('fields.description')" class="col-span-2">
          <textarea v-model="item.description" rows="2" class="form-input resize-none" placeholder="Descripción del logro..." />
        </FormField>
      </div>
    </div>

    <button @click="store.addAchievement()" class="btn-add">
      {{ t('actions.addAchievement') }}
    </button>
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
