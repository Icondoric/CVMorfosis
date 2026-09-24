<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.education') }}</h2>

    <div
      v-for="(entry, idx) in cv.education"
      :key="entry.id"
      class="entry-card"
    >
      <div class="entry-header">
        <span class="entry-index">{{ idx + 1 }}</span>
        <button @click="store.removeEducation(entry.id)" class="btn-remove">✕</button>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <FormField :label="t('fields.institution')" class="col-span-2" required>
          <input v-model="entry.institution" type="text" class="form-input" placeholder="Universidad Nacional de Colombia" />
        </FormField>

        <FormField :label="t('fields.degree')" required>
          <input v-model="entry.degree" type="text" class="form-input" placeholder="Maestría en Administración" />
        </FormField>

        <FormField :label="t('fields.field')">
          <input v-model="entry.field" type="text" class="form-input" placeholder="Ciencias Económicas" />
        </FormField>

        <FormField :label="t('fields.graduationDate')" required>
          <input v-model="entry.graduationDate" type="text" class="form-input" placeholder="Mayo 2022" />
        </FormField>

        <FormField :label="t('fields.location')">
          <input v-model="entry.location" type="text" class="form-input" placeholder="Bogotá, COL" />
        </FormField>

        <FormField :label="t('fields.honors')" class="col-span-2">
          <input v-model="entry.honors" type="text" class="form-input" placeholder="Cum Laude" />
        </FormField>

        <FormField :label="t('fields.thesis')" class="col-span-2">
          <AutoExpandTextarea v-model="entry.thesis" :min-rows="1" placeholder="Título de la tesis (opcional)" />
        </FormField>
      </div>
    </div>

    <button @click="store.addEducation()" class="btn-add">
      {{ t('actions.addEducation') }}
    </button>
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
