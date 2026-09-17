<template>
  <div class="p-5 space-y-1">
    <!-- Section nav tabs -->
    <nav class="flex flex-wrap gap-1 mb-4 p-1 bg-gray-100 rounded-xl">
      <button
        v-for="sec in sections"
        :key="sec.key"
        @click="active = sec.key"
        class="flex-1 min-w-[70px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center"
        :class="active === sec.key
          ? 'bg-white text-[var(--color-accent)] shadow-sm'
          : 'text-gray-500 hover:text-gray-700'"
      >
        {{ sec.icon }} {{ t(sec.labelKey) }}
      </button>
    </nav>

    <!-- Section content -->
    <SectionPersonal v-show="active === 'personal'" />
    <SectionSummary v-show="active === 'summary'" />
    <SectionEducation v-show="active === 'education'" />
    <SectionExperience v-show="active === 'experience'" />
    <SectionSkills v-show="active === 'skills'" />
    <SectionAchievements v-show="active === 'achievements'" />
    <SectionPrograms v-show="active === 'programs'" />
    <SectionLanguages v-show="active === 'languages'" />
    <SectionPublications v-show="active === 'publications'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionPersonal from './SectionPersonal.vue'
import SectionSummary from './SectionSummary.vue'
import SectionEducation from './SectionEducation.vue'
import SectionExperience from './SectionExperience.vue'
import SectionSkills from './SectionSkills.vue'
import SectionAchievements from './SectionAchievements.vue'
import SectionPrograms from './SectionPrograms.vue'
import SectionLanguages from './SectionLanguages.vue'
import SectionPublications from './SectionPublications.vue'

const { t } = useI18n()

const active = ref('personal')

const sections = [
  { key: 'personal',     icon: '👤', labelKey: 'sections.personal' },
  { key: 'summary',      icon: '📝', labelKey: 'sections.summary' },
  { key: 'education',    icon: '🎓', labelKey: 'sections.education' },
  { key: 'experience',   icon: '💼', labelKey: 'sections.experience' },
  { key: 'skills',       icon: '⚡', labelKey: 'sections.skills' },
  { key: 'achievements', icon: '🏆', labelKey: 'sections.achievements' },
  { key: 'programs',     icon: '💻', labelKey: 'sections.programs' },
  { key: 'languages',    icon: '🌐', labelKey: 'sections.languages' },
  { key: 'publications', icon: '📚', labelKey: 'sections.publications' },
]
</script>
