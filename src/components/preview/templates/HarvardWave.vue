<template>
  <!-- Harvard Wave — Light blue sidebar with bottom dark blue decorative wave -->
  <div
    class="cv-preview bg-white"
    :style="[
      {
        color: '#1D1D1F',
        display: 'flex',
        boxSizing: 'border-box',
        position: 'relative',
      },
      cssVars,
    ]"
  >
    <!-- ── Left Column (Light Blue Sidebar #EBF3FB) ────────────────────────── -->
    <div
      :style="{
        width: '250px',
        minHeight: pageConfig.heightPx + 'px',
        backgroundColor: '#EBF3FB',
        color: '#1D1D1F',
        padding: '40px 24px 160px 24px',
        flexShrink: '0',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(0,0,0,0.04)',
      }"
    >
      <!-- Optional Photo -->
      <div v-if="cv.personal.photo" style="display:flex; justify-content:center; margin-bottom: 24px;">
        <div style="width: 96px; height: 96px; border-radius: 20px; overflow: hidden; border: 2px solid white;">
          <img
            :src="cv.personal.photo"
            alt="Foto de perfil del postulante"
            width="96"
            height="96"
            loading="lazy"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>
      </div>

      <!-- Name + title: first text of the document (what résumé parsers expect) -->
      <div style="margin-bottom: 22px;">
        <h1
          v-if="displayName"
          style="font-size: calc(19px * var(--cv-scale, 1)); font-weight: 700; letter-spacing: -0.01em; color: #0F172A; margin: 0 0 5px 0; line-height: 1.2; text-transform: uppercase;"
        >
          {{ displayName }}
        </h1>
        <h1
          v-else
          class="cv-placeholder"
          style="font-size: calc(17px * var(--cv-scale, 1)); font-weight: 600; color: #94A3B8; margin: 0 0 5px 0; font-style: italic;"
        >
          Nombre y Apellidos
        </h1>
        <p
          v-if="cv.personal.title"
          style="font-size: calc(11px * var(--cv-scale, 1)); font-weight: 500; color: #0071E3; margin: 0; line-height: 1.35;"
        >
          {{ cv.personal.title }}
        </p>
        <p
          v-else
          class="cv-placeholder"
          style="font-size: calc(11px * var(--cv-scale, 1)); color: #94A3B8; margin: 0; font-style: italic;"
        >
          Puesto de trabajo deseado
        </p>
      </div>

      <!-- Contact Info Section -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: calc(10px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; margin-bottom: 12px; border-bottom: 1px solid rgba(26, 54, 93, 0.15); padding-bottom: 4px;">
          {{ t('sections.contact') }}
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: calc(10px * var(--cv-scale, 1)); color: #334155;">
          <div v-if="cv.personal.email" style="display: flex; align-items: flex-start; gap: 6px; word-break: break-all;">
            <svg style="width:11px; height:11px; flex-shrink:0; margin-top:1px; color:#0071E3;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span><a :href="'mailto:' + cv.personal.email">{{ cv.personal.email }}</a></span>
          </div>
          <div v-if="cv.personal.phone" style="display: flex; align-items: center; gap: 6px;">
            <svg style="width:11px; height:11px; flex-shrink:0; margin-top:1px; color:#0071E3;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>{{ cv.personal.phone }}</span>
          </div>
          <div v-if="displayAddress" style="display: flex; align-items: flex-start; gap: 6px;">
            <svg style="width:11px; height:11px; flex-shrink:0; margin-top:1px; color:#0071E3;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>{{ displayAddress }}</span>
          </div>
          <div v-if="cv.personal.linkedin" style="display: flex; align-items: flex-start; gap: 6px; word-break: break-all;">
            <svg style="width:11px; height:11px; flex-shrink:0; margin-top:1px; color:#0071E3;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span><a :href="toUrl(cv.personal.linkedin)" target="_blank" rel="noopener noreferrer">{{ cv.personal.linkedin }}</a></span>
          </div>
          <div v-if="cv.personal.website" style="display: flex; align-items: flex-start; gap: 6px; word-break: break-all;">
            <svg style="width:11px; height:11px; flex-shrink:0; margin-top:1px; color:#0071E3;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span><a :href="toUrl(cv.personal.website)" target="_blank" rel="noopener noreferrer">{{ cv.personal.website }}</a></span>
          </div>
        </div>
      </div>


      <!-- Skills Section -->
      <div v-if="cv.skills.filter(s => s.trim()).length" style="margin-bottom: 24px;">
        <div style="font-size: calc(10px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; margin-bottom: 10px; border-bottom: 1px solid rgba(26, 54, 93, 0.15); padding-bottom: 4px;">
          {{ t('sections.skills') }}
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div
            v-for="(s, i) in cv.skills.filter(s => s.trim())"
            :key="i"
            style="font-size: calc(10px * var(--cv-scale, 1)); color: #334155; padding: 2px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.04);"
          >
            {{ s }}
          </div>
        </div>
      </div>

      <!-- Technical Skills Section -->
      <div v-if="cv.programs.filter(p => p.trim()).length" style="margin-bottom: 24px;">
        <div style="font-size: calc(10px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; margin-bottom: 10px; border-bottom: 1px solid rgba(26, 54, 93, 0.15); padding-bottom: 4px;">
          {{ t('sections.programs') }}
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div
            v-for="(s, i) in cv.programs.filter(p => p.trim())"
            :key="i"
            style="font-size: calc(10px * var(--cv-scale, 1)); color: #334155; padding: 2px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.04);"
          >
            {{ s }}
          </div>
        </div>
      </div>

      <!-- Languages Section -->
      <div v-if="cv.languages.length" style="margin-bottom: 24px;">
        <div style="font-size: calc(10px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; margin-bottom: 10px; border-bottom: 1px solid rgba(26, 54, 93, 0.15); padding-bottom: 4px;">
          {{ t('sections.languages') }}
        </div>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <div v-for="lang in cv.languages" :key="lang.id" style="font-size: calc(10px * var(--cv-scale, 1));">
            <span style="font-weight: 600; color: #0F172A;">{{ lang.name }}</span>
            <span style="color: #64748B; margin-left: 4px;">({{ lang.level }})</span>
          </div>
        </div>
      </div>

      <!-- ── Decorative Wave Element (Dark Blue #1A365D at bottom of column) ── -->
      <div
        style="
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 140px;
          overflow: hidden;
          pointer-events: none;
        "
      >
        <svg
          viewBox="0 0 250 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;"
          preserveAspectRatio="none"
        >
          <!-- Secondary subtle wave layer -->
          <path
            d="M0,50 C60,10 160,80 250,30 L250,140 L0,140 Z"
            fill="#2A4D7C"
            opacity="0.3"
          />
          <!-- Primary dark blue organic wave -->
          <path
            d="M0,70 C70,30 150,100 250,55 L250,140 L0,140 Z"
            fill="#1A365D"
          />
        </svg>
      </div>
    </div>

    <!-- ── Right Column (Clean White Document Body) ────────────────────────── -->
    <!-- position: relative keeps this column after the (also positioned) sidebar in the PDF text order -->
    <div style="flex: 1; padding: 44px 48px; box-sizing: border-box; background: #FFFFFF; position: relative;">
      <!-- ── Perfil Profesional ─────────────────────────────────────────────── -->
      <section v-if="cv.summary" style="margin-bottom: 22px;">
        <div style="font-size: calc(11px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 8px;">
          {{ t('sections.summary') }}
        </div>
        <p style="margin: 0; line-height: 1.6; color: #334155; text-align: left;">
          {{ cv.summary }}
        </p>
      </section>

      <!-- ── Experiencia Profesional ────────────────────────────────────────── -->
      <section v-if="cv.experience.length" style="margin-bottom: 22px;">
        <div style="font-size: calc(11px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 10px;">
          {{ t('sections.experience') }}
        </div>
        <div v-for="exp in cv.experience" :key="exp.id" style="margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; font-size: calc(11px * var(--cv-scale, 1)); color: #0F172A;">{{ exp.company }}</span>
            <span style="font-size: calc(10px * var(--cv-scale, 1)); color: #64748B;">{{ exp.startDate }}<span v-if="exp.endDate"> - {{ exp.endDate }}</span></span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-style: italic; color: #334155; font-size: calc(10px * var(--cv-scale, 1));">{{ exp.role }}<span v-if="exp.location"> · {{ exp.location }}</span></span>
          </div>
          <ul v-if="exp.bullets.filter(b => b.trim()).length" style="margin: 4px 0 0 16px; padding: 0; list-style-type: disc;">
            <li
              v-for="(b, i) in exp.bullets.filter(b => b.trim())"
              :key="i"
              style="margin-bottom: 3px; line-height: 1.45; color: #334155; text-align: left;"
            >
              {{ b }}
            </li>
          </ul>
        </div>
      </section>

      <!-- ── Educación / Formación ──────────────────────────────────────────── -->
      <section v-if="cv.education.length" style="margin-bottom: 22px;">
        <div style="font-size: calc(11px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 10px;">
          {{ t('sections.education') }}
        </div>
        <div v-for="edu in cv.education" :key="edu.id" style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; color: #0F172A;">{{ edu.degree }}<span v-if="edu.field"> — {{ edu.field }}</span></span>
            <span style="font-size: calc(10px * var(--cv-scale, 1)); color: #64748B;">{{ edu.graduationDate }}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-style: italic; color: #334155;">{{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span></span>
            <span v-if="edu.honors" style="font-size: calc(10px * var(--cv-scale, 1)); color: #0071E3;">{{ edu.honors }}</span>
          </div>
          <p v-if="edu.thesis" style="margin: 2px 0 0; font-size: calc(10px * var(--cv-scale, 1)); color: #64748B;">
            {{ t('preview.thesis') }}: <em>{{ edu.thesis }}</em>
          </p>
        </div>
      </section>

      <!-- ── Logros Destacados ──────────────────────────────────────────────── -->
      <section v-if="cv.achievements.length" style="margin-bottom: 22px;">
        <div style="font-size: calc(11px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 8px;">
          {{ t('sections.achievements') }}
        </div>
        <div v-for="ach in cv.achievements" :key="ach.id" style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; color: #0F172A;">{{ ach.organization }}</span>
            <span style="font-size: calc(10px * var(--cv-scale, 1)); color: #64748B;">{{ ach.year }}</span>
          </div>
          <p style="margin: 0; font-style: italic; color: #334155;">{{ ach.title }}</p>
          <p v-if="ach.description" style="margin: 2px 0 0; color: #475569; line-height: 1.4;">{{ ach.description }}</p>
        </div>
      </section>

      <!-- ── Certificaciones y Cursos ────────────────────────────────────── -->
      <section v-if="cv.certifications && cv.certifications.length" style="margin-bottom: 22px;">
        <div style="font-size: calc(11px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 8px;">
          {{ t('sections.certifications') }}
        </div>
        <div v-for="cert in cv.certifications" :key="cert.id" style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; font-size: calc(10.5px * var(--cv-scale, 1)); color: #0F172A;">{{ cert.name }}</span>
            <span v-if="cert.date" style="font-size: calc(10px * var(--cv-scale, 1)); color: #64748B;">{{ cert.date }}<span v-if="cert.expiration"> - {{ cert.expiration }}</span></span>
          </div>
          <p style="margin: 1px 0 0; font-style: italic; color: #0071E3; font-size: calc(10px * var(--cv-scale, 1));">
            {{ cert.issuer }}<span v-if="cert.credentialId" style="color:#64748B; font-style:normal;"> · ID: {{ cert.credentialId }}</span>
          </p>
          <p v-if="cert.url" style="margin: 1px 0 0; font-size: calc(10px * var(--cv-scale, 1)); color: #64748B; word-break: break-all;">
            <a :href="toUrl(cert.url)" target="_blank" rel="noopener noreferrer">{{ cert.url }}</a>
          </p>
        </div>
      </section>

      <!-- ── Publicaciones ──────────────────────────────────────────────────── -->
      <section v-if="cv.publications.length" style="margin-bottom: 22px;">
        <div style="font-size: calc(11px * var(--cv-scale, 1)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 8px;">
          {{ t('sections.publications') }}
        </div>
        <div v-for="pub in cv.publications" :key="pub.id" style="margin-bottom: 6px; line-height: 1.5; color: #334155;">
          {{ pub.authors }} ({{ pub.year }}). <em>{{ pub.title }}</em>. {{ pub.journal }}<span v-if="pub.doi">. DOI: {{ pub.doi }}</span>.
        </div>
      </section>

      <!-- Empty state placeholder if document is waiting for content -->
      <div
        v-if="!cv.summary && !cv.experience.length && !cv.education.length && !cv.achievements.length && !(cv.certifications && cv.certifications.length) && !cv.publications.length"
        class="cv-placeholder"
        style="
          border: 1.5px dashed #E2E8F0;
          border-radius: 16px;
          padding: 48px 24px;
          text-align: center;
          color: #94A3B8;
          margin-top: 36px;
        "
      >
        <p style="font-size: calc(12px * var(--cv-scale, 1)); margin: 0 0 6px 0; font-weight: 500;">
          Esperando contenido del editor...
        </p>
        <p style="font-size: calc(11px * var(--cv-scale, 1)); margin: 0; color: #CBD5E1;">
          Rellena tus datos personales, perfil y experiencia en el panel izquierdo para ver tu currículum cobrar vida en tiempo real.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'
import { useTypographyStyles } from '@/composables/useTypographyStyles'
import { toUrl } from '@/utils/url'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
const { cssVars, pageConfig } = useTypographyStyles()

const displayName = computed(() => cv.value.personal.fullName)
const displayAddress = computed(() => cv.value.personal.location)
</script>
