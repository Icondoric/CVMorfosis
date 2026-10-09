# CVMorfosis

Generador de currículum vitae profesional, con formato Harvard y pensado para superar los sistemas de filtrado de candidatos (ATS, *Applicant Tracking Systems*).

El usuario completa un formulario por pasos, ve el resultado en una vista previa en vivo y lo descarga en **PDF** o en **Word (.docx) editable**. Todo se guarda automáticamente en el navegador.

La aplicación está construida con Vue 3, Vite y Tailwind CSS. Un servicio en Node.js con Puppeteer genera los PDF; los archivos de Word se generan en el propio navegador.

---

## Requisitos Previos

* **Node.js:** versión `^22.18.0` o `>=24.12.0`
* **Navegador web compatible:** Google Chrome, Microsoft Edge, Mozilla Firefox o Safari

---

## Instalación y Ejecución

### 1. Instalación de dependencias

```bash
npm install
```

> [!NOTE]
> Durante la instalación, Puppeteer descarga la versión de Chromium que necesita para generar los PDF.

### 2. Ejecución en entorno de desarrollo

La exportación a PDF necesita que estén en marcha tanto el cliente web como el servicio de PDF. El siguiente comando inicia ambos:

```bash
npm run dev:all
```

* **Interfaz de usuario (Vite):** http://localhost:5173
* **Servicio de PDF (Express / Puppeteer):** http://localhost:3001

> [!IMPORTANT]
> Con `npm run dev` solo se inicia la interfaz: la exportación a PDF fallará. La exportación a Word sí funciona, porque no usa el servicio. Para ejecutar los procesos por separado, utilice dos terminales:
> * Terminal 1: `npm run dev`
> * Terminal 2: `npm run server`

> [!NOTE]
> El servicio de PDF no se recarga solo. Tras modificar `server/index.ts`, reinicie `npm run server`.

---

## Características

### Plantillas

| Plantilla | Diseño | Apta para ATS |
| :--- | :--- | :---: |
| **Clásico** | Una columna, sobrio, encabezado centrado | Sí |
| **Ejecutivo** | Una columna con banda de color en el encabezado | Sí |
| **Minimalista** | Una columna, nombre grande y títulos sobre el contenido | Sí |
| **Minimalista lateral** | Títulos de sección en una columna a la izquierda | |
| **Lateral azul** | Dos columnas con barra lateral azul | |
| **Lateral oscuro** | Dos columnas con barra lateral oscura y fotografía | |
| **Ondas** | Dos columnas con barra lateral clara y fotografía | |

Las plantillas de una columna son las que los ATS leen con más fiabilidad; en el selector aparecen primero y con la etiqueta "ATS".

Además existe la **Versión ATS**: una plantilla lineal, sin columnas, tablas, iconos ni imágenes, que se descarga con su propio botón desde cualquier diseño.

### Exportación

* **PDF:** se genera con un navegador sin interfaz a partir del mismo documento que muestra la vista previa. Texto real y seleccionable, estructura etiquetada, enlaces, idioma y título del documento.
* **Word (.docx):** se construye a partir de los datos del CV con estructuras nativas de Word (estilos de título, viñetas reales, tabulaciones, enlaces), por lo que es editable. Disponible para las siete plantillas y la Versión ATS.

### Vista previa fiel al PDF

La vista previa reparte el contenido en hojas con las mismas reglas que el PDF: los títulos no se separan de su contenido y no queda una viñeta suelta a ningún lado de un salto de página. El PDF es un corte exacto, hoja por hoja, de lo que se ve en pantalla.

### Apariencia del documento

* **Formato de hoja:** Carta, A4 u Oficio.
* **Fuente:** nueve familias, con equivalentes web para que el PDF sea igual en cualquier sistema.
* **Tamaño de letra:** de 9 a 13 px; todos los textos de la plantilla escalan de forma proporcional.

### Editor

* Formulario por pasos en el mismo orden que el CV, con indicador de qué secciones están completas.
* Reordenar y eliminar entradas, con opción de deshacer.
* Fechas guiadas (`MM/AAAA`), niveles de idioma estándar y entrada rápida de habilidades (acepta listas pegadas).
* Fotografía opcional, reducida automáticamente al subirla.

