<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.achievements') }}</h2>

    <div v-for="(item, idx) in cv.achievements" :key="item.id" class="entry-card">
      <div class="entry-header">
        <span class="entry-index">{{ idx + 1 }}</span>
        <EntryControls
          :index="idx"
          :count="cv.achievements.length"
          @up="store.moveEntry('achievements', item.id, -1)"
          @down="store.moveEntry('achievements', item.id, 1)"
          @remove="store.removeAchievement(item.id)"
        />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField :label="t('fields.organization')" required v-slot="{ id }">
          <input :id="id" v-model="item.organization" type="text" class="form-input" placeholder="BBVA Banco" />
        </FormField>
        <FormField :label="t('fields.year')" v-slot="{ id }">
          <input :id="id" v-model="item.year" type="text" class="form-input" placeholder="2018" />
        </FormField>
        <FormField :label="t('fields.achievementTitle')" class="sm:col-span-2" required v-slot="{ id }">
          <AutoExpandTextarea :id="id" v-model="item.title" :min-rows="1" placeholder="Reconocimiento como Líder en Innovación" />
        </FormField>
        <FormField :label="t('fields.description')" class="sm:col-span-2" v-slot="{ id }">
          <AutoExpandTextarea :id="id" v-model="item.description" :min-rows="2" :placeholder="t('fields.description')" />
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
import EntryControls from '@/components/ui/EntryControls.vue'
import AutoExpandTextarea from '@/components/ui/AutoExpandTextarea.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
</script>
