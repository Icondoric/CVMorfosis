<template>
  <!-- Harvard Compact — two-column layout: sidebar left, main content right -->
  <div class="cv-preview bg-white" style="width: 816px; min-height: 1056px; font-family: 'Inter', system-ui, sans-serif; font-size: 10.5px; color: #111; display: flex; box-sizing: border-box;">

    <!-- ── Left sidebar ────────────────────────────────────────────────────── -->
    <div style="width: 230px; min-height: 1056px; background: #1a365d; color: white; padding: 36px 22px; flex-shrink: 0; box-sizing: border-box;">
      <h1 style="font-size:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 4px 0; color:white; line-height:1.3;">
        {{ cv.personal.fullName || 'NOMBRE' }}
      </h1>
      <p v-if="cv.personal.title" style="font-size:9.5px; color:#a8c4e0; margin:0 0 16px 0; line-height:1.4;">
        {{ cv.personal.title }}
      </p>

      <div style="border-top:1px solid rgba(255,255,255,0.2); padding-top:14px; margin-bottom:14px;">
        <div v-if="cv.personal.location" style="margin-bottom:6px; font-size:9.5px; color:#ccd9e8; display:flex; align-items:center; gap:6px;">
          <svg style="width:11px; height:11px; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{{ cv.personal.location }}</span>
        </div>
        <div v-if="cv.personal.email" style="margin-bottom:6px; font-size:9.5px; color:#ccd9e8; word-break:break-all; display:flex; align-items:flex-start; gap:6px;">
          <svg style="width:11px; height:11px; flex-shrink:0; margin-top:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>{{ cv.personal.email }}</span>
        </div>
        <div v-if="cv.personal.phone" style="margin-bottom:6px; font-size:9.5px; color:#ccd9e8; display:flex; align-items:center; gap:6px;">
          <svg style="width:11px; height:11px; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>{{ cv.personal.phone }}</span>
        </div>
        <div v-if="cv.personal.linkedin" style="margin-bottom:6px; font-size:9px; color:#a8c4e0; word-break:break-all; display:flex; align-items:flex-start; gap:6px;">
          <svg style="width:11px; height:11px; flex-shrink:0; margin-top:1px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span>{{ cv.personal.linkedin }}</span>
        </div>
      </div>

      <!-- Skills -->
      <div v-if="cv.skills.filter(s=>s.trim()).length" style="margin-bottom:16px;">
        <div class="sidebar-section-title">{{ t('sections.skills') }}</div>
        <div v-for="(s, i) in cv.skills.filter(s=>s.trim())" :key="i"
          style="margin-bottom:4px; padding:2px 0; font-size:9.5px; color:#ccd9e8; border-bottom:1px solid rgba(255,255,255,0.1);">
          {{ s }}
        </div>
      </div>

      <!-- Programs -->
      <div v-if="cv.programs.filter(p=>p.trim()).length" style="margin-bottom:16px;">
        <div class="sidebar-section-title">{{ t('sections.programs') }}</div>
        <div v-for="(p, i) in cv.programs.filter(p=>p.trim())" :key="i"
          style="margin-bottom:4px; font-size:9.5px; color:#ccd9e8;">{{ p }}</div>
      </div>

      <!-- Languages -->
      <div v-if="cv.languages.length" style="margin-bottom:16px;">
        <div class="sidebar-section-title">{{ t('sections.languages') }}</div>
        <div v-for="lang in cv.languages" :key="lang.id" style="margin-bottom:5px;">
          <div style="font-size:9.5px; font-weight:600; color:white;">{{ lang.name }}</div>
          <div style="font-size:9px; color:#a8c4e0;">{{ lang.level }}</div>
        </div>
      </div>
    </div>

    <!-- ── Main content ────────────────────────────────────────────────────── -->
    <div style="flex:1; padding: 36px 40px;">

      <!-- Perfil -->
      <section v-if="cv.summary" style="margin-bottom:16px;">
        <div class="main-section-title">{{ t('sections.summary') }}</div>
        <p style="margin:0; line-height:1.55; color:#333; text-align:justify;">{{ cv.summary }}</p>
      </section>

      <!-- Educación -->
      <section v-if="cv.education.length" style="margin-bottom:16px;">
        <div class="main-section-title">{{ t('sections.education') }}</div>
        <div v-for="edu in cv.education" :key="edu.id" style="margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <strong style="font-size:10.5px;">{{ edu.degree }}<span v-if="edu.field"> — {{ edu.field }}</span></strong>
            <span style="font-size:9.5px; color:#555;">{{ edu.graduationDate }}</span>
          </div>
          <p style="margin:1px 0; font-style:italic; color:#555; font-size:10px;">{{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span></p>
        </div>
      </section>

      <!-- Experiencia -->
      <section v-if="cv.experience.length" style="margin-bottom:16px;">
        <div class="main-section-title">{{ t('sections.experience') }}</div>
        <div v-for="exp in cv.experience" :key="exp.id" style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <strong style="font-size:10.5px;">{{ exp.company }}</strong>
            <span style="font-size:9.5px; color:#555;">{{ exp.startDate }} - {{ exp.endDate }}</span>
          </div>
          <p style="margin:1px 0; font-style:italic; color:#444; font-size:10px;">{{ exp.role }}<span v-if="exp.location"> · {{ exp.location }}</span></p>
          <ul style="margin:4px 0 0 14px; padding:0; list-style-type:disc;">
            <li v-for="(b, i) in exp.bullets.filter(b=>b.trim())" :key="i" style="margin-bottom:2px; line-height:1.45; font-size:10px; text-align: justify;">{{ b }}</li>
          </ul>
        </div>
      </section>

      <!-- Logros -->
      <section v-if="cv.achievements.length" style="margin-bottom:16px;">
        <div class="main-section-title">{{ t('sections.achievements') }}</div>
        <div v-for="ach in cv.achievements" :key="ach.id" style="margin-bottom:7px;">
          <div style="display:flex; justify-content:space-between;">
            <strong style="font-size:10.5px;">{{ ach.organization }}</strong>
            <span style="font-size:9.5px; color:#888;">{{ ach.year }}</span>
          </div>
          <p style="margin:0; font-style:italic; color:#444; font-size:10px;">{{ ach.title }}</p>
          <p v-if="ach.description" style="margin:2px 0 0; color:#555; font-size:10px;">{{ ach.description }}</p>
        </div>
      </section>

      <!-- Publicaciones -->
      <section v-if="cv.publications.length">
        <div class="main-section-title">{{ t('sections.publications') }}</div>
        <div v-for="pub in cv.publications" :key="pub.id" style="margin-bottom:5px; line-height:1.45; font-size:10px;">
          {{ pub.authors }} ({{ pub.year }}). <em>{{ pub.title }}</em>. {{ pub.journal }}<span v-if="pub.doi">. DOI: {{ pub.doi }}</span>.
        </div>
      </section>
    </div>
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
.sidebar-section-title {
  font-size: 8.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  padding-bottom: 3px;
  margin-bottom: 7px;
}
.main-section-title {
  font-weight: 700;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1.5px solid #1a365d;
  color: #1a365d;
  padding-bottom: 3px;
  margin-bottom: 8px;
}
</style>
