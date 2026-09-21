<template>
  <!-- Harvard Classic — white, serif, black lines. Based on the .docx example -->
  <div class="cv-preview bg-white" style="width: 816px; min-height: 1056px; padding: 44px 58px 52px 58px; font-family: 'Lora', 'Times New Roman', serif; font-size: 11px; color: #111; box-sizing: border-box;">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div style="text-align:center; margin-bottom: 20px;">
      <h1 style="font-size: 22px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 6px 0;">
        {{ cv.personal.fullName || 'NOMBRE COMPLETO' }}
      </h1>
      <p v-if="cv.personal.title" style="font-size: 12px; color: #444; margin: 0 0 6px 0; font-style: italic;">
        {{ cv.personal.title }}
      </p>
      <p style="font-size: 10.5px; color: #333; margin: 0;">
        <span v-if="cv.personal.location">{{ cv.personal.location }}</span>
        <span v-if="cv.personal.location && cv.personal.email"> &nbsp;·&nbsp; </span>
        <span v-if="cv.personal.email">{{ cv.personal.email }}</span>
        <span v-if="cv.personal.phone"> &nbsp;·&nbsp; {{ cv.personal.phone }}</span>
        <span v-if="cv.personal.linkedin"> &nbsp;·&nbsp; {{ cv.personal.linkedin }}</span>
        <span v-if="cv.personal.website"> &nbsp;·&nbsp; {{ cv.personal.website }}</span>
      </p>
    </div>

    <!-- ── Perfil Profesional ─────────────────────────────────────────────── -->
    <section v-if="cv.summary" style="margin-bottom: 16px;">
      <div class="cv-section-title">{{ t('sections.summary') }}</div>
      <p style="margin: 0; text-align: justify; line-height: 1.55;">{{ cv.summary }}</p>
    </section>

    <!-- ── Educación ──────────────────────────────────────────────────────── -->
    <section v-if="cv.education.length" style="margin-bottom: 16px;">
      <div class="cv-section-title">{{ t('sections.education') }}</div>
      <div v-for="edu in cv.education" :key="edu.id" class="cv-entry" style="margin-bottom: 10px;">
        <div class="cv-entry-header">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span style="font-weight: 700;">{{ edu.degree }}<span v-if="edu.field"> en {{ edu.field }}</span></span>
            <span style="font-size:10.5px; color:#444;">{{ edu.graduationDate }}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="font-style:italic; color:#333;">{{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span></span>
            <span v-if="edu.honors" style="font-size:10px; color:#555;">{{ edu.honors }}</span>
          </div>
        </div>
        <p v-if="edu.thesis" style="margin: 2px 0 0; font-size: 10.5px; color:#444;">Tesis: <em>{{ edu.thesis }}</em></p>
      </div>
    </section>

    <!-- ── Experiencia Profesional ────────────────────────────────────────── -->
    <section v-if="cv.experience.length" style="margin-bottom: 16px;">
      <div class="cv-section-title">{{ t('sections.experience') }}</div>
      <div v-for="exp in cv.experience" :key="exp.id" class="cv-entry" style="margin-bottom: 12px;">
        <div class="cv-entry-header">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span style="font-weight: 700;">{{ exp.company }}</span>
            <span style="font-size:10.5px; color:#444;">{{ exp.startDate }}<span v-if="exp.endDate"> - {{ exp.endDate }}</span></span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="font-style:italic; color:#333;">{{ exp.role }}<span v-if="exp.location"> · {{ exp.location }}</span></span>
          </div>
        </div>
        <ul style="margin: 4px 0 0 16px; padding: 0; list-style-type: disc;">
          <li v-for="(b, i) in exp.bullets.filter(b => b.trim())" :key="i" style="margin-bottom: 2px; line-height: 1.45; text-align: justify;">
            {{ b }}
          </li>
        </ul>
      </div>
    </section>

    <!-- ── Habilidades ────────────────────────────────────────────────────── -->
    <section v-if="cv.skills.filter(s => s.trim()).length" class="cv-entry" style="margin-bottom: 16px;">
      <div class="cv-section-title">{{ t('sections.skills') }}</div>
      <p style="margin: 0;">{{ cv.skills.filter(s => s.trim()).join(' | ') }}</p>
    </section>

    <!-- ── Logros Destacados ──────────────────────────────────────────────── -->
    <section v-if="cv.achievements.length" style="margin-bottom: 16px;">
      <div class="cv-section-title">{{ t('sections.achievements') }}</div>
      <div v-for="ach in cv.achievements" :key="ach.id" class="cv-entry" style="margin-bottom: 8px;">
        <div style="display:flex; justify-content:space-between; align-items:baseline;">
          <span style="font-weight: 700;">{{ ach.organization }}</span>
          <span style="font-size:10.5px; color:#444;">{{ ach.year }}</span>
        </div>
        <p style="margin: 0; font-style:italic; color:#333;">{{ ach.title }}</p>
        <p v-if="ach.description" style="margin: 2px 0 0; color:#444; line-height:1.4;">{{ ach.description }}</p>
      </div>
    </section>

    <!-- ── Programas ─────────────────────────────────────────────────────── -->
    <section v-if="cv.programs.filter(p => p.trim()).length" class="cv-entry" style="margin-bottom: 16px;">
      <div class="cv-section-title">{{ t('sections.programs') }}</div>
      <!-- Wrap en línea con | igual que habilidades, más compacto que lista vertical -->
      <p style="margin: 0; line-height: 1.6;">{{ cv.programs.filter(p => p.trim()).join(' | ') }}</p>
    </section>

    <!-- ── Idiomas ────────────────────────────────────────────────────────── -->
    <section v-if="cv.languages.length" class="cv-entry" style="margin-bottom: 16px;">
      <div class="cv-section-title">{{ t('sections.languages') }}</div>
      <ul style="margin: 0; padding: 0; list-style: none;">
        <li v-for="lang in cv.languages" :key="lang.id" style="margin-bottom: 3px;">
          <strong>{{ lang.name }}</strong>: {{ lang.level }}
        </li>
      </ul>
    </section>

    <!-- ── Publicaciones ──────────────────────────────────────────────────── -->
    <section v-if="cv.publications.length" class="cv-entry" style="margin-bottom: 16px;">
      <div class="cv-section-title">{{ t('sections.publications') }}</div>
      <div v-for="pub in cv.publications" :key="pub.id" style="margin-bottom: 8px; line-height: 1.4;">
        {{ pub.authors }} ({{ pub.year }}). <em>{{ pub.title }}</em>. {{ pub.journal }}<span v-if="pub.doi">. DOI: {{ pub.doi }}</span>.
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
</script>

<style scoped>
.cv-section-title {
  font-weight: 700;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1.5px solid #111;
  padding-bottom: 3px;
  margin-bottom: 8px;
  break-after: avoid;
  page-break-after: avoid;
}
.cv-entry {
  break-inside: auto;
  page-break-inside: auto;
}
.cv-entry-header {
  break-inside: avoid;
  break-after: avoid;
  page-break-after: avoid;
}
li {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
