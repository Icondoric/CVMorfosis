<template>
  <!--
    Harvard Elegante 2
    ══════════════════
    · Fuente sans-serif (Inter)
    · Margen superior amplio (área de descanso visual)
    · Cabecera: nombre grande izquierda, contacto en cursiva a la derecha
    · Cuerpo: dos columnas asimétricas — título de sección (20%) | contenido (80%)
    · Separadores: línea gris claro únicamente bajo la columna de contenido
    · Tipografía jerárquica en gris (oscuro, claro, regular) según nivel
  -->
  <div
    class="cv-preview bg-white"
    style="
      width: 816px;
      min-height: 1056px;
      font-family: 'Inter', 'Segoe UI', Arial, Helvetica, sans-serif;
      font-size: 10.5px;
      color: #2d2d2d;
      padding: 0 54px 60px 54px;
      box-sizing: border-box;
    "
  >

    <!-- ══════════════ MARGEN SUPERIOR EN BLANCO ══════════════ -->
    <div style="height: 46px;"></div>

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
            font-size: 34px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin: 0 0 6px 0;
            line-height: 1.15;
            color: #1a1a1a;
            word-break: normal;
            overflow-wrap: normal;
          ">{{ cv.personal.fullName || 'NOMBRE APELLIDO' }}</h1>
          <p v-if="cv.personal.title" style="
            font-size: 11px;
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
        font-size: 9.5px;
        color: #555;
        line-height: 1.7;
        flex-shrink: 0;
        padding-top: 4px;
      ">
        <div v-if="cv.personal.phone">{{ cv.personal.phone }}</div>
        <div v-if="cv.personal.location">{{ cv.personal.location }}</div>
        <div v-if="cv.personal.email" style="color: #3a6fa8;">{{ cv.personal.email }}</div>
        <div v-if="cv.personal.linkedin" style="color: #3a6fa8; font-size: 9px;">{{ cv.personal.linkedin }}</div>
        <div v-if="cv.personal.website" style="color: #3a6fa8; font-size: 9px;">{{ cv.personal.website }}</div>
      </div>
    </div>

    <!-- Línea divisoria inferior de cabecera -->
    <div style="border-top: 1px solid #bbb; margin-bottom: 22px;"></div>

    <!-- ══════════════ CUERPO: DOS COLUMNAS ══════════════════ -->

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
            <p style="margin: 0 0 1px; font-weight: 700; color: #888; font-size: 10.5px;">
              {{ exp.company }}<span v-if="exp.location" style="font-weight: 400; color: #aaa;"> — {{ exp.location }}</span>
            </p>
            <!-- Nivel 2: Cargo | Fechas -->
            <p style="margin: 0 0 4px; font-weight: 700; color: #2d2d2d; font-size: 10.5px;">
              {{ exp.role }}
              <span v-if="exp.startDate || exp.endDate" style="font-weight: 400; color: #2d2d2d;">
                &nbsp;|&nbsp;{{ exp.startDate }}<span v-if="exp.endDate"> – {{ exp.endDate }}</span>
              </span>
            </p>
          </div>
          <!-- Nivel 3: Descripción -->
          <ul v-if="exp.bullets.filter(b => b.trim()).length" style="margin: 0; padding-left: 14px; list-style-type: disc;">
            <li
              v-for="(b, i) in exp.bullets.filter(b => b.trim())"
              :key="i"
              style="margin-bottom: 2px; line-height: 1.55; color: #333; font-size: 10.5px; text-align: justify;"
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
            <p style="margin: 0 0 1px; font-weight: 700; color: #888; font-size: 10.5px;">{{ edu.degree }}<span v-if="edu.field"> — {{ edu.field }}</span></p>
            <!-- Nivel 2: Institución (cursiva) | Fecha, Ciudad -->
            <p style="margin: 0; font-size: 10.5px; color: #2d2d2d;">
              <em>{{ edu.institution }}</em>
              <span v-if="edu.graduationDate || edu.location">
                &nbsp;|&nbsp;<span style="font-style: normal;">{{ edu.graduationDate }}<span v-if="edu.location">, {{ edu.location }}</span></span>
              </span>
            </p>
          </div>
          <p v-if="edu.honors" style="margin: 2px 0 0; font-size: 9.5px; color: #888; font-style: italic;">{{ edu.honors }}</p>
          <p v-if="edu.thesis" style="margin: 2px 0 0; font-size: 9.5px; color: #666;">Tesis: <em>{{ edu.thesis }}</em></p>
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
          <p style="margin: 0 0 1px; font-weight: 700; color: #888; font-size: 10.5px;">
            {{ ach.organization }}<span v-if="ach.year" style="font-weight:400; color:#aaa;"> — {{ ach.year }}</span>
          </p>
          <p style="margin: 0 0 3px; font-weight: 700; color: #2d2d2d; font-size: 10.5px;">{{ ach.title }}</p>
          <p v-if="ach.description" style="margin: 0; color: #333; line-height: 1.5; font-size: 10.5px;">{{ ach.description }}</p>
        </div>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- PROGRAMAS Y SOFTWARE -->
    <section v-if="cv.programs.filter(p => p.trim()).length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.programs') }}</div>
      <div class="cv2-section-body">
        <p style="margin: 0; line-height: 1.7; color: #333;">
          {{ cv.programs.filter(p => p.trim()).join(' | ') }}
        </p>
        <div class="cv2-divider"></div>
      </div>
    </section>

    <!-- IDIOMAS -->
    <section v-if="cv.languages.length" class="cv2-section">
      <div class="cv2-section-label">{{ t('sections.languages') }}</div>
      <div class="cv2-section-body">
        <div style="line-height: 1.6; color: #333;">
          <div v-for="lang in cv.languages" :key="lang.id" style="font-size: 10.5px;">
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
          :style="{ marginBottom: idx < cv.publications.length - 1 ? '8px' : '0', lineHeight: '1.5', fontSize: '10.5px', color: '#333' }"
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

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)
</script>

<style scoped>
/* ── Two-column section row — Flowing Block (permite saltos de página continuos) ── */
.cv2-section {
  display: block;
  position: relative;
  break-inside: auto;
  page-break-inside: auto;
}
.cv2-section::after {
  content: "";
  display: table;
  clear: both;
}

/* Left column: section title label — 22% width floated left */
/* padding-top aligns label baseline with first line of content text */
.cv2-section-label {
  float: left;
  width: 22%;
  padding-top: 2px;
  padding-right: 20px;
  font-size: 8.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #1a1a1a;
  line-height: 1.4;
  break-after: avoid;
  page-break-after: avoid;
}

/* Right column: content — 78% width with margin-left */
.cv2-section-body {
  margin-left: 22%;
  break-inside: auto;
  page-break-inside: auto;
}
.cv2-section-body > div {
  break-inside: auto;
  page-break-inside: auto;
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
  Thin gray divider — only spans the right (content) column.
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

