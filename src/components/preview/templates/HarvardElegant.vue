<template>
  <!--
    Harvard Elegante — Inspirado en 200-curriculum-vitae-harvard.docx
    Layout: sidebar izquierdo oscuro con contacto + educación,
    panel derecho con perfil, experiencia, habilidades e idiomas.
    Experiencia usa párrafo fluido (no bullets) con formato "Cargo | Fechas".
  -->
  <div class="cv-preview bg-white" style="width:794px; min-height:1123px; font-family: 'Inter', system-ui, sans-serif; font-size: 11px; color: #1a1a1a; display:flex;">

    <!-- ══ SIDEBAR IZQUIERDO ═══════════════════════════════════════════════ -->
    <div style="width:240px; min-height:1123px; background:#2c3e50; color:white; padding:0; flex-shrink:0; display:flex; flex-direction:column;">

      <!-- Header del sidebar: Nombre + cargo + contacto -->
      <div style="background:#1a252f; padding:36px 24px 28px;">
        <!-- Iniciales / Avatar placeholder -->
        <div style="width:72px; height:72px; border-radius:50%; background:#4a90a4; border:3px solid rgba(255,255,255,0.3); margin:0 auto 16px; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:700; color:white; letter-spacing:1px;">
          {{ initials }}
        </div>

        <h1 style="font-size:17px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 4px; text-align:center; color:white; line-height:1.3;">
          {{ cv.personal.fullName || 'NOMBRE APELLIDO' }}
        </h1>
        <p v-if="cv.personal.title" style="font-size:10px; color:#a8c4d4; margin:0; text-align:center; font-weight:400; letter-spacing:0.04em;">
          {{ cv.personal.title }}
        </p>
      </div>

      <!-- Contacto -->
      <div style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div class="sidebar-label">Contacto</div>
        <div v-if="cv.personal.phone" style="margin-bottom:6px; font-size:9.5px; color:#c8dae4; display:flex; align-items:flex-start; gap:6px;">
          <span style="opacity:0.6; flex-shrink:0;">📞</span>
          <span>{{ cv.personal.phone }}</span>
        </div>
        <div v-if="cv.personal.location" style="margin-bottom:6px; font-size:9.5px; color:#c8dae4; display:flex; align-items:flex-start; gap:6px;">
          <span style="opacity:0.6; flex-shrink:0;">📍</span>
          <span>{{ cv.personal.location }}</span>
        </div>
        <div v-if="cv.personal.email" style="margin-bottom:6px; font-size:9px; color:#c8dae4; display:flex; align-items:flex-start; gap:6px; word-break:break-all;">
          <span style="opacity:0.6; flex-shrink:0;">✉</span>
          <span>{{ cv.personal.email }}</span>
        </div>
        <div v-if="cv.personal.linkedin" style="font-size:8.5px; color:#a8c4d4; display:flex; align-items:flex-start; gap:6px; word-break:break-all;">
          <span style="opacity:0.6; flex-shrink:0;">🔗</span>
          <span>{{ cv.personal.linkedin }}</span>
        </div>
      </div>

      <!-- Educación en sidebar -->
      <div v-if="cv.education.length" style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div class="sidebar-label">{{ t('sections.education') }}</div>
        <div v-for="edu in cv.education" :key="edu.id" style="margin-bottom:12px;">
          <p style="font-size:10px; font-weight:600; color:white; margin:0 0 2px;">{{ edu.degree }}</p>
          <p v-if="edu.field" style="font-size:9px; color:#a8c4d4; margin:0 0 2px;">{{ edu.field }}</p>
          <p style="font-size:9px; color:#7fa8be; margin:0;">
            {{ edu.institution }}
            <span v-if="edu.graduationDate"> | {{ edu.graduationDate }}</span>
            <span v-if="edu.location">, {{ edu.location }}</span>
          </p>
          <p v-if="edu.honors" style="font-size:8.5px; color:#4a90a4; margin:2px 0 0; font-style:italic;">{{ edu.honors }}</p>
        </div>
      </div>

      <!-- Programas en sidebar -->
      <div v-if="cv.programs.filter(p=>p.trim()).length" style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div class="sidebar-label">{{ t('sections.programs') }}</div>
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:4px;">
          <span
            v-for="(p, i) in cv.programs.filter(p=>p.trim())"
            :key="i"
            style="background:rgba(74,144,164,0.3); color:#c8dae4; padding:3px 8px; border-radius:3px; font-size:8.5px;"
          >{{ p }}</span>
        </div>
      </div>

      <!-- Idiomas en sidebar -->
      <div v-if="cv.languages.length" style="padding:20px 24px;">
        <div class="sidebar-label">{{ t('sections.languages') }}</div>
        <div v-for="lang in cv.languages" :key="lang.id" style="margin-bottom:7px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
            <span style="font-size:9.5px; font-weight:600; color:white;">{{ lang.name }}</span>
            <span style="font-size:8.5px; color:#a8c4d4;">{{ lang.level }}</span>
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
        <p style="margin:0; line-height:1.65; color:#333; text-align:justify; font-size:10.5px;">{{ cv.summary }}</p>
      </section>

      <!-- EXPERIENCIA PROFESIONAL -->
      <section v-if="cv.experience.length" style="margin-bottom:22px;">
        <div class="main-section-title">{{ t('sections.experience') }}</div>
        <div v-for="exp in cv.experience" :key="exp.id" style="margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:1px;">
            <span style="font-weight:700; font-size:11px;">{{ exp.company }}</span>
          </div>
          <p style="margin:0 0 4px; font-size:10px; color:#4a90a4; font-weight:600;">
            {{ exp.role }}<span v-if="exp.startDate || exp.endDate"> | {{ exp.startDate }}<span v-if="exp.endDate"> - {{ exp.endDate }}</span></span>
            <span v-if="exp.location" style="color:#888; font-weight:400;"> · {{ exp.location }}</span>
          </p>
          <!-- Bullets o párrafo -->
          <ul v-if="exp.bullets.filter(b=>b.trim()).length" style="margin:2px 0 0 14px; padding:0; list-style-type:disc;">
            <li
              v-for="(b, i) in exp.bullets.filter(b=>b.trim())"
              :key="i"
              style="margin-bottom:2px; line-height:1.5; color:#333; font-size:10.5px; text-align: justify;"
            >{{ b }}</li>
          </ul>
        </div>
      </section>

      <!-- HABILIDADES -->
      <section v-if="cv.skills.filter(s=>s.trim()).length" style="margin-bottom:22px;">
        <div class="main-section-title">{{ t('sections.skills') }}</div>
        <p style="margin:0; color:#333; line-height:1.7; font-size:10.5px;">
          {{ cv.skills.filter(s=>s.trim()).join(' | ') }}
        </p>
      </section>

      <!-- LOGROS DESTACADOS -->
      <section v-if="cv.achievements.length" style="margin-bottom:22px;">
        <div class="main-section-title">{{ t('sections.achievements') }}</div>
        <div v-for="ach in cv.achievements" :key="ach.id" style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span style="font-weight:700; font-size:11px;">{{ ach.organization }}</span>
            <span style="font-size:9.5px; color:#888;">{{ ach.year }}</span>
          </div>
          <p style="margin:1px 0 2px; font-style:italic; color:#4a90a4; font-size:10px;">{{ ach.title }}</p>
          <p v-if="ach.description" style="margin:0; color:#444; line-height:1.5; font-size:10px;">{{ ach.description }}</p>
        </div>
      </section>

      <!-- PUBLICACIONES -->
      <section v-if="cv.publications.length">
        <div class="main-section-title">{{ t('sections.publications') }}</div>
        <div v-for="pub in cv.publications" :key="pub.id" style="margin-bottom:6px; line-height:1.5; font-size:10px; color:#333;">
          {{ pub.authors }} ({{ pub.year }}). <em>{{ pub.title }}</em>. {{ pub.journal }}<span v-if="pub.doi">. DOI: {{ pub.doi }}</span>.
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const store = useCVStore()
const { cv } = storeToRefs(store)

// Generate initials from fullName
const initials = computed(() => {
  const parts = cv.value.personal.fullName.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase()
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase() || '?'
})

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
  font-size: 8.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #4a90a4;
  margin-bottom: 10px;
}

.main-section-title {
  font-weight: 700;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #2c3e50;
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 4px;
  margin-bottom: 10px;
}
</style>
