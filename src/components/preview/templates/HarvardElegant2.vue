<template>
  <!--
    Harvard Elegante 2
    ══════════════════
    · Fuente sans-serif (Inter)
    · Margen superior amplio (área de descanso visual)
    · Cabecera: nombre grande izquierda, contacto en cursiva a la derecha
    · Cuerpo, dos variantes según la prop `stacked`:
        - Elegante 2 (por defecto): título de sección a la izquierda (22%) | contenido (78%)
        - Elegante 3 (stacked): título de sección sobre su contenido, a todo el ancho
    · Separadores: línea gris claro bajo el contenido de cada sección
    · Tipografía jerárquica en gris (oscuro, claro, regular) según nivel
  -->
  <div
    class="cv-preview bg-white"
    :class="{ 'cv2-side': !stacked }"
    :style="[
      {
        padding: '44px 54px 60px 54px',
        color: '#2d2d2d',
        boxSizing: 'border-box'
      },
      cssVars
    ]"
  >

    <!-- ══════════════ CABECERA ══════════════════════════════ -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">

      <!-- LEFT: Photo (optional) + Name + Cargo -->
      <div style="display: flex; align-items: flex-start; gap: 18px; flex: 1; padding-right: 24px;">

        <!-- Foto — borde superior alineado con la primera línea del nombre -->
        <img
          v-if="cv.personal.photo ?? ''"
          :src="cv.personal.photo"
          alt="Foto de perfil"
          style="
            width: 88px;
            height: 88px;
            object-fit: cover;
            border-radius: 4px;
            flex-shrink: 0;
            margin-top: 2px;
            border: 1px solid #ddd;
          "
        />

        <!-- Nombre + Cargo -->
        <div>
          <h1 style="
            font-size: calc(34px * var(--cv-scale, 1));
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin: 0 0 6px 0;
            line-height: 1.15;
            color: #1a1a1a;
            word-break: normal;
            overflow-wrap: normal;
          "><template v-if="cv.personal.fullName">{{ cv.personal.fullName }}</template><span v-else class="cv-placeholder">NOMBRE APELLIDO</span></h1>
          <p v-if="cv.personal.title" style="
            font-size: calc(11px * var(--cv-scale, 1));
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #2d2d2d;
            margin: 0;
          ">
            {{ cv.personal.title }}
          </p>
        </div>
      </div>

      <!-- Bloque de contacto — derecha, cursiva, tamaño pequeño -->
      <div style="
        text-align: right;
        font-style: italic;
        font-size: calc(max(9.5px, var(--cv2-min-size, 0px)) * var(--cv-scale, 1));
        color: #555;
        line-height: 1.7;
        flex-shrink: 0;
        padding-top: 4px;
      ">
        <div v-if="cv.personal.phone">{{ cv.personal.phone }}</div>
        <div v-if="cv.personal.location">{{ cv.personal.location }}</div>
        <div v-if="cv.personal.email" style="color: #3a6fa8;"><a :href="'mailto:' + cv.personal.email">{{ cv.personal.email }}</a></div>
        <div v-if="cv.personal.linkedin" style="color: #3a6fa8; font-size: calc(max(9px, var(--cv2-min-size, 0px)) * var(--cv-scale, 1));"><a :href="toUrl(cv.personal.linkedin)" target="_blank" rel="noopener noreferrer">{{ cv.personal.linkedin }}</a></div>
        <div v-if="cv.personal.website" style="color: #3a6fa8; font-size: calc(max(9px, var(--cv2-min-size, 0px)) * var(--cv-scale, 1));"><a :href="toUrl(cv.personal.website)" target="_blank" rel="noopener noreferrer">{{ cv.personal.website }}</a></div>
      </div>
    </div>

    <!-- Línea divisoria inferior de cabecera -->
    <div style="border-top: 1px solid #bbb; margin-bottom: 22px;"></div>

    <!-- ══════════════ CUERPO ══════════════════ -->

    <!-- PERFIL -->
    <section v-if="cv.summary" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.summary') }}</div>
      <div class="cv2-section-body">
        <p style="margin: 0; line-height: 1.55; color: #333; text-align: justify;">{{ cv.summary }}</p>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- EXPERIENCIA PROFESIONAL -->
    <section v-if="cv.experience.length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.experience') }}</div>
      <div class="cv2-section-body">
        <div
          v-for="(exp, idx) in cv.experience"
          :key="exp.id"
          :style="{ marginBottom: idx < cv.experience.length - 1 ? '14px' : '0' }"
        >
          <div class="cv2-entry-header">
            <!-- Nivel 1: Empresa -->
            <p class="cv2-level1" style="margin: 0 0 1px; font-weight: 700; color: #888; font-size: calc(10.5px * var(--cv-scale, 1));">
              {{ exp.company }}<span v-if="exp.location" class="cv2-level1-meta" style="font-weight: 400; color: #aaa;"> — {{ exp.location }}</span>
            </p>
            <!-- Nivel 2: Cargo | Fechas -->
            <p style="margin: 0 0 4px; font-weight: 700; color: #2d2d2d; font-size: calc(10.5px * var(--cv-scale, 1));">
              {{ exp.role }}<span v-if="exp.startDate || exp.endDate" style="font-weight: 400; color: #2d2d2d;"> | {{ exp.startDate }}<span v-if="exp.endDate"> - {{ exp.endDate }}</span>
              </span>
            </p>
          </div>
          <!-- Nivel 3: Descripción -->
          <ul v-if="exp.bullets.filter(b => b.trim()).length" style="margin: 0; padding-left: 14px; list-style-type: disc;">
            <li
              v-for="(b, i) in exp.bullets.filter(b => b.trim())"
              :key="i"
              style="margin-bottom: 2px; line-height: 1.55; color: #333; font-size: calc(10.5px * var(--cv-scale, 1)); text-align: justify;"
            >{{ b }}</li>
          </ul>
        </div>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- EDUCACIÓN -->
    <section v-if="cv.education.length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.education') }}</div>
      <div class="cv2-section-body">
        <div
          v-for="(edu, idx) in cv.education"
          :key="edu.id"
          :style="{ marginBottom: idx < cv.education.length - 1 ? '14px' : '0' }"
        >
          <div class="cv2-entry-header">
            <!-- Nivel 1: Título -->
            <p class="cv2-level1" style="margin: 0 0 1px; font-weight: 700; color: #888; font-size: calc(10.5px * var(--cv-scale, 1));">{{ edu.degree }}<span v-if="edu.field"> — {{ edu.field }}</span></p>
            <!-- Nivel 2: Institución (cursiva) | Fecha, Ciudad -->
            <p style="margin: 0; font-size: calc(10.5px * var(--cv-scale, 1)); color: #2d2d2d;">
              <em>{{ edu.institution }}</em>
              <span v-if="edu.graduationDate || edu.location">
                &nbsp;|&nbsp;<span style="font-style: normal;">{{ edu.graduationDate }}<span v-if="edu.location">, {{ edu.location }}</span></span>
              </span>
            </p>
          </div>
          <p v-if="edu.honors" style="margin: 2px 0 0; font-size: calc(max(9.5px, var(--cv2-min-size, 0px)) * var(--cv-scale, 1)); color: #888; font-style: italic;">{{ edu.honors }}</p>
          <p v-if="edu.thesis" style="margin: 2px 0 0; font-size: calc(max(9.5px, var(--cv2-min-size, 0px)) * var(--cv-scale, 1)); color: #666;">{{ t('preview.thesis') }}: <em>{{ edu.thesis }}</em></p>
        </div>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- HABILIDADES -->
    <section v-if="cv.skills.filter(s => s.trim()).length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.skills') }}</div>
      <div class="cv2-section-body">
        <p style="margin: 0; line-height: 1.7; color: #333;">
          {{ cv.skills.filter(s => s.trim()).join(' | ') }}
        </p>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- LOGROS DESTACADOS -->
    <section v-if="cv.achievements.length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.achievements') }}</div>
      <div class="cv2-section-body">
        <div
          v-for="(ach, idx) in cv.achievements"
          :key="ach.id"
          :style="{ marginBottom: idx < cv.achievements.length - 1 ? '14px' : '0' }"
        >
          <p class="cv2-level1" style="margin: 0 0 1px; font-weight: 700; color: #888; font-size: calc(10.5px * var(--cv-scale, 1));">
            {{ ach.organization }}<span v-if="ach.year" class="cv2-level1-meta" style="font-weight:400; color:#aaa;"> — {{ ach.year }}</span>
          </p>
          <p style="margin: 0 0 3px; font-weight: 700; color: #2d2d2d; font-size: calc(10.5px * var(--cv-scale, 1));">{{ ach.title }}</p>
          <p v-if="ach.description" style="margin: 0; color: #333; line-height: 1.5; font-size: calc(10.5px * var(--cv-scale, 1));">{{ ach.description }}</p>
        </div>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- COMPETENCIAS TÉCNICAS (PROGRAMAS) -->
    <section v-if="cv.programs.filter(p => p.trim()).length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.programs') }}</div>
      <div class="cv2-section-body">
        <p style="margin: 0; line-height: 1.7; color: #333;">
          {{ cv.programs.filter(p => p.trim()).join(' | ') }}
        </p>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- CERTIFICACIONES Y CURSOS -->
    <section v-if="cv.certifications && cv.certifications.length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.certifications') }}</div>
      <div class="cv2-section-body">
        <div
          v-for="(cert, idx) in cv.certifications"
          :key="cert.id"
          :style="{ marginBottom: idx < cv.certifications.length - 1 ? '12px' : '0' }"
        >
          <p class="cv2-level1" style="margin: 0 0 1px; font-weight: 700; color: #888; font-size: calc(10.5px * var(--cv-scale, 1));">
            {{ cert.issuer }}<span v-if="cert.date" class="cv2-level1-meta" style="font-weight:400; color:#aaa;"> — {{ cert.date }}<span v-if="cert.expiration"> - {{ cert.expiration }}</span></span>
          </p>
          <p style="margin: 0 0 2px; font-weight: 700; color: #2d2d2d; font-size: calc(10.5px * var(--cv-scale, 1));">
            {{ cert.name }}
          </p>
          <p v-if="cert.credentialId || cert.url" style="margin: 0; color: #666; font-size: calc(max(9.5px, var(--cv2-min-size, 0px)) * var(--cv-scale, 1));">
            <span v-if="cert.credentialId">ID: {{ cert.credentialId }}</span>
            <span v-if="cert.credentialId && cert.url"> · </span>
            <span v-if="cert.url" style="color: #3a6fa8;"><a :href="toUrl(cert.url)" target="_blank" rel="noopener noreferrer">{{ cert.url }}</a></span>
          </p>
        </div>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- IDIOMAS -->
    <section v-if="cv.languages.length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.languages') }}</div>
      <div class="cv2-section-body">
        <div style="line-height: 1.6; color: #333;">
          <div v-for="lang in cv.languages" :key="lang.id" style="font-size: calc(10.5px * var(--cv-scale, 1));">
            {{ lang.name }}: {{ lang.level }}
          </div>
        </div>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- PUBLICACIONES -->
    <section v-if="cv.publications.length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.publications') }}</div>
      <div class="cv2-section-body">
        <div
          v-for="(pub, idx) in cv.publications"
          :key="pub.id"
          :style="{ marginBottom: idx < cv.publications.length - 1 ? '8px' : '0', lineHeight: '1.5', fontSize: 'calc(10.5px * var(--cv-scale, 1))', color: '#333' }"
        >
          {{ pub.authors }} ({{ pub.year }}). <em>{{ pub.title }}</em>. {{ pub.journal }}<span v-if="pub.doi">. DOI: {{ pub.doi }}</span>.
        </div>
      </div>
    </section>

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
const { cssVars } = useTypographyStyles()

