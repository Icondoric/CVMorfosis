<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.personal') }}</h2>

    <!-- Photo upload -->
    <div class="flex items-start gap-4">
      <!-- Preview -->
      <div class="flex-shrink-0">
        <div
          class="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-blue-900 transition-colors relative group"
          @click="triggerFileInput"
        >
          <img v-if="cv.personal.photo" :src="cv.personal.photo" class="w-full h-full object-cover" alt="Foto" />
          <span v-else class="text-2xl text-gray-300">👤</span>
          <div class="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-white text-xs font-medium">Cambiar</span>
          </div>
        </div>
        <button
          v-if="cv.personal.photo"
          @click="cv.personal.photo = ''"
          class="mt-1 w-20 text-center text-xs text-red-400 hover:text-red-600 cursor-pointer"
        >Quitar</button>
      </div>

      <div class="flex-1 space-y-1">
        <p class="text-xs font-medium text-gray-600">Foto de perfil</p>
        <p class="text-xs text-gray-400">Opcional. Se muestra en el template Elegante 2.</p>
        <button @click="triggerFileInput" class="text-xs text-[var(--color-accent)] hover:underline cursor-pointer">
          + Subir foto
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onPhotoChange"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3">
      <FormField :label="t('fields.fullName')" required>
        <input v-model="cv.personal.fullName" type="text" class="form-input" placeholder="Juan Esteban Pérez" />
      </FormField>

      <FormField :label="t('fields.title')">
        <input v-model="cv.personal.title" type="text" class="form-input" placeholder="Economista | Consultor Financiero" />
      </FormField>

      <div class="grid grid-cols-2 gap-3">
        <FormField :label="t('fields.email')" required>
          <input v-model="cv.personal.email" type="email" class="form-input" placeholder="nombre@email.com" />
        </FormField>
        <FormField :label="t('fields.phone')">
          <input v-model="cv.personal.phone" type="tel" class="form-input" placeholder="+57 123 456 7890" />
        </FormField>
      </div>

      <FormField :label="t('fields.location')">
        <input v-model="cv.personal.location" type="text" class="form-input" placeholder="Bogotá, COL" />
      </FormField>

      <FormField :label="t('fields.linkedin')">
        <input v-model="cv.personal.linkedin" type="url" class="form-input" placeholder="linkedin.com/in/usuario" />
      </FormField>

      <FormField :label="t('fields.website')">
        <input v-model="cv.personal.website" type="url" class="form-input" placeholder="www.mipagina.com" />
      </FormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import FormField from '@/components/ui/FormField.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)

const fileInputRef = ref<HTMLInputElement>()

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onPhotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (evt) => {
    cv.value.personal.photo = evt.target?.result as string
  }
  reader.readAsDataURL(file)
  // Reset input so same file can be re-selected
  ;(e.target as HTMLInputElement).value = ''
}
</script>
