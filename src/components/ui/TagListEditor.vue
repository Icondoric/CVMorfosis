<template>
  <div class="space-y-2">
    <div v-for="(item, idx) in model" :key="idx" class="flex gap-2">
      <input
        :value="item"
        type="text"
        class="form-input flex-1"
        :aria-label="`${label} ${idx + 1}`"
        @input="update(idx, ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="text-gray-400 hover:text-red-500 text-sm px-2"
        :title="t('actions.remove')"
        :aria-label="`${t('actions.remove')}: ${item}`"
        @click="remove(idx)"
      >✕</button>
    </div>

    <!-- Quick add: Enter or a comma commits; a pasted list is split into items -->
    <input
      v-model="draft"
      type="text"
      class="form-input"
      :placeholder="placeholder"
      :aria-label="addLabel"
      @keydown.enter.prevent="commit"
      @input="onInput"
      @paste="onPaste"
      @blur="commit"
    />
    <p class="text-[11px] text-gray-400 m-0">{{ t('editor.quickAdd') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  /** Names each existing item for assistive technology, e.g. "Soft skill 2" */
  label: string
  /** Accessible name of the quick-add field */
  addLabel: string
  placeholder?: string
}>()

const model = defineModel<string[]>({ required: true })
const { t } = useI18n()
const draft = ref('')

const SEPARATORS = /[,;\n\r|]+/

/** Appends the non-empty, not-yet-listed pieces of `text` */
function add(text: string) {
  const known = new Set(model.value.map(v => v.trim().toLowerCase()))
  const fresh: string[] = []
  for (const piece of text.split(SEPARATORS)) {
    const value = piece.trim()
    if (!value || known.has(value.toLowerCase())) continue
    known.add(value.toLowerCase())
    fresh.push(value)
  }
  // Blank rows left over from the old one-field-per-item editor are dropped here
  if (fresh.length) model.value = [...model.value.filter(v => v.trim()), ...fresh]
}

function commit() {
  add(draft.value)
  draft.value = ''
}

function onInput() {
  if (SEPARATORS.test(draft.value)) commit()
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? ''
  if (!SEPARATORS.test(text)) return
  e.preventDefault()
  add(draft.value + text)
  draft.value = ''
}

function update(idx: number, value: string) {
  model.value = model.value.map((v, i) => (i === idx ? value : v))
}

function remove(idx: number) {
  model.value = model.value.filter((_, i) => i !== idx)
}
</script>
