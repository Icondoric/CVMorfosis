<template>
  <div class="space-y-4">
    <h2 class="section-title">{{ t('sections.personal') }}</h2>

    <!-- Photo upload (Apple Avatar Card) -->
    <div class="flex items-start gap-4 p-3 bg-[var(--apple-fill-quaternary)] border border-[var(--apple-border-light)] rounded-2xl">
      <!-- Preview -->
      <div class="flex-shrink-0">
        <div
          class="w-20 h-20 rounded-2xl border border-dashed border-[var(--apple-blue)]/40 flex items-center justify-center overflow-hidden bg-white cursor-pointer hover:border-[var(--apple-blue)] transition-all relative group shadow-sm"
          @click="triggerFileInput"
        >
          <img
            v-if="cv.personal.photo"
            :src="cv.personal.photo"
            class="w-full h-full object-cover"
            alt="Foto de perfil del candidato"
            width="80"
            height="80"
            loading="lazy"
          />
          <AppIcon v-else name="personal" size="lg" class="text-gray-400" />
          <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-white text-[11px] font-semibold">Cambiar</span>
          </div>
        </div>
        <button
          v-if="cv.personal.photo"
          @click="cv.personal.photo = ''"
          class="apple-btn mt-1.5 w-20 text-center text-[11px] font-semibold text-[var(--apple-red)] hover:opacity-80 block"
        >Quitar</button>
      </div>

      <div class="flex-1 space-y-1 pt-1">
        <p class="text-xs font-semibold text-[var(--apple-text-primary)]">Foto de perfil</p>
        <p class="text-[11px] text-[var(--apple-text-secondary)]">Opcional. Se muestra en el template Elegante 2 y Ondas.</p>
        <button
          @click="triggerFileInput"
          type="button"
          class="apple-btn text-xs font-semibold text-[var(--apple-blue)] hover:underline block pt-1"
          aria-label="Subir foto de perfil"
        >
          + Subir foto
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          aria-label="Seleccionar archivo de imagen para foto de perfil"
          @change="onPhotoChange"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3">
      <FormField id="personal-fullName" :label="t('fields.fullName')" required>
        <input
          id="personal-fullName"
          v-model="cv.personal.fullName"
          type="text"
          class="form-input"
          placeholder="Juan Esteban Pérez"
          autocomplete="name"
          required
        />
      </FormField>

      <FormField id="personal-title" :label="t('fields.title')">
        <input
          id="personal-title"
          v-model="cv.personal.title"
          type="text"
          class="form-input"
          placeholder="Economista | Consultor Financiero"
          autocomplete="organization-title"
        />
      </FormField>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField id="personal-email" :label="t('fields.email')" required>
          <input
            id="personal-email"
            v-model="cv.personal.email"
            type="email"
            class="form-input"
            placeholder="nombre@email.com"
            autocomplete="email"
            required
          />
        </FormField>
        <FormField id="personal-phone" :label="t('fields.phone')">
          <input
            id="personal-phone"
            v-model="cv.personal.phone"
            type="tel"
            class="form-input"
            placeholder="+57 123 456 7890"
            autocomplete="tel"
          />
        </FormField>
      </div>

      <FormField id="personal-location" :label="t('fields.location')">
        <input
          id="personal-location"
          v-model="cv.personal.location"
          type="text"
          class="form-input"
          placeholder="Bogotá, COL"
          autocomplete="address-level2"
        />
      </FormField>

      <FormField id="personal-linkedin" :label="t('fields.linkedin')">
        <input
          id="personal-linkedin"
          v-model="cv.personal.linkedin"
          type="url"
          class="form-input"
          placeholder="linkedin.com/in/usuario"
          autocomplete="url"
        />
      </FormField>

      <FormField id="personal-website" :label="t('fields.website')">
        <input
          id="personal-website"
          v-model="cv.personal.website"
          type="url"
          class="form-input"
          placeholder="www.mipagina.com"
          autocomplete="url"
        />
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
import AppIcon from '@/components/ui/AppIcon.vue'

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