defineProps<{
  /** Section titles above their content instead of in a left column */
  stacked?: boolean
}>()
</script>

<style scoped>
/* Each section is a title on its own line followed by its content */
.cv2-section {
  display: block;
}

.cv2-section-label {
  font-size: calc(10px * var(--cv-scale, 1));
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 8px;
}

/* Side layout (Elegante 2): titles float in a left column beside the content */
.cv2-side .cv2-section {
  /* Keeps each floated title next to its own content in the PDF text order */
  position: relative;
}

.cv2-side .cv2-section::after {
  content: "";
  display: table;
  clear: both;
}

.cv2-side .cv2-section-label {
  float: left;
  width: 22%;
  /* aligns the label with the first line of content */
  padding-top: 2px;
  padding-right: 20px;
  margin-bottom: 0;
  font-size: calc(max(8.5px, var(--cv2-min-size, 0px)) * var(--cv-scale, 1));
}

.cv2-side .cv2-section-body {
  margin-left: 22%;
}

/* Stacked layout (Elegante 3): readable sizes, stronger entry titles, ragged-right text */
.cv-preview:not(.cv2-side) {
  --cv2-min-size: 10px;
}
.cv-preview:not(.cv2-side) .cv2-level1 {
  color: #444 !important;
}
.cv-preview:not(.cv2-side) .cv2-level1-meta {
  color: #777 !important;
}
.cv-preview:not(.cv2-side) p,
.cv-preview:not(.cv2-side) li {
  text-align: left !important;
}

.cv2-entry-header {
  break-inside: avoid;
  break-after: avoid;
  page-break-after: avoid;
}
li {
  break-inside: avoid;
  page-break-inside: avoid;
}

/*
  Thin gray divider between sections.
  margin-top  = space between last content item and the line
  margin-bottom = space between line and next section's content
*/
.cv2-divider {
  clear: both;
  border: none;
  border-top: 1px solid #d0d0d0;
  margin-top: 12px;
  margin-bottom: 14px;
}
</style>

