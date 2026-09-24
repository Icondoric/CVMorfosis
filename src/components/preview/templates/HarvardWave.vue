<template>
  <!-- Harvard Wave — Light blue sidebar with bottom dark blue decorative wave -->
  <div
    class="cv-preview bg-white"
    style="
      width: 816px;
      min-height: 1056px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif;
      font-size: 10.5px;
      color: #1D1D1F;
      display: flex;
      box-sizing: border-box;
      position: relative;
    "
  >
    <!-- ── Left Column (Light Blue Sidebar #EBF3FB) ────────────────────────── -->
    <div
      style="
        width: 250px;
        min-height: 1056px;
        background-color: #EBF3FB;
        color: #1D1D1F;
        padding: 40px 24px 160px 24px;
        flex-shrink: 0;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-col;
        flex-direction: column;
        border-right: 1px solid rgba(0, 0, 0, 0.04);
      "
    >
      <!-- Optional Photo -->
      <div v-if="cv.personal.photo" style="display:flex; justify-content:center; margin-bottom: 24px;">
        <div style="width: 96px; height: 96px; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 2px solid white;">
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

      <!-- Contact Info Section -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; margin-bottom: 12px; border-bottom: 1px solid rgba(26, 54, 93, 0.15); padding-bottom: 4px;">
          Contacto
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 9.5px; color: #334155;">
          <div v-if="displayName" style="font-weight: 600; color: #0F172A; font-size: 10px;">
            {{ displayName }}
          </div>
          <div v-if="cv.personal.email" style="display: flex; align-items: flex-start; gap: 6px; word-break: break-all;">
            <span style="color: #0071E3; font-weight: bold;">@</span>
            <span>{{ cv.personal.email }}</span>
          </div>
          <div v-if="cv.personal.phone" style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #0071E3;">T</span>
            <span>{{ cv.personal.phone }}</span>
          </div>
          <div v-if="displayAddress" style="display: flex; align-items: flex-start; gap: 6px;">
            <span style="color: #0071E3;">D</span>
            <span>{{ displayAddress }}</span>
          </div>
          <div v-if="cv.personal.linkedin" style="display: flex; align-items: flex-start; gap: 6px; word-break: break-all;">
            <span style="color: #0071E3;">in</span>
            <span>{{ cv.personal.linkedin }}</span>
          </div>
          <div v-if="cv.personal.website" style="display: flex; align-items: flex-start; gap: 6px; word-break: break-all;">
            <span style="color: #0071E3;">W</span>
            <span>{{ cv.personal.website }}</span>
          </div>
        </div>
      </div>


      <!-- Skills Section -->
      <div v-if="cv.skills.filter(s => s.trim()).length" style="margin-bottom: 24px;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; margin-bottom: 10px; border-bottom: 1px solid rgba(26, 54, 93, 0.15); padding-bottom: 4px;">
          Habilidades
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div
            v-for="(s, i) in cv.skills.filter(s => s.trim())"
            :key="i"
            style="font-size: 9.5px; color: #334155; padding: 2px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.04);"
          >
            {{ s }}
          </div>
        </div>
      </div>

      <!-- Languages Section -->
      <div v-if="cv.languages.length" style="margin-bottom: 24px;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; margin-bottom: 10px; border-bottom: 1px solid rgba(26, 54, 93, 0.15); padding-bottom: 4px;">
          Idiomas
        </div>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <div v-for="lang in cv.languages" :key="lang.id" style="font-size: 9.5px;">
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
    <div style="flex: 1; padding: 44px 48px; box-sizing: border-box; background: #FFFFFF;">
      <!-- Document Header -->
      <div style="margin-bottom: 24px;">
        <h1
          v-if="displayName"
          style="
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #0F172A;
            margin: 0 0 4px 0;
            line-height: 1.2;
            text-transform: uppercase;
          "
        >
          {{ displayName }}
        </h1>
        <h1
          v-else
          style="
            font-size: 20px;
            font-weight: 600;
            color: #94A3B8;
            margin: 0 0 4px 0;
            font-style: italic;
          "
        >
          Nombre y Apellidos
        </h1>

        <p
          v-if="cv.personal.title"
          style="
            font-size: 13px;
            font-weight: 500;
            color: #0071E3;
            margin: 0;
            letter-spacing: -0.01em;
          "
        >
          {{ cv.personal.title }}
        </p>
        <p
          v-else
          style="
            font-size: 12px;
            color: #CBD5E1;
            margin: 0;
            font-style: italic;
          "
        >
          Puesto de trabajo deseado
        </p>
      </div>

      <!-- ── Perfil Profesional ─────────────────────────────────────────────── -->
      <section v-if="cv.summary" style="margin-bottom: 22px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 8px;">
          Perfil Profesional
        </div>
        <p style="margin: 0; line-height: 1.6; color: #334155; text-align: justify;">
          {{ cv.summary }}
        </p>
      </section>

      <!-- ── Experiencia Profesional ────────────────────────────────────────── -->
      <section v-if="cv.experience.length" style="margin-bottom: 22px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 10px;">
          Experiencia Profesional
        </div>
        <div v-for="exp in cv.experience" :key="exp.id" style="margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; font-size: 11px; color: #0F172A;">{{ exp.company }}</span>
            <span style="font-size: 10px; color: #64748B;">{{ exp.startDate }}<span v-if="exp.endDate"> – {{ exp.endDate }}</span></span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-style: italic; color: #334155; font-size: 10px;">{{ exp.role }}<span v-if="exp.location"> · {{ exp.location }}</span></span>
          </div>
          <ul v-if="exp.bullets.filter(b => b.trim()).length" style="margin: 4px 0 0 16px; padding: 0; list-style-type: disc;">
            <li
              v-for="(b, i) in exp.bullets.filter(b => b.trim())"
              :key="i"
              style="margin-bottom: 3px; line-height: 1.45; color: #334155; text-align: justify;"
            >
              {{ b }}
            </li>
          </ul>
        </div>
      </section>

      <!-- ── Educación / Formación ──────────────────────────────────────────── -->
      <section v-if="cv.education.length" style="margin-bottom: 22px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 10px;">
          Formación Académica
        </div>
        <div v-for="edu in cv.education" :key="edu.id" style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; color: #0F172A;">{{ edu.degree }}<span v-if="edu.field"> en {{ edu.field }}</span></span>
            <span style="font-size: 10px; color: #64748B;">{{ edu.graduationDate }}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-style: italic; color: #334155;">{{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span></span>
            <span v-if="edu.honors" style="font-size: 9.5px; color: #0071E3;">{{ edu.honors }}</span>
          </div>
          <p v-if="edu.thesis" style="margin: 2px 0 0; font-size: 9.5px; color: #64748B;">
            Tesis: <em>{{ edu.thesis }}</em>
          </p>
        </div>
      </section>

      <!-- ── Logros Destacados ──────────────────────────────────────────────── -->
      <section v-if="cv.achievements.length" style="margin-bottom: 22px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1A365D; border-bottom: 1.5px solid #1A365D; padding-bottom: 3px; margin-bottom: 8px;">
          Logros Destacados
        </div>
        <div v-for="ach in cv.achievements" :key="ach.id" style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; color: #0F172A;">{{ ach.organization }}</span>
            <span style="font-size: 10px; color: #64748B;">{{ ach.year }}</span>
          </div>
          <p style="margin: 0; font-style: italic; color: #334155;">{{ ach.title }}</p>
          <p v-if="ach.description" style="margin: 2px 0 0; color: #475569; line-height: 1.4;">{{ ach.description }}</p>
        </div>
      </section>

      <!-- Empty state placeholder if document is waiting for content -->
      <div
        v-if="!cv.summary && !cv.experience.length && !cv.education.length && !cv.achievements.length"
        style="
          border: 1.5px dashed #E2E8F0;
          border-radius: 16px;
          padding: 48px 24px;
          text-align: center;
          color: #94A3B8;
          margin-top: 36px;
        "
      >
        <p style="font-size: 12px; margin: 0 0 6px 0; font-weight: 500;">
          Esperando contenido del editor...
        </p>
        <p style="font-size: 11px; margin: 0; color: #CBD5E1;">
          Rellena tus datos personales, perfil y experiencia en el panel izquierdo para ver tu currículum cobrar vida en tiempo real.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCVStore } from '@/stores/cvStore'
import { storeToRefs } from 'pinia'

const store = useCVStore()
const { cv } = storeToRefs(store)

const displayName = computed(() => cv.value.personal.fullName)
const displayAddress = computed(() => cv.value.personal.location)
</script>
