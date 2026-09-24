<template>
  <textarea
    ref="textareaRef"
    :value="modelValue"
    @input="handleInput"
    :rows="minRows"
    :placeholder="placeholder"
    class="form-input resize-none block w-full"
    style="overflow: hidden;"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    minRows?: number
    placeholder?: string
  }>(),
  {
    modelValue: '',
    minRows: 1,
    placeholder: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function resize() {
  const el = textareaRef.value
  if (!el) return
  // Temporarily reset height to auto to compute true scrollHeight
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  resize()
}

watch(
  () => props.modelValue,
  () => {
    nextTick(resize)
  }
)

function onWindowResize() {
  resize()
}

onMounted(() => {
  nextTick(() => {
    resize()
    window.addEventListener('resize', onWindowResize, { passive: true })
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
})
</script>
