<template>
  <svg
    :class="sizeClass"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- Personal / User -->
    <template v-if="name === 'personal' || name === 'user'">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </template>

    <!-- Summary / Document -->
    <template v-else-if="name === 'summary' || name === 'document'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </template>

    <!-- Education / Academic cap -->
    <template v-else-if="name === 'education' || name === 'academic'">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </template>

    <!-- Experience / Briefcase -->
    <template v-else-if="name === 'experience' || name === 'briefcase'">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </template>

    <!-- Skills / Sparkles -->
    <template v-else-if="name === 'skills' || name === 'sparkles'">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </template>

    <!-- Achievements / Award -->
    <template v-else-if="name === 'achievements' || name === 'award'">
      <circle cx="12" cy="8" r="6" />
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.723.52L12 19.897l-4.269 2.039a.5.5 0 0 1-.723-.52l1.515-8.526" />
    </template>

    <!-- Programs / Terminal & Code -->
    <template v-else-if="name === 'programs' || name === 'code'">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </template>

    <!-- Languages / Globe -->
    <template v-else-if="name === 'languages' || name === 'globe'">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </template>

    <!-- Publications / Book open -->
    <template v-else-if="name === 'publications' || name === 'book'">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </template>

    <!-- ATS Chip / Shield -->
    <template v-else-if="name === 'ats' || name === 'shield'">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </template>

    <!-- Download / Export -->
    <template v-else-if="name === 'download'">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </template>

    <!-- Spinner / Loading -->
    <template v-else-if="name === 'spinner'">
      <path class="opacity-25" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
    </template>

    <!-- Warning / Alert Triangle -->
    <template v-else-if="name === 'warning'">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </template>

    <!-- Pencil / Edit -->
    <template v-else-if="name === 'pencil'">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </template>

    <!-- Check / Success -->
    <template v-else-if="name === 'check'">
      <polyline points="20 6 9 17 4 12" />
    </template>

    <!-- Template icons -->
    <template v-else-if="name === 'classic'">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="13" y2="14" />
    </template>

    <template v-else-if="name === 'modern'">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <rect x="4" y="2" width="16" height="5" fill="currentColor" fill-opacity="0.3" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="14" y2="15" />
    </template>

    <template v-else-if="name === 'compact'">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <rect x="4" y="2" width="5" height="20" fill="currentColor" fill-opacity="0.3" />
      <line x1="12" y1="7" x2="17" y2="7" />
      <line x1="12" y1="11" x2="17" y2="11" />
    </template>

    <template v-else-if="name === 'elegant'">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="7" r="2.5" />
      <line x1="7" y1="13" x2="17" y2="13" />
      <line x1="7" y1="17" x2="14" y2="17" />
    </template>

    <template v-else-if="name === 'elegant2'">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="7" y1="6" x2="10" y2="6" />
      <line x1="12" y1="6" x2="17" y2="6" />
      <line x1="7" y1="11" x2="10" y2="11" />
      <line x1="12" y1="11" x2="17" y2="11" />
      <line x1="12" y1="15" x2="17" y2="15" />
    </template>

    <!-- Contact Icons -->
    <template v-else-if="name === 'phone'">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </template>

    <template v-else-if="name === 'mail'">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </template>

    <template v-else-if="name === 'location'">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </template>

    <template v-else-if="name === 'link'">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </template>

    <!-- Lightning / Bolt (Speed) -->
    <template v-else-if="name === 'lightning' || name === 'bolt'">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </template>

    <!-- Clock / Time -->
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </template>

    <!-- Arrow Right -->
    <template v-else-if="name === 'arrowRight' || name === 'arrow-right'">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </template>

    <!-- Check Circle -->
    <template v-else-if="name === 'checkCircle' || name === 'check-circle'">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </template>

    <!-- Devices / Responsive -->
    <template v-else-if="name === 'devices'">
      <rect width="18" height="12" x="3" y="4" rx="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </template>

    <!-- Arrow Left / Back -->
    <template v-else-if="name === 'arrowLeft' || name === 'arrow-left'">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </template>

    <!-- Cloud Check (Auto-save) -->
    <template v-else-if="name === 'cloudCheck' || name === 'cloud-check'">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <polyline points="9 16 11 18 15 14" />
    </template>

    <!-- Dots Vertical -->
    <template v-else-if="name === 'dotsVertical' || name === 'dots-vertical' || name === 'more'">
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </template>

    <!-- Chevron Down -->
    <template v-else-if="name === 'chevronDown' || name === 'chevron-down'">
      <polyline points="6 9 12 15 18 9" />
    </template>

    <!-- Chevron Up -->
    <template v-else-if="name === 'chevronUp' || name === 'chevron-up'">
      <polyline points="18 15 12 9 6 15" />
    </template>

    <!-- Upload Document -->
    <template v-else-if="name === 'uploadDoc' || name === 'upload-doc'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="11" />
      <polyline points="9 14 12 11 15 14" />
    </template>

    <!-- LinkedIn Logo -->
    <template v-else-if="name === 'linkedin'">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </template>

    <!-- Camera (Photo upload) -->
    <template v-else-if="name === 'camera'">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </template>

    <!-- Plus / Add -->
    <template v-else-if="name === 'plus'">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </template>

    <!-- Type / Aa -->
    <template v-else-if="name === 'type' || name === 'typography'">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </template>

    <!-- Line Spacing -->
    <template v-else-if="name === 'lineSpacing' || name === 'spacing'">
      <polyline points="7 15 12 20 17 15" />
      <polyline points="7 9 12 4 17 9" />
      <line x1="12" y1="20" x2="12" y2="4" />
    </template>

    <!-- Palette / Colors -->
    <template v-else-if="name === 'palette' || name === 'color'">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z" />
    </template>

    <!-- Fullscreen / Maximize -->
    <template v-else-if="name === 'maximize' || name === 'fullscreen'">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </template>

    <!-- Trash / Delete -->
    <template v-else-if="name === 'trash' || name === 'delete'">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </template>

    <!-- Default generic dot -->
    <template v-else>
      <circle cx="12" cy="12" r="4" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    size: 'sm',
  }
)

const sizeClass = computed(() => {
  const sizeMap: Record<string, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }
  return sizeMap[props.size] || 'w-4 h-4'
})
</script>
