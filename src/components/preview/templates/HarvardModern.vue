<template>
  <!-- Harvard Modern — colored accent header, clean sans-serif body -->
  <div class="cv-preview bg-white" style="width: 816px; min-height: 1056px; font-family: 'Inter', system-ui, sans-serif; font-size: 11px; color: #1a1a1a; box-sizing: border-box;">

    <!-- ── Header with color band ─────────────────────────────────────────── -->
    <div style="background: #1a365d; color: white; padding: 36px 56px 28px; margin-bottom: 0;">
      <h1 style="font-size: 26px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin: 0 0 6px 0; color:white;">
        {{ cv.personal.fullName || 'NOMBRE COMPLETO' }}
      </h1>
      <p v-if="cv.personal.title" style="font-size: 13px; color: #a8c4e0; margin: 0 0 10px 0; font-weight: 300;">
        {{ cv.personal.title }}
      </p>
      <p style="font-size: 10px; color: #ccd9e8; margin: 0; display: flex; flex-wrap: wrap; gap: 14px; align-items: center;">
        <span v-if="cv.personal.location" style="display:inline-flex; align-items:center; gap:4px;">
          <svg style="width:11px; height:11px; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ cv.personal.location }}
        </span>
        <span v-if="cv.personal.email" style="display:inline-flex; align-items:center; gap:4px;">
          <svg style="width:11px; height:11px; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          {{ cv.personal.email }}
        </span>
        <span v-if="cv.personal.phone" style="display:inline-flex; align-items:center; gap:4px;">
          <svg style="width:11px; height:11px; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          {{ cv.personal.phone }}
        </span>
        <span v-if="cv.personal.linkedin" style="display:inline-flex; align-items:center; gap:4px;">
          <svg style="width:11px; height:11px; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          {{ cv.personal.linkedin }}
        </span>
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 56px;">

      <!-- ── Perfil ─────────────────────────────────────────────────────── -->
      <section v-if="cv.summary" style="margin-bottom: 20px;">
        <div class="section-title-modern">{{ t('sections.summary') }}</div>
        <p style="margin: 0; line-height: 1.6; color: #333; text-align: justify;">{{ cv.summary }}</p>
      </section>

      <!-- ── Educación ──────────────────────────────────────────────────── -->
      <section v-if="cv.education.length" style="margin-bottom: 20px;">
        <div class="section-title-modern">{{ t('sections.education') }}</div>
        <div v-for="edu in cv.education" :key="edu.id" style="margin-bottom: 10px; display:flex; gap:16px;">
          <div style="min-width:80px; text-align:right; color:#1a365d; font-weight:600; font-size:10px; padding-top:2px;">
            {{ edu.graduationDate }}
          </div>
          <div style="flex:1; border-left:2px solid #1a365d; padding-left:14px;">
            <p style="font-weight:700; margin:0;">{{ edu.degree }}<span v-if="edu.field"> — {{ edu.field }}</span></p>
            <p style="margin:2px 0; color:#555; font-size:10.5px; font-style:italic;">{{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span></p>
            <p v-if="edu.honors" style="margin:1px 0; font-size:10px; color:#888;">{{ edu.honors }}</p>
          </div>
        </div>
      </section>

      <!-- ── Experiencia ────────────────────────────────────────────────── -->
      <section v-if="cv.experience.length" style="margin-bottom: 20px;">
        <div class="section-title-modern">{{ t('sections.experience') }}</div>
        <div v-for="exp in cv.experience" :key="exp.id" style="margin-bottom: 14px; display:flex; gap:16px;">
          <div style="min-width:80px; text-align:right; color:#1a365d; font-weight:600; font-size:10px; padding-top:2px; white-space:nowrap;">
            {{ exp.startDate }}<br>{{ exp.endDate }}
          </div>
          <div style="flex:1; border-left:2px solid #1a365d; padding-left:14px;">
            <p style="font-weight:700; margin:0;">{{ exp.role }}</p>
            <p style="margin:2px 0; color:#555; font-size:10.5px; font-style:italic;">{{ exp.company }}<span v-if="exp.location"> · {{ exp.location }}</span></p>
            <ul style="margin: 5px 0 0 14px; padding:0; list-style-type:disc;">
              <li v-for="(b, i) in exp.bullets.filter(b => b.trim())" :key="i" style="margin-bottom:2px; line-height:1.5; text-align: justify;">{{ b }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ── Habilidades ──────────────────────────────────────────────── -->
      <section v-if="cv.skills.filter(s=>s.trim()).length" style="margin-bottom: 20px;">
        <div class="section-title-modern">{{ t('sections.skills') }}</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
          <span
            v-for="(skill, i) in cv.skills.filter(s=>s.trim())"
            :key="i"
            style="background:#e8f0f8; color:#1a365d; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:500;"
          >{{ skill }}</span>
        </div>
      </section>

      <!-- ── Logros ─────────────────────────────────────────────────────── -->
      <section v-if="cv.achievements.length" style="margin-bottom: 20px;">
        <div class="section-title-modern">{{ t('sections.achievements') }}</div>
        <div v-for="ach in cv.achievements" :key="ach.id" style="margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between;">
            <strong>{{ ach.organization }}</strong>
            <span style="color:#888; font-size:10px;">{{ ach.year }}</span>
          </div>
          <p style="margin:0; font-style:italic; color:#444;">{{ ach.title }}</p>
          <p v-if="ach.description" style="margin:2px 0 0; color:#555;">{{ ach.description }}</p>
        </div>
      </section>

      <!-- ── Programas e Idiomas ────────────────────────────────────────── -->
      <div v-if="cv.programs.filter(p=>p.trim()).length || cv.languages.length" style="display:flex; gap:32px; margin-bottom:20px;">
        <section v-if="cv.programs.filter(p=>p.trim()).length" style="flex:1;">
          <div class="section-title-modern">{{ t('sections.programs') }}</div>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            <span v-for="(p, i) in cv.programs.filter(p=>p.trim())" :key="i"
              style="background:#f0f4f8; padding:3px 8px; border-radius:4px; font-size:10px;">{{ p }}</span>
          </div>
        </section>
        <section v-if="cv.languages.length" style="flex:1;">
          <div class="section-title-modern">{{ t('sections.languages') }}</div>
          <ul style="margin:0; padding:0; list-style:none;">
            <li v-for="lang in cv.languages" :key="lang.id" style="margin-bottom:3px;">
              <strong>{{ lang.name }}</strong>: {{ lang.level }}
            </li>
          </ul>
        </section>
      </div>

      <!-- ── Publicaciones ──────────────────────────────────────────────── -->
      <section v-if="cv.publications.length" style="margin-bottom:20px;">
        <div class="section-title-modern">{{ t('sections.publications') }}</div>
        <div v-for="pub in cv.publications" :key="pub.id" style="margin-bottom:6px; line-height:1.5;">
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
.section-title-modern {
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1a365d;
  border-bottom: 2px solid #1a365d;
  padding-bottom: 4px;
  margin-bottom: 10px;
  break-after: avoid;
  page-break-after: avoid;
}
li {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
