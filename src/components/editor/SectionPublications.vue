<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.publications') }}</h2>
    <p class="text-xs text-gray-400">Formato APA/Harvard. Opcional.</p>

    <div v-for="(pub, idx) in cv.publications" :key="pub.id" class="entry-card">
      <div class="entry-header">
        <span class="entry-index">{{ idx + 1 }}</span>
        <button @click="store.removePublication(pub.id)" class="btn-remove">✕</button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <FormField :label="t('fields.authors')" class="col-span-2" required>
          <input v-model="pub.authors" type="text" class="form-input" placeholder="Pérez, J. E., & García, M." />
        </FormField>
        <FormField :label="t('fields.year')" required>
          <input v-model="pub.year" type="text" class="form-input" placeholder="2023" />
        </FormField>
        <FormField :label="t('fields.pubTitle')" class="col-span-2" required>
          <AutoExpandTextarea v-model="pub.title" :min-rows="1" placeholder="Título del artículo o libro" />
        </FormField>
        <FormField :label="t('fields.journal')" required>
          <input v-model="pub.journal" type="text" class="form-input" placeholder="Journal of Finance" />
        </FormField>
        <FormField :label="t('fields.doi')">
          <input v-model="pub.doi" type="text" class="form-input" placeholder="10.1000/xyz123" />
        </FormField>
      </div>
    </div>

    <button @click="store.addPublication()" class="btn-add">{{ t('actions.addPublication') }}</button>
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
