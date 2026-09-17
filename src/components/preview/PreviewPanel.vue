<template>
  <div class="w-full max-w-[820px] space-y-4">
    <!-- Template switcher -->
    <div class="flex items-center justify-center gap-2 flex-wrap">
      <button
        v-for="tmpl in templates"
        :key="tmpl.key"
        @click="store.setTemplate(tmpl.key as TemplateVariant)"
        class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
        :class="cv.meta.template === tmpl.key
          ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
      >
        {{ tmpl.icon }} {{ t(`templates.${tmpl.key}`) }}
      </button>
    </div>

    <!-- CV completeness warning banner -->
    <div
      v-if="!isComplete"
      class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
    >
      <span class="text-amber-500 text-lg flex-shrink-0">⚠️</span>
      <div>
        <p class="text-sm font-semibold text-amber-700">CV incompleto</p>
        <p class="text-xs text-amber-600 mt-0.5">
          Faltan campos requeridos:
          <span class="font-medium">{{ missingFields.join(', ') }}</span>.
          Puedes exportarlo igualmente, pero puede quedar con espacios vacíos.
        </p>
      </div>
    </div>

    <!-- The CV preview (this element is captured for PDF export) -->
    <div ref="cvEl" class="shadow-xl rounded-lg overflow-hidden">
      <HarvardClassic   v-if="cv.meta.template === 'classic'" />
      <HarvardModern    v-else-if="cv.meta.template === 'modern'" />
      <HarvardCompact   v-else-if="cv.meta.template === 'compact'" />
      <HarvardElegant   v-else-if="cv.meta.template === 'elegant'" />
      <HarvardElegant2  v-else-if="cv.meta.template === 'elegant2'" />
    </div>

    <p class="text-center text-xs text-gray-400">
      Guardado automáticamente · Última modificación: {{ lastModified }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import type { TemplateVariant } from '@/types/cv.types'
import HarvardClassic  from './templates/HarvardClassic.vue'
import HarvardModern   from './templates/HarvardModern.vue'
import HarvardCompact  from './templates/HarvardCompact.vue'
import HarvardElegant  from './templates/HarvardElegant.vue'
import HarvardElegant2 from './templates/HarvardElegant2.vue'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)

const cvEl = ref<HTMLElement>()

const templates = [
  { key: 'classic',  icon: '📜' },
  { key: 'modern',   icon: '✨' },
  { key: 'compact',  icon: '📦' },
  { key: 'elegant',  icon: '🎨' },
  { key: 'elegant2', icon: '🖋️' },
] as const

const lastModified = computed(() => {
  return new Date(cv.value.meta.lastModified).toLocaleString()
})

// ── CV completeness check ─────────────────────────────────────────────────────
const missingFields = computed(() => {
  const missing: string[] = []
  const p = cv.value.personal
  if (!p.fullName.trim())  missing.push('Nombre completo')
  if (!p.email.trim())     missing.push('Email')
  if (!cv.value.summary.trim()) missing.push('Perfil profesional')
  if (!cv.value.education.length) missing.push('Educación')
  if (!cv.value.experience.length) missing.push('Experiencia')
  return missing
})

const isComplete = computed(() => missingFields.value.length === 0)

// Expose completeness and the actual DOM element (not the ref wrapper)
defineExpose({
  getEl: () => cvEl.value,
  isComplete,
  missingFields,
})
</script>
