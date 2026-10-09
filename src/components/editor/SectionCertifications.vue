<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.certifications') }}</h2>

    <div v-for="(cert, idx) in certifications" :key="cert.id" class="entry-card">
      <div class="entry-header">
        <span class="entry-index">{{ idx + 1 }}</span>
        <EntryControls
          :index="idx"
          :count="certifications.length"
          @up="store.moveEntry('certifications', cert.id, -1)"
          @down="store.moveEntry('certifications', cert.id, 1)"
          @remove="store.removeCertification(cert.id)"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Nombre del certificado -->
        <FormField :label="t('fields.certName')" class="sm:col-span-2" required v-slot="{ id }">
          <input :id="id"
            v-model="cert.name"
            type="text"
            class="form-input"
            placeholder="Google Data Analytics Professional Certificate"
          />
        </FormField>

        <!-- Organización emisora -->
        <FormField :label="t('fields.certIssuer')" required v-slot="{ id }">
          <input :id="id"
            v-model="cert.issuer"
            type="text"
            class="form-input"
            placeholder="Google / Coursera"
          />
        </FormField>

        <!-- Fecha de emisión -->
        <FormField :label="t('fields.certDate')" v-slot="{ id }">
          <DateField :id="id" v-model="cert.date" />
        </FormField>

        <!-- Fecha de vencimiento (opcional) -->
        <FormField :label="t('fields.certExpiration')" v-slot="{ id }">
          <DateField :id="id" v-model="cert.expiration" />
        </FormField>

        <!-- ID de credencial (opcional) -->
        <FormField :label="t('fields.certCredentialId')" v-slot="{ id }">
          <input :id="id"
            v-model="cert.credentialId"
            type="text"
            class="form-input"
            placeholder="ABC-123456"
          />
        </FormField>

        <!-- URL de verificación (opcional) -->
        <FormField :label="t('fields.certUrl')" class="sm:col-span-2" v-slot="{ id }">
          <input :id="id"
            v-model="cert.url"
            type="url"
            class="form-input"
            placeholder="https://coursera.org/verify/..."
          />
        </FormField>
      </div>
    </div>

    <button @click="store.addCertification()" class="btn-add">
      {{ t('actions.addCertification') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import FormField from '@/components/ui/FormField.vue'
import EntryControls from '@/components/ui/EntryControls.vue'
import DateField from '@/components/ui/DateField.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)

// Backward-compatible: certifications may not exist on older saved CVs
const certifications = computed(() => cv.value.certifications ?? [])
</script>
