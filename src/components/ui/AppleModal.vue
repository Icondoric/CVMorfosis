<template>
  <Teleport to="body">
    <Transition name="apple-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="modalTitleId"
        @keydown.esc="onCancel"
      >
        <!-- Fondo borroso característico de Apple (Backdrop Blur) -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          @click="onCancel"
        ></div>

        <!-- Tarjeta del Modal con estilo Apple HIG -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-black/5 transform transition-all select-none"
          @click.stop
        >
          <!-- Encabezado con Icono e Insignia temática -->
          <div class="flex items-start gap-3.5">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="iconContainerClass"
            >
              <AppIcon :name="icon" size="md" />
            </div>

            <div class="flex-1 min-w-0 pt-0.5">
              <h3 :id="modalTitleId" class="font-bold text-gray-900 text-base leading-snug">
                {{ title }}
              </h3>
              <p v-if="subtitle" class="text-xs text-gray-500 mt-0.5">
                {{ subtitle }}
              </p>
            </div>
          </div>

          <!-- Contenido descriptivo -->
          <div v-if="description || $slots.default" class="text-xs text-gray-600 leading-relaxed">
            <p v-if="description" class="m-0">{{ description }}</p>
            <slot />
          </div>

          <!-- Botones de Acción Apple -->
          <div class="flex gap-2.5 pt-2">
            <button
              v-if="showCancel"
              @click="onCancel"
              type="button"
              class="apple-btn flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              {{ cancelText }}
            </button>

            <button
              @click="onConfirm"
              type="button"
              class="apple-btn flex-1 py-2.5 rounded-xl text-white text-xs font-semibold shadow-sm transition-all"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title: string
    subtitle?: string
    description?: string
    icon?: string
    variant?: 'danger' | 'warning' | 'primary' | 'success'
    confirmText?: string
    cancelText?: string
    isDestructive?: boolean
    showCancel?: boolean
  }>(),
  {
    icon: 'warning',
    variant: 'warning',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    isDestructive: false,
    showCancel: true,
  }
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const modalTitleId = useId()

function onCancel() {
  emit('cancel')
  emit('close')
}

function onConfirm() {
  emit('confirm')
  emit('close')
}

const iconContainerClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-500/10 text-[#FF3B30]'
    case 'warning':
      return 'bg-amber-500/10 text-amber-600'
    case 'success':
      return 'bg-emerald-500/10 text-[#34C759]'
    case 'primary':
    default:
      return 'bg-[#0071E3]/10 text-[#0071E3]'
  }
})

const confirmButtonClass = computed(() => {
  if (props.isDestructive || props.variant === 'danger') {
    return 'bg-[#FF3B30] hover:bg-[#E0342B] active:bg-[#C82A22]'
  }
  return 'bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4]'
})
</script>

<style>
/* Animación Apple: Entrada/Salida suave con escala sutil y fade */
.apple-modal-enter-active,
.apple-modal-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.apple-modal-enter-from,
.apple-modal-leave-to {
  opacity: 0;
}

.apple-modal-enter-from .relative,
.apple-modal-leave-to .relative {
  transform: scale(0.96) translateY(4px);
}
</style>
