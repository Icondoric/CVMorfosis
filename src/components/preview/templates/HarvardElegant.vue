<template>
  <!--
    Harvard Elegante — Inspirado en 200-curriculum-vitae-harvard.docx
    Layout: sidebar izquierdo oscuro con contacto, habilidades (blandas y técnicas) e idiomas;
    panel derecho con perfil, experiencia, educación y el resto de secciones.
    Experiencia usa párrafo fluido (no bullets) con formato "Cargo | Fechas".
  -->
  <div class="cv-preview bg-white" :style="[{ color: '#1a1a1a', display: 'flex', boxSizing: 'border-box' }, cssVars]">

    <!-- ══ SIDEBAR IZQUIERDO ═══════════════════════════════════════════════ -->
    <div :style="{ width: '246px', minHeight: pageConfig.heightPx + 'px', background: '#2c3e50', color: 'white', padding: '0', flexShrink: '0', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }">

      <!-- Header del sidebar: Nombre + cargo + contacto -->
      <div style="background:#1a252f; padding:36px 24px 28px;">
        <!-- Foto del postulante (opcional) -->
        <img
          v-if="cv.personal.photo"
          :src="cv.personal.photo"
          alt=""
          style="display:block; width:88px; height:88px; border-radius:50%; object-fit:cover; border:3px solid rgba(255,255,255,0.3); margin:0 auto 16px;"
        />

        <h1 style="font-size:calc(17px * var(--cv-scale, 1)); font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 4px; text-align:center; color:white; line-height:1.3;">
          <template v-if="cv.personal.fullName">{{ cv.personal.fullName }}</template><span v-else class="cv-placeholder">NOMBRE APELLIDO</span>
        </h1>
        <p v-if="cv.personal.title" style="font-size:calc(10px * var(--cv-scale, 1)); color:#a8c4d4; margin:0; text-align:center; font-weight:400; letter-spacing:0.04em;">
          {{ cv.personal.title }}
        </p>
      </div>

      <!-- Contacto -->
      <div style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div class="sidebar-label">{{ t('sections.contact') }}</div>
        <div v-if="cv.personal.phone" style="margin-bottom:6px; font-size:calc(10px * var(--cv-scale, 1)); color:#c8dae4; display:flex; align-items:center; gap:6px;">
          <svg style="width:11px; height:11px; flex-shrink:0; opacity:0.7;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>{{ cv.personal.phone }}</span>
        </div>
        <div v-if="cv.personal.location" style="margin-bottom:6px; font-size:calc(10px * var(--cv-scale, 1)); color:#c8dae4; display:flex; align-items:center; gap:6px;">
          <svg style="width:11px; height:11px; flex-shrink:0; opacity:0.7;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{{ cv.personal.location }}</span>
        </div>
        <div v-if="cv.personal.email" style="margin-bottom:6px; font-size:calc(10px * var(--cv-scale, 1)); color:#c8dae4; display:flex; align-items:flex-start; gap:6px; word-break:break-all;">
          <svg style="width:11px; height:11px; flex-shrink:0; opacity:0.7; margin-top:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span><a :href="'mailto:' + cv.personal.email">{{ cv.personal.email }}</a></span>
        </div>
        <div v-if="cv.personal.linkedin" style="margin-bottom:6px; font-size:calc(10px * var(--cv-scale, 1)); color:#a8c4d4; display:flex; align-items:flex-start; gap:6px; word-break:break-all;">
          <svg style="width:11px; height:11px; flex-shrink:0; opacity:0.7; margin-top:1px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span><a :href="toUrl(cv.personal.linkedin)" target="_blank" rel="noopener noreferrer">{{ cv.personal.linkedin }}</a></span>
        </div>
        <div v-if="cv.personal.website" style="font-size:calc(10px * var(--cv-scale, 1)); color:#a8c4d4; display:flex; align-items:flex-start; gap:6px; word-break:break-all;">
          <svg style="width:11px; height:11px; flex-shrink:0; opacity:0.7; margin-top:1px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span><a :href="toUrl(cv.personal.website)" target="_blank" rel="noopener noreferrer">{{ cv.personal.website }}</a></span>
        </div>
      </div>

      <!-- Habilidades blandas en sidebar -->
      <div v-if="cv.skills.filter(s=>s.trim()).length" style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div class="sidebar-label">{{ t('sections.skills') }}</div>
        <div
          v-for="(s, i) in cv.skills.filter(s=>s.trim())"
          :key="i"
          style="margin-bottom:5px; font-size:calc(10px * var(--cv-scale, 1)); color:#c8dae4;"
        >{{ s }}</div>
      </div>

      <!-- Programas en sidebar -->
      <div v-if="cv.programs.filter(p=>p.trim()).length" style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div class="sidebar-label">{{ t('sections.programs') }}</div>
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:4px;">
          <span
            v-for="(p, i) in cv.programs.filter(p=>p.trim())"
            :key="i"
            style="background:rgba(74,144,164,0.3); color:#c8dae4; padding:3px 8px; border-radius:3px; font-size:calc(10px * var(--cv-scale, 1));"
          >{{ p }}<span v-if="i < cv.programs.filter(p=>p.trim()).length - 1" class="cv-sep">, </span></span>
        </div>
      </div>

      <!-- Idiomas en sidebar -->
      <div v-if="cv.languages.length" style="padding:20px 24px;">
        <div class="sidebar-label">{{ t('sections.languages') }}</div>
        <div v-for="lang in cv.languages" :key="lang.id" style="margin-bottom:7px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
            <span style="font-size:calc(10px * var(--cv-scale, 1)); font-weight:600; color:white;">{{ lang.name }}</span>
            <span style="font-size:calc(10px * var(--cv-scale, 1)); color:#a8c4d4;">{{ lang.level }}</span>
          </div>
          <!-- Level bar -->
          <div style="height:3px; background:rgba(255,255,255,0.15); border-radius:2px;">
            <div
              :style="{ width: levelPercent(lang.level), background: '#4a90a4', height: '3px', borderRadius: '2px' }"
            ></div>
          </div>
        </div>
      </div>

    </div>

    <!-- ══ CONTENIDO PRINCIPAL ══════════════════════════════════════════════ -->
    <div style="flex:1; padding:40px 40px 36px;">

      <!-- PERFIL -->
      <section v-if="cv.summary" style="margin-bottom:22px;">
        <div class="main-section-title">{{ t('sections.summary') }}</div>
        <p style="margin:0; line-height:1.65; color:#333; text-align: left; font-size:calc(10.5px * var(--cv-scale, 1));">{{ cv.summary }}</p>
      </section>

      <!-- EXPERIENCIA PROFESIONAL -->
      <section v-if="cv.experience.length" style="margin-bottom:22px;">
        <div class="main-section-title">{{ t('sections.experience') }}</div>
        <div v-for="exp in cv.experience" :key="exp.id" style="margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:1px;">
            <span style="font-weight:700; font-size:calc(11px * var(--cv-scale, 1));">{{ exp.company }}</span>
          </div>
          <p style="margin:0 0 4px; font-size:calc(10px * var(--cv-scale, 1)); color:#4a90a4; font-weight:600;">
            {{ exp.role }}<span v-if="exp.startDate || exp.endDate"> | {{ exp.startDate }}<span v-if="exp.endDate"> - {{ exp.endDate }}</span></span>
            <span v-if="exp.location" style="color:#888; font-weight:400;"> · {{ exp.location }}</span>
          </p>
          <!-- Bullets o párrafo -->
          <ul v-if="exp.bullets.filter(b=>b.trim()).length" style="margin:2px 0 0 14px; padding:0; list-style-type:disc;">
            <li
              v-for="(b, i) in exp.bullets.filter(b=>b.trim())"
              :key="i"
              style="margin-bottom:2px; line-height:1.5; color:#333; font-size:calc(10.5px * var(--cv-scale, 1)); text-align: left;"
            >{{ b }}</li>
          </ul>
        </div>
      </section>

      <!-- EDUCACIÓN -->
      <section v-if="cv.education.length" style="margin-bottom:22px;">
        <div class="main-section-title">{{ t('sections.education') }}</div>
        <div v-for="edu in cv.education" :key="edu.id" style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px;">
            <span style="font-weight:700; font-size:calc(11px * var(--cv-scale, 1));">{{ edu.degree }}<span v-if="edu.field"> — {{ edu.field }}</span></span>
            <span v-if="edu.graduationDate" style="font-size:calc(10px * var(--cv-scale, 1)); color:#888; white-space:nowrap; flex-shrink:0;">{{ edu.graduationDate }}</span>
          </div>
          <p style="margin:1px 0 2px; font-style:italic; color:#4a90a4; font-size:calc(10px * var(--cv-scale, 1));">{{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span></p>
          <p v-if="edu.honors" style="margin:0; color:#444; font-size:calc(10px * var(--cv-scale, 1));">{{ edu.honors }}</p>
          <p v-if="edu.thesis" style="margin:0; color:#444; font-size:calc(10px * var(--cv-scale, 1));">{{ t('preview.thesis') }}: <em>{{ edu.thesis }}</em></p>
        </div>
      </section>

      <!-- LOGROS DESTACADOS -->
      <section v-if="cv.achievements.length" style="margin-bottom:22px;">
        <div class="main-section-title">{{ t('sections.achievements') }}</div>
        <div v-for="ach in cv.achievements" :key="ach.id" style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span style="font-weight:700; font-size:calc(11px * var(--cv-scale, 1));">{{ ach.organization }}</span>
            <span style="font-size:calc(10px * var(--cv-scale, 1)); color:#888;">{{ ach.year }}</span>
          </div>
          <p style="margin:1px 0 2px; font-style:italic; color:#4a90a4; font-size:calc(10px * var(--cv-scale, 1));">{{ ach.title }}</p>
          <p v-if="ach.description" style="margin:0; color:#444; line-height:1.5; font-size:calc(10px * var(--cv-scale, 1));">{{ ach.description }}</p>
        </div>
      </section>

      <!-- CERTIFICACIONES Y CURSOS -->
      <section v-if="cv.certifications && cv.certifications.length" style="margin-bottom:22px;">
        <div class="main-section-title">{{ t('sections.certifications') }}</div>
        <div v-for="cert in cv.certifications" :key="cert.id" style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span style="font-weight:700; font-size:calc(11px * var(--cv-scale, 1));">{{ cert.name }}</span>
            <span v-if="cert.date" style="font-size:calc(10px * var(--cv-scale, 1)); color:#888;">{{ cert.date }}<span v-if="cert.expiration"> - {{ cert.expiration }}</span></span>
          </div>
          <p style="margin:1px 0 2px; font-style:italic; color:#4a90a4; font-size:calc(10px * var(--cv-scale, 1));">
            {{ cert.issuer }}<span v-if="cert.credentialId"> | {{ t('preview.credentialId') }}: {{ cert.credentialId }}</span>
          </p>
          <p v-if="cert.url" style="margin:0; color:#555; font-size:calc(10px * var(--cv-scale, 1)); word-break:break-all;"><a :href="toUrl(cert.url)" target="_blank" rel="noopener noreferrer">{{ cert.url }}</a></p>
        </div>
      </section>

      <!-- PUBLICACIONES -->
      <section v-if="cv.publications.length">
        <div class="main-section-title">{{ t('sections.publications') }}</div>
        <div v-for="pub in cv.publications" :key="pub.id" style="margin-bottom:6px; line-height:1.5; font-size:calc(10px * var(--cv-scale, 1)); color:#333;">
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
import { useTypographyStyles } from '@/composables/useTypographyStyles'
import { toUrl } from '@/utils/url'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
const { cssVars, pageConfig } = useTypographyStyles()

// Map language level strings to percentage for bar
function levelPercent(level: string): string {
  const l = level.toLowerCase()
  if (l.includes('nativ') || l.includes('native') || l.includes('c2')) return '100%'
  if (l.includes('c1') || l.includes('avan') || l.includes('advan') || l.includes('profe')) return '85%'
  if (l.includes('b2') || l.includes('inter')) return '65%'
  if (l.includes('b1')) return '50%'
  if (l.includes('a2') || l.includes('bás') || l.includes('basic')) return '35%'
  if (l.includes('a1')) return '20%'
  return '60%'
}
</script>

<style scoped>
.sidebar-label {
  font-size: calc(10px * var(--cv-scale, 1));
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #4a90a4;
  margin-bottom: 10px;
}

.main-section-title {
  font-weight: 700;
  font-size: calc(10.5px * var(--cv-scale, 1));
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #2c3e50;
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 4px;
  margin-bottom: 10px;
}
</style>
