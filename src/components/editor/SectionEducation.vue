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
        <EntryControls
          :index="idx"
          :count="cv.education.length"
          @up="store.moveEntry('education', entry.id, -1)"
          @down="store.moveEntry('education', entry.id, 1)"
          @remove="store.removeEducation(entry.id)"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField :label="t('fields.institution')" class="sm:col-span-2" required v-slot="{ id }">
          <input :id="id" v-model="entry.institution" type="text" class="form-input" placeholder="Universidad Nacional de Colombia" />
        </FormField>

        <FormField :label="t('fields.degree')" required v-slot="{ id }">
          <input :id="id" v-model="entry.degree" type="text" class="form-input" placeholder="Maestría en Administración" />
        </FormField>

        <FormField :label="t('fields.field')" v-slot="{ id }">
          <input :id="id" v-model="entry.field" type="text" class="form-input" placeholder="Ciencias Económicas" />
        </FormField>

        <FormField :label="t('fields.graduationDate')" required v-slot="{ id }">
          <DateField :id="id" v-model="entry.graduationDate" />
        </FormField>

        <FormField :label="t('fields.location')" v-slot="{ id }">
          <input :id="id" v-model="entry.location" type="text" class="form-input" placeholder="Bogotá, COL" />
        </FormField>

        <FormField :label="t('fields.honors')" class="sm:col-span-2" v-slot="{ id }">
          <input :id="id" v-model="entry.honors" type="text" class="form-input" placeholder="Cum Laude" />
        </FormField>

        <FormField :label="t('fields.thesis')" class="sm:col-span-2" v-slot="{ id }">
          <AutoExpandTextarea :id="id" v-model="entry.thesis" :min-rows="1" :placeholder="t('fields.thesis')" />
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
import EntryControls from '@/components/ui/EntryControls.vue'
import DateField from '@/components/ui/DateField.vue'
import AutoExpandTextarea from '@/components/ui/AutoExpandTextarea.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
</script>
