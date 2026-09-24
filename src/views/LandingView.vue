<template>
  <div class="min-h-screen bg-[var(--apple-bg)] text-[var(--apple-text-primary)] flex flex-col antialiased selection:bg-[#0071E3]/20 selection:text-[#0071E3]">
    <!-- ── Header / Navbar (Apple Glass Translucent) ────────────────────────── -->
    <header class="apple-glass px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 transition-all">
      <!-- Brand -->
      <router-link to="/" class="flex items-center gap-2.5 flex-shrink-0 group">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071E3] to-[#47A1FF] text-white flex items-center justify-center text-xs shadow-sm font-bold tracking-tight group-hover:scale-105 transition-transform">
          CM
        </div>
        <div class="flex items-baseline gap-1.5">
          <span class="font-semibold text-base sm:text-lg tracking-tight text-[var(--apple-text-primary)]">
            CVMorfosis
          </span>
          <span class="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-black/5 text-[var(--apple-text-secondary)] hidden xs:inline">
            Studio
          </span>
        </div>
      </router-link>

      <!-- Center navigation links (Desktop) -->
      <nav class="hidden md:flex items-center gap-6 text-[13px] font-medium text-[var(--apple-text-secondary)]">
        <a href="#pilares" class="hover:text-[var(--apple-text-primary)] transition-colors">¿Por qué CVMorfosis?</a>
        <a href="#como-funciona" class="hover:text-[var(--apple-text-primary)] transition-colors">Cómo funciona</a>
        <a href="#plantillas" class="hover:text-[var(--apple-text-primary)] transition-colors">Plantillas Harvard</a>
        <a href="#ats" class="hover:text-[var(--apple-text-primary)] transition-colors">Filtros ATS</a>
      </nav>

      <!-- Right actions -->
      <div class="flex items-center gap-2.5 sm:gap-3">
        <!-- Language toggle -->
        <div class="apple-segmented-track hidden sm:flex">
          <button
            v-for="lang in (['es', 'en'] as const)"
            :key="lang"
            @click="switchLanguage(lang)"
            class="apple-segmented-item apple-btn px-2.5 py-1 text-xs"
            :class="{ active: currentLang === lang }"
          >
            {{ lang.toUpperCase() }}
          </button>
        </div>

        <!-- Primary CTA to Editor -->
        <button
          @click="goToEditor()"
          class="apple-btn flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-[0_2px_10px_rgba(0,113,227,0.28)]"
        >
          <span>Crear mi CV</span>
          <AppIcon name="arrowRight" size="xs" />
        </button>
      </div>
    </header>

    <main class="flex-1">
      <!-- ── Hero Section ─────────────────────────────────────────────────── -->
      <section class="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <!-- Background subtle glow spheres -->
        <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#0071E3]/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10"></div>

        <div class="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          <!-- Speed & ATS Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[var(--apple-border)] shadow-sm text-xs font-medium text-[var(--apple-text-secondary)]">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]"></span>
            </span>
            <span class="font-semibold text-[var(--apple-text-primary)]">Sencillo, rápido y conciso</span>
            <span class="text-gray-300">|</span>
            <span class="text-[#0071E3] font-medium flex items-center gap-1">
              <AppIcon name="lightning" size="xs" class="text-amber-500" />
              Listo en minutos
            </span>
          </div>

          <!-- Main Invented Speed Slogan -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--apple-text-primary)] leading-[1.12] max-w-4xl mx-auto">
            De tu experiencia a tu próximo empleo, <span class="bg-gradient-to-r from-[#0071E3] to-[#34C759] bg-clip-text text-transparent">sin rodeos y en minutos</span>.
          </h1>

          <!-- User's Official Pitch & Value Statement -->
          <p class="text-base sm:text-lg lg:text-xl text-[var(--apple-text-secondary)] leading-relaxed max-w-3xl mx-auto font-normal">
            Deja de pelear con formatos complicados y horas de edición. Con <strong class="text-[var(--apple-text-primary)] font-semibold">CVMorfosis</strong>, transformar tu experiencia en un currículum impecable es cuestión de minutos. Una solución rápida, simple y sin rodeos para que dejes de estresarte por el diseño y empieces a postular a los mejores trabajos hoy mismo.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              @click="goToEditor()"
              class="apple-btn w-full sm:w-auto px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-[0_4px_16px_rgba(0,113,227,0.32)] flex items-center justify-center gap-2 group"
            >
              <span>Crear mi CV en minutos</span>
              <AppIcon name="arrowRight" size="sm" class="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              @click="loadSampleAndGo()"
              class="apple-btn w-full sm:w-auto px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-[var(--apple-text-primary)] bg-white border border-[var(--apple-border)] hover:bg-black/[0.02] shadow-sm flex items-center justify-center gap-2"
              title="Carga instantáneamente un perfil directivo de ejemplo para ver cómo queda"
            >
              <AppIcon name="skills" size="sm" class="text-amber-500" />
              <span>Cargar ejemplo ejecutivo en vivo</span>
            </button>
          </div>

          <!-- Micro trust signals -->
          <div class="pt-3 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[var(--apple-text-secondary)]">
            <div class="flex items-center gap-1.5">
              <AppIcon name="checkCircle" size="xs" class="text-[#34C759]" />
              <span>Sin registro ni tarjetas</span>
            </div>
            <div class="flex items-center gap-1.5">
              <AppIcon name="checkCircle" size="xs" class="text-[#34C759]" />
              <span>Formato Carta (Letter) 8.5 × 11"</span>
            </div>
            <div class="flex items-center gap-1.5">
              <AppIcon name="checkCircle" size="xs" class="text-[#34C759]" />
              <span>100% Compatible con filtros ATS</span>
            </div>
            <div class="flex items-center gap-1.5">
              <AppIcon name="checkCircle" size="xs" class="text-[#34C759]" />
              <span>100% Privado en tu navegador</span>
            </div>
          </div>
        </div>

        <!-- ── Interactive Apple Mockup Preview ──────────────────────────── -->
        <div class="max-w-4xl mx-auto mt-12 sm:mt-16">
          <div class="apple-card p-3 sm:p-5 relative overflow-hidden backdrop-blur-xl bg-white/90">
            <!-- Mockup Header Controls -->
            <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--apple-border)]">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#FF5F56]/80"></div>
                <div class="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></div>
                <div class="w-3 h-3 rounded-full bg-[#27C93F]/80"></div>
                <span class="text-xs font-semibold text-[var(--apple-text-secondary)] ml-2">CVMorfosis Studio · Previsualización en Vivo</span>
              </div>

              <!-- Live ATS Badge in Mockup -->
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#34C759]/10 text-[#1e7e34] border border-[#34C759]/25 text-[11px] font-semibold">
                  <AppIcon name="ats" size="xs" />
                  Score ATS: 100% Excelente
                </span>
                <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/5 text-[var(--apple-text-secondary)]">
                  Carta 816 × 1056 px
                </span>
              </div>
            </div>

            <!-- Interactive Template Picker inside hero mockup -->
            <div class="flex items-center justify-center mb-4">
              <div class="apple-segmented-track p-1 flex-wrap gap-1 justify-center">
                <button
                  v-for="t in demoTemplates"
                  :key="t.key"
                  @click="activeDemoTemplate = t.key"
                  class="apple-segmented-item apple-btn px-3 py-1 text-xs flex items-center gap-1.5"
                  :class="{ active: activeDemoTemplate === t.key }"
                >
                  <AppIcon :name="t.icon" size="xs" />
                  <span>{{ t.label }}</span>
                </button>
              </div>
            </div>

            <!-- Stylized Sheet Preview Container -->
            <div class="bg-[var(--apple-bg)] p-4 sm:p-8 rounded-2xl flex justify-center">
              <div class="w-full max-w-[620px] bg-white rounded-lg shadow-xl border border-gray-200/80 p-6 sm:p-8 text-left space-y-4 transition-all duration-300">
                <!-- Header of preview sheet -->
                <div :class="activeDemoTemplate === 'modern' ? 'bg-[#1a365d] text-white p-4 -m-6 sm:-m-8 mb-4 rounded-t-lg' : 'text-center border-b border-gray-200 pb-4'">
                  <div class="flex items-center justify-between" v-if="activeDemoTemplate === 'modern'">
                    <div>
                      <div class="text-base sm:text-lg font-bold tracking-wide uppercase" role="heading" aria-level="3">CARLOS MENDOZA SILVA</div>
                      <p class="text-xs text-blue-200">Director de Operaciones & Estrategia Digital</p>
                    </div>
                    <span class="text-[10px] text-blue-100 bg-white/10 px-2 py-1 rounded">carlos@ejemplo.com · +57 310 555 0192</span>
                  </div>
                  <div v-else>
                    <div class="text-lg sm:text-xl font-bold tracking-widest uppercase font-serif text-gray-900" role="heading" aria-level="3">CARLOS MENDOZA SILVA</div>
                    <p class="text-xs text-gray-600 italic mt-0.5">Director de Operaciones & Transformación Digital</p>
                    <p class="text-[11px] text-gray-500 mt-1">Bogotá, COL · carlos@ejemplo.com · +57 310 555 0192 · linkedin.com/in/carlosmendoza</p>
                  </div>
                </div>

                <!-- Perfil -->
                <div>
                  <div class="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-900 pb-1 mb-1.5" role="heading" aria-level="4">Perfil Profesional</div>
                  <p class="text-[11px] sm:text-xs text-gray-700 leading-relaxed text-justify">
                    Líder ejecutivo con más de 12 años de trayectoria dirigiendo operaciones de alto impacto en sectores financiero y tecnológico. Experto en optimización de procesos (Lean/Six Sigma) y escalamiento de equipos multidisciplinarios.
                  </p>
                </div>

                <!-- Experiencia -->
                <div>
                  <div class="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-900 pb-1 mb-1.5" role="heading" aria-level="4">Experiencia Profesional</div>
                  <div class="space-y-2">
                    <div>
                      <div class="flex justify-between items-baseline text-xs font-bold text-gray-900">
                        <span>NovaTech Global Logistics</span>
                        <span class="text-[11px] font-normal text-gray-500">2020 - Presente</span>
                      </div>
                      <p class="text-[11px] italic text-gray-700">Vicepresidente de Operaciones y Cadena de Suministro</p>
                      <ul class="text-[11px] text-gray-600 list-disc ml-4 space-y-0.5 mt-1">
                        <li>Lideré la reestructuración de la cadena logística en 5 países, reduciendo tiempos de entrega en un 32% y ahorrando $1.8M USD anuales.</li>
                        <li>Implementé automatización inteligente de almacenes aumentando la precisión de inventario al 99.8%.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Bottom CTA overlay -->
                <div class="pt-2 text-center">
                  <button
                    @click="goToEditor()"
                    class="apple-btn inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071E3] hover:underline"
                  >
                    <span>Abrir en el editor para personalizar este diseño</span>
                    <AppIcon name="arrowRight" size="xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Los 3 Pilares: Sencillo, Rápido y Conciso ────────────────────── -->
      <section id="pilares" class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[var(--apple-border)]">
        <div class="max-w-6xl mx-auto">
          <div class="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">Filosofía CVMorfosis</span>
            <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--apple-text-primary)]">
              La fórmula que elimina el estrés del currículum
            </h2>
            <p class="text-sm sm:text-base text-[var(--apple-text-secondary)]">
              Construido específicamente para que nunca más pierdas horas acomodando cuadros de texto en Word o luchando con herramientas complicadas.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <!-- Pilar 1: Sencillo -->
            <div class="apple-card p-6 sm:p-8 space-y-4 relative">
              <div class="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                <AppIcon name="pencil" size="md" />
              </div>
              <div class="space-y-2">
                <h3 class="text-lg sm:text-xl font-bold tracking-tight text-[var(--apple-text-primary)]">1. Sencillo</h3>
                <p class="text-xs sm:text-sm text-[var(--apple-text-secondary)] leading-relaxed">
                  Cero configuraciones tediosas. Rellenas bloques modulares con campos que se expanden automáticamente mientras escribes. La tipografía, los márgenes y las sangrías se alinean solos.
                </p>
              </div>
              <ul class="pt-2 space-y-2 text-xs text-[var(--apple-text-primary)] font-medium">
                <li class="flex items-center gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759]" />
                  <span>Sin batallar con saltos de página partidos</span>
                </li>
                <li class="flex items-center gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759]" />
                  <span>Interfaz táctil y limpia para cualquier pantalla</span>
                </li>
              </ul>
            </div>

            <!-- Pilar 2: Rápido -->
            <div class="apple-card p-6 sm:p-8 space-y-4 relative border-[#0071E3]/30 shadow-md">
              <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AppIcon name="lightning" size="md" />
              </div>
              <div class="space-y-2">
                <h3 class="text-lg sm:text-xl font-bold tracking-tight text-[var(--apple-text-primary)]">2. Rápido</h3>
                <p class="text-xs sm:text-sm text-[var(--apple-text-secondary)] leading-relaxed">
                  Carga un ejemplo ejecutivo estructurado con un solo clic, sustituye tus datos y genera tu PDF en menos de 5 minutos. Sin esperas, sin rodeos y sin registro obligatorio.
                </p>
              </div>
              <ul class="pt-2 space-y-2 text-xs text-[var(--apple-text-primary)] font-medium">
                <li class="flex items-center gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759]" />
                  <span>Carga de ejemplo directivo en 1 clic</span>
                </li>
                <li class="flex items-center gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759]" />
                  <span>Exportación PDF instantánea sin marcas de agua</span>
                </li>
              </ul>
            </div>

            <!-- Pilar 3: Conciso & ATS -->
            <div class="apple-card p-6 sm:p-8 space-y-4 relative">
              <div class="w-12 h-12 rounded-2xl bg-[#34C759]/10 text-[#1e7e34] flex items-center justify-center">
                <AppIcon name="ats" size="md" />
              </div>
              <div class="space-y-2">
                <h3 class="text-lg sm:text-xl font-bold tracking-tight text-[var(--apple-text-primary)]">3. Conciso & ATS</h3>
                <p class="text-xs sm:text-sm text-[var(--apple-text-secondary)] leading-relaxed">
                  Basado en el estándar oficial de la Universidad de Harvard. Cada palabra comunica valor cuantificable y la estructura es 100% legible para los filtros de las mejores empresas.
                </p>
              </div>
              <ul class="pt-2 space-y-2 text-xs text-[var(--apple-text-primary)] font-medium">
                <li class="flex items-center gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759]" />
                  <span>Auditor de calidad ATS en tiempo real</span>
                </li>
                <li class="flex items-center gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759]" />
                  <span>Formato Carta (Letter) estándar internacional</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Cómo Funciona en 3 Pasos ─────────────────────────────────────── -->
      <section id="como-funciona" class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          <div class="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">Paso a paso</span>
            <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--apple-text-primary)]">
              Tu currículum listo en 3 simples pasos
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <!-- Paso 1 -->
            <div class="text-center space-y-3">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-white border border-[var(--apple-border)] shadow-sm flex items-center justify-center text-lg font-bold text-[#0071E3]">
                1
              </div>
              <h3 class="text-base font-bold text-[var(--apple-text-primary)]">Ingresa tu trayectoria</h3>
              <p class="text-xs sm:text-sm text-[var(--apple-text-secondary)] leading-relaxed">
                Completa tus datos en los módulos guiados o presiona "Cargar ejemplo" para partir de una base directiva validada.
              </p>
            </div>

            <!-- Paso 2 -->
            <div class="text-center space-y-3">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-white border border-[var(--apple-border)] shadow-sm flex items-center justify-center text-lg font-bold text-[#0071E3]">
                2
              </div>
              <h3 class="text-base font-bold text-[var(--apple-text-primary)]">Elige tu variante Harvard</h3>
              <p class="text-xs sm:text-sm text-[var(--apple-text-secondary)] leading-relaxed">
                Alterna entre plantillas Clásica, Moderna, Compacta o Elegante con un clic y visualiza el resultado al instante.
              </p>
            </div>

            <!-- Paso 3 -->
            <div class="text-center space-y-3">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-white border border-[var(--apple-border)] shadow-sm flex items-center justify-center text-lg font-bold text-[#0071E3]">
                3
              </div>
              <h3 class="text-base font-bold text-[var(--apple-text-primary)]">Exporta y postula</h3>
              <p class="text-xs sm:text-sm text-[var(--apple-text-secondary)] leading-relaxed">
                Descarga tu PDF vectorial de alta precisión y tu versión ATS pura sin costo, listo para enviar a reclutadores.
              </p>
            </div>
          </div>

          <div class="mt-12 text-center">
            <button
              @click="goToEditor()"
              class="apple-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-sm"
            >
              <span>Comenzar ahora en el editor</span>
              <AppIcon name="arrowRight" size="xs" />
            </button>
          </div>
        </div>
      </section>

      <!-- ── Comparativa: Antes vs Con CVMorfosis ─────────────────────────── -->
      <section class="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[var(--apple-border)]">
        <div class="max-w-4xl mx-auto">
          <div class="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--apple-text-primary)]">
              La diferencia entre perder el tiempo y postular hoy
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tradicional -->
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 text-left">
              <span class="text-xs font-semibold text-red-600 uppercase tracking-wider">El método tradicional (Word / Canva)</span>
              <ul class="space-y-2.5 text-xs sm:text-[13px] text-gray-600">
                <li class="flex items-start gap-2">
                  <span class="text-red-500 font-bold mt-0.5">✕</span>
                  <span>Horas ajustando columnas, márgenes y tipos de letra rotos.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-500 font-bold mt-0.5">✕</span>
                  <span>Plantillas con gráficos y tablas que los filtros ATS no pueden procesar.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-500 font-bold mt-0.5">✕</span>
                  <span>Párrafos que saltan enteros o se cortan al exportar a PDF.</span>
                </li>
              </ul>
            </div>

            <!-- CVMorfosis -->
            <div class="p-6 rounded-2xl bg-[#0071E3]/5 border border-[#0071E3]/20 space-y-3 text-left shadow-sm">
              <span class="text-xs font-semibold text-[#0071E3] uppercase tracking-wider">Con CVMorfosis</span>
              <ul class="space-y-2.5 text-xs sm:text-[13px] text-gray-800">
                <li class="flex items-start gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759] mt-0.5 flex-shrink-0" />
                  <span><strong>Menos de 5 minutos</strong> de principio a fin, sin pelear con el formato.</span>
                </li>
                <li class="flex items-start gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759] mt-0.5 flex-shrink-0" />
                  <span><strong>100% Legible por ATS</strong> (Workday, Taleo, Greenhouse).</span>
                </li>
                <li class="flex items-start gap-2">
                  <AppIcon name="check" size="xs" class="text-[#34C759] mt-0.5 flex-shrink-0" />
                  <span><strong>Corte continuo de página</strong> en tamaño Carta estricto oficial.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Final Call to Action (Apple Glass Banner) ────────────────────── -->
      <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto rounded-3xl bg-gradient-to-tr from-[#1D1D1F] to-[#2c2c2e] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div class="space-y-3 max-w-2xl mx-auto">
            <h2 class="text-2xl sm:text-4xl font-bold tracking-tight">
              Empieza a postular a los mejores trabajos hoy mismo.
            </h2>
            <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
              Transformar tu experiencia en un currículum impecable es cuestión de minutos. Rápido, simple y sin rodeos.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              @click="goToEditor()"
              class="apple-btn w-full sm:w-auto px-8 py-4 rounded-full text-sm sm:text-base font-semibold text-[#1D1D1F] bg-white hover:bg-gray-100 shadow-lg flex items-center justify-center gap-2"
            >
              <span>Abrir CVMorfosis Studio gratis</span>
              <AppIcon name="arrowRight" size="sm" class="text-[#1D1D1F]" />
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- ── Footer ───────────────────────────────────────────────────────── -->
    <footer class="bg-white border-t border-[var(--apple-border)] py-8 px-4 sm:px-8 text-center text-xs text-[var(--apple-text-secondary)] space-y-2">
      <div class="flex items-center justify-center gap-2 font-semibold text-[var(--apple-text-primary)]">
        <div class="w-5 h-5 rounded-md bg-gradient-to-tr from-[#0071E3] to-[#47A1FF] text-white flex items-center justify-center text-[10px] font-bold">
          CM
        </div>
        <span>CVMorfosis Studio</span>
      </div>
      <p>Estándar de formato Harvard Carta (8.5 × 11") optimizado para filtros ATS de reclutamiento.</p>
      <p class="text-[11px] text-[var(--apple-text-tertiary)] pt-1">
        Toda tu información se procesa localmente en tu navegador. Tus datos no se almacenan ni se transfieren a terceros.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCVStore } from '@/stores/cvStore'
import AppIcon from '@/components/ui/AppIcon.vue'

const router = useRouter()
const { locale } = useI18n()
const store = useCVStore()

const currentLang = computed(() => store.cv.meta.language)

function switchLanguage(lang: 'es' | 'en') {
  store.setLanguage(lang)
  locale.value = lang
}

function goToEditor() {
  router.push('/editor')
}

function loadSampleAndGo() {
  store.loadSampleData()
  router.push('/editor')
}

const activeDemoTemplate = ref<'classic' | 'modern' | 'compact' | 'elegant'>('classic')

const demoTemplates = [
  { key: 'classic', label: 'Clásico', icon: 'classic' },
  { key: 'modern', label: 'Moderno', icon: 'modern' },
  { key: 'compact', label: 'Compacto', icon: 'compact' },
  { key: 'elegant', label: 'Elegante', icon: 'elegant' },
] as const
</script>
