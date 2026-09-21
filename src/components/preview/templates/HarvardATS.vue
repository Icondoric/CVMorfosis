<template>
  <!--
    Harvard ATS Export Template
    ════════════════════════════
    · Diseño de UNA SOLA COLUMNA — lectura lineal garantizada
    · Sin foto, sin barras de nivel, sin columnas laterales
    · Contacto debajo del nombre (no flotante a la derecha)
    · Separadores de sección como texto plano (guiones)
    · Fuente sans-serif estándar (Arial)
    · Este template SOLO se usa para la exportación PDF modo ATS.
    · Nunca se muestra al usuario en el preview.
  -->
  <div
    style="
      width: 816px;
      min-height: 1056px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      color: #000000;
      background: #ffffff;
      padding: 40px 54px 50px 54px;
      box-sizing: border-box;
      line-height: 1.5;
    "
  >
    <!-- ══ CABECERA ════════════════════════════════════════════════════ -->
    <!-- Nombre — todo en mayúsculas, negro, grande -->
    <h1 style="
      font-size: 22px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      margin: 0 0 4px 0;
      color: #000;
    ">{{ cv.personal.fullName || 'NOMBRE APELLIDO' }}</h1>

    <!-- Cargo/título debajo del nombre -->
    <p v-if="cv.personal.title" style="font-size: 12px; margin: 0 0 8px 0; color: #000;">
      {{ cv.personal.title }}
    </p>

    <!-- Contacto en una línea separada por guiones — lectura lineal -->
    <p style="font-size: 10.5px; margin: 0 0 4px 0; color: #000;">
      <span v-if="cv.personal.email">{{ cv.personal.email }}</span>
      <span v-if="cv.personal.phone"> | {{ cv.personal.phone }}</span>
      <span v-if="cv.personal.location"> | {{ cv.personal.location }}</span>
      <span v-if="cv.personal.linkedin"> | {{ cv.personal.linkedin }}</span>
      <span v-if="cv.personal.website"> | {{ cv.personal.website }}</span>
    </p>

    <div style="border-top: 1px solid #000; margin: 10px 0 14px;"></div>

    <!-- ══ PERFIL ══════════════════════════════════════════════════════ -->
    <section v-if="cv.summary" style="margin-bottom: 14px;">
      <h2 class="ats-section-title">PERFIL PROFESIONAL</h2>
      <p style="margin: 0; text-align: justify; color: #000;">{{ cv.summary }}</p>
    </section>

    <!-- ══ EXPERIENCIA PROFESIONAL ════════════════════════════════════ -->
    <section v-if="cv.experience.length" style="margin-bottom: 14px;">
      <h2 class="ats-section-title">EXPERIENCIA PROFESIONAL</h2>
      <div
        v-for="exp in cv.experience"
        :key="exp.id"
        class="ats-entry"
        style="margin-bottom: 10px;"
      >
        <div class="ats-entry-header">
          <p style="margin: 0; font-weight: bold; color: #000;">{{ exp.company }}<span v-if="exp.location">, {{ exp.location }}</span></p>
          <p style="margin: 0; font-weight: bold; color: #000;">
            {{ exp.role }}
            <span v-if="exp.startDate || exp.endDate" style="font-weight: normal;">
              — {{ exp.startDate }}<span v-if="exp.endDate"> – {{ exp.endDate }}</span>
            </span>
          </p>
        </div>
        <ul v-if="exp.bullets.filter(b => b.trim()).length" style="margin: 4px 0 0 18px; padding: 0;">
          <li
            v-for="(b, i) in exp.bullets.filter(b => b.trim())"
            :key="i"
            style="margin-bottom: 2px; text-align: justify; color: #000;"
          >{{ b }}</li>
        </ul>
      </div>
    </section>

    <!-- ══ EDUCACIÓN ══════════════════════════════════════════════════ -->
    <section v-if="cv.education.length" style="margin-bottom: 14px;">
      <h2 class="ats-section-title">EDUCACIÓN</h2>
      <div
        v-for="edu in cv.education"
        :key="edu.id"
        class="ats-entry"
        style="margin-bottom: 8px;"
      >
        <div class="ats-entry-header">
          <p style="margin: 0; font-weight: bold; color: #000;">{{ edu.degree }}<span v-if="edu.field"> — {{ edu.field }}</span></p>
          <p style="margin: 0; color: #000;">
            {{ edu.institution }}
            <span v-if="edu.graduationDate"> | {{ edu.graduationDate }}</span>
            <span v-if="edu.location">, {{ edu.location }}</span>
          </p>
        </div>
        <p v-if="edu.honors" style="margin: 0; color: #000; font-style: italic;">{{ edu.honors }}</p>
        <p v-if="edu.thesis" style="margin: 0; color: #000;">Tesis: {{ edu.thesis }}</p>
      </div>
    </section>

    <!-- ══ HABILIDADES ════════════════════════════════════════════════ -->
    <section v-if="cv.skills.filter(s => s.trim()).length" style="margin-bottom: 14px;">
      <h2 class="ats-section-title">HABILIDADES</h2>
      <!-- Listamos cada habilidad en su propia línea — más seguro para ATS que pipe-separated -->
      <ul style="margin: 0 0 0 18px; padding: 0; columns: 2; column-gap: 24px;">
        <li
          v-for="(skill, i) in cv.skills.filter(s => s.trim())"
          :key="i"
          style="margin-bottom: 2px; color: #000; break-inside: avoid;"
        >{{ skill }}</li>
      </ul>
    </section>

    <!-- ══ IDIOMAS ════════════════════════════════════════════════════ -->
    <section v-if="cv.languages.length" style="margin-bottom: 14px;">
      <h2 class="ats-section-title">IDIOMAS</h2>
      <!-- Texto plano — sin barras visuales -->
      <p style="margin: 0; color: #000;">
        <span v-for="(lang, i) in cv.languages" :key="lang.id">
          {{ lang.name }}: {{ lang.level }}<span v-if="i < cv.languages.length - 1"> | </span>
        </span>
      </p>
    </section>

    <!-- ══ PROGRAMAS / SOFTWARE ═══════════════════════════════════════ -->
    <section v-if="cv.programs.filter(p => p.trim()).length" style="margin-bottom: 14px;">
      <h2 class="ats-section-title">HERRAMIENTAS Y SOFTWARE</h2>
      <p style="margin: 0; color: #000;">{{ cv.programs.filter(p => p.trim()).join(', ') }}</p>
    </section>

    <!-- ══ LOGROS DESTACADOS ══════════════════════════════════════════ -->
    <section v-if="cv.achievements.length" style="margin-bottom: 14px;">
      <h2 class="ats-section-title">LOGROS</h2>
      <div
        v-for="ach in cv.achievements"
        :key="ach.id"
        class="ats-entry"
        style="margin-bottom: 6px;"
      >
        <p style="margin: 0; font-weight: bold; color: #000;">
          {{ ach.title }}<span v-if="ach.year"> ({{ ach.year }})</span>
        </p>
        <p v-if="ach.organization" style="margin: 0; color: #000;">{{ ach.organization }}</p>
        <p v-if="ach.description" style="margin: 0; color: #000; text-align: justify;">{{ ach.description }}</p>
      </div>
    </section>

    <!-- ══ PUBLICACIONES ══════════════════════════════════════════════ -->
    <section v-if="cv.publications.length">
      <h2 class="ats-section-title">PUBLICACIONES</h2>
      <div
        v-for="pub in cv.publications"
        :key="pub.id"
        style="margin-bottom: 6px; color: #000;"
      >
        {{ pub.authors }} ({{ pub.year }}). {{ pub.title }}. {{ pub.journal }}<span v-if="pub.doi">. DOI: {{ pub.doi }}</span>.
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'

const store = useCVStore()
const { cv } = storeToRefs(store)
</script>

<style scoped>
.ats-section-title {
  font-size: 11.5px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #000;
  border-bottom: 1px solid #000;
  padding-bottom: 2px;
  margin: 0 0 8px 0;
  break-after: avoid;
  page-break-after: avoid;
}
.ats-entry {
  break-inside: auto;
  page-break-inside: auto;
}
.ats-entry-header {
  break-inside: avoid;
  break-after: avoid;
  page-break-after: avoid;
}
li {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