### Otras capacidades

* **Bilingüe:** interfaz y plantillas en español e inglés.
* **Guardado automático:** los datos se conservan en `localStorage`; no hay cuentas ni servidor de datos.

---

## Referencia de Scripts

| Comando | Función |
| :--- | :--- |
| `npm run dev:all` | Inicia a la vez el cliente Vite y el servicio de PDF. |
| `npm run dev` | Inicia únicamente el cliente web. |
| `npm run server` | Inicia el servicio de PDF en el puerto 3001. |
| `npm run build` | Valida los tipos (`vue-tsc`) y compila para producción. |
| `npm run preview` | Sirve localmente la compilación de producción. |
| `npm run lint` | Ejecuta el análisis estático con Oxlint y ESLint. |
| `npm run format` | Aplica el formato de código con Prettier. |

---

## Arquitectura del Proyecto

```text
cvjob/
├── server/
│   └── index.ts               # Servicio Express + Puppeteer que genera los PDF
├── src/
│   ├── assets/                # Estilos globales
│   ├── components/
│   │   ├── editor/            # Formulario: panel de pasos y una sección por archivo
│   │   ├── preview/           # Vista previa, selector de plantillas y barra de apariencia
│   │   │   └── templates/     # Plantillas del CV y Versión ATS
│   │   └── ui/                # Componentes reutilizables (campos, menús, modales)
│   ├── composables/
│   │   ├── usePagination.ts       # Reparto del CV en hojas (vista previa y PDF)
│   │   ├── useTypographyStyles.ts # Fuente, tamaño y formato de hoja
│   │   ├── usePDFExport.ts        # Cliente del servicio de PDF
│   │   └── useDocxExport.ts       # Descarga del archivo de Word
│   ├── docx/                  # Construcción de los .docx, un constructor por diseño
│   ├── i18n/                  # Traducciones (es.json, en.json)
│   ├── router/                # Rutas (inicio y editor)
│   ├── stores/                # Estado del CV con Pinia y guardado automático
│   ├── types/                 # Tipos del CV, fuentes, hojas y márgenes
│   ├── utils/                 # Fechas, nombres de archivo, imágenes y enlaces
│   ├── views/                 # Páginas: inicio y editor
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
└── vite.config.ts
```

### Cómo se mantienen iguales la vista previa y el PDF

1. `usePagination.ts` recorre el CV en el navegador y, cuando un bloque caería sobre el borde de una hoja, lo baja a la siguiente dejando libre el margen.
2. El servicio de PDF recibe ese mismo HTML y lo imprime sin márgenes de página.
3. Cada página del PDF resulta ser un corte exacto de la vista previa.

Los tamaños de hoja y los márgenes están definidos una sola vez, en `src/types/cv.types.ts`, y los usan las plantillas, la vista previa, el servicio de PDF y la exportación a Word.

---

## Limitaciones Conocidas

### Despliegue

El proyecto está preparado para ejecutarse en local. Antes de desplegarlo hay que resolver:

* **Direcciones fijas:** la URL del servicio de PDF (`src/composables/usePDFExport.ts`) y el puerto y origen permitido del servicio (`server/index.ts`) apuntan a `localhost`. Deben pasar a variables de entorno.
* **Fuentes en Linux:** Verdana y Trebuchet MS no tienen equivalente web de métricas idénticas. En un servidor Linux hay que instalarlas (por ejemplo con el paquete `ttf-mscorefonts-installer`) o el PDF usará una fuente parecida.

### Exportación a Word

* Word decide por su cuenta los saltos de página, que pueden diferir en alguna línea de los de la vista previa.
* Las fuentes web (Inter, Lora, EB Garamond) se sustituyen por Calibri, Georgia y Garamond.
* En las plantillas de barra lateral se omite la decoración sin equivalente editable: iconos de contacto, etiquetas redondeadas, barras de nivel de idioma y la ola de Ondas.
* Las plantillas de dos columnas usan tablas. Para un filtro ATS estricto, las opciones más seguras en Word son la **Versión ATS** y **Clásico**, que no usan ninguna.
