<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.experience') }}</h2>

    <div
      v-for="(entry, idx) in cv.experience"
      :key="entry.id"
      class="entry-card"
    >
      <div class="entry-header">
        <span class="entry-index">{{ idx + 1 }}</span>
        <button @click="store.removeExperience(entry.id)" class="btn-remove">✕</button>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <FormField :label="t('fields.company')" required>
          <input v-model="entry.company" type="text" class="form-input" placeholder="Deloitte Consulting" />
        </FormField>

        <FormField :label="t('fields.role')" required>
          <input v-model="entry.role" type="text" class="form-input" placeholder="Consultor Senior de Estrategia" />
        </FormField>

        <FormField :label="t('fields.startDate')" required>
          <input v-model="entry.startDate" type="text" class="form-input" placeholder="Enero 2020" />
        </FormField>

        <FormField :label="t('fields.endDate')">
          <div class="flex gap-2 items-center">
            <input
              v-model="entry.endDate"
              type="text"
              class="form-input"
              :placeholder="t('fields.present')"
              :disabled="entry.endDate === 'Presente' || entry.endDate === 'Present'"
            />
          </div>
          <label class="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              :checked="entry.endDate === 'Presente' || entry.endDate === 'Present'"
              @change="togglePresent(entry)"
              class="rounded"
            />
            {{ t('fields.present') }}
          </label>
        </FormField>

        <FormField :label="t('fields.location')" class="col-span-2">
          <input v-model="entry.location" type="text" class="form-input" placeholder="Bogotá, COL" />
        </FormField>
      </div>

      <!-- Bullets -->
      <div class="mt-3 space-y-2">
        <label class="text-[12px] font-medium text-[var(--apple-text-secondary)] uppercase tracking-wide">Responsabilidades / Logros</label>
        <div
          v-for="(bullet, bIdx) in entry.bullets"
          :key="bIdx"
          class="flex gap-2 items-start"
        >
          <span class="mt-2.5 text-gray-400 text-sm flex-shrink-0">•</span>
          <AutoExpandTextarea
            v-model="entry.bullets[bIdx]"
            :min-rows="1"
            class="flex-1"
            :placeholder="t('fields.bulletPlaceholder')"
          />
          <button
            @click="store.removeBullet(entry.id, bIdx)"
            class="mt-2 text-gray-400 hover:text-red-500 text-xs px-1.5 py-1 rounded hover:bg-red-50 flex-shrink-0"
            title="Eliminar viñeta"
          >✕</button>
        </div>
        <button @click="store.addBullet(entry.id)" class="text-xs text-[var(--apple-blue)] font-medium hover:underline flex items-center gap-1 mt-1">
          + {{ t('actions.addBullet') }}
        </button>
      </div>
    </div>

    <button @click="store.addExperience()" class="btn-add">
      {{ t('actions.addExperience') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import type { ExperienceEntry } from '@/types/cv.types'
import FormField from '@/components/ui/FormField.vue'
import AutoExpandTextarea from '@/components/ui/AutoExpandTextarea.vue'

const { t, locale } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)

function togglePresent(entry: ExperienceEntry) {
  const presentWord = locale.value === 'es' ? 'Presente' : 'Present'
  if (entry.endDate === presentWord) {
    entry.endDate = ''
  } else {
    entry.endDate = presentWord
  }
}
</script>
