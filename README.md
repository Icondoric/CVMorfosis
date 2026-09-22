# CVJob

Generador de Currículum Vitae profesional basado en el estándar de formato Harvard y optimizado para sistemas de seguimiento de candidatos (ATS - Applicant Tracking Systems).

La solución está construida con Vue 3, Vite y Tailwind CSS en el cliente, complementada con un servicio backend en Node.js y Puppeteer para renderizado y exportación de documentos PDF de alta precisión.

---

## Requisitos Previos

* **Node.js:** Versión `^22.18.0` o `>=24.12.0`
* **Navegador web compatible:** Google Chrome, Microsoft Edge, Mozilla Firefox o Safari

---

## Instalación y Configuración

### 1. Instalación de dependencias

Instale los paquetes requeridos por el cliente y el servidor:

```bash
npm install
```

> [!NOTE]
> Durante la instalación, Puppeteer descargará automáticamente la versión de Chromium necesaria para la generación de documentos PDF.

### 2. Ejecución en entorno de desarrollo

Para el correcto funcionamiento de todas las características, en particular la exportación de documentos PDF, es necesario que tanto el cliente web como el servicio backend se encuentren en ejecución.

Ejecute ambos servicios de forma concurrente con el siguiente comando:

```bash
npm run dev:all
```

* **Interfaz de usuario (Vite):** http://localhost:5173
* **Servicio de generación PDF (Express / Puppeteer):** http://localhost:3001

> [!IMPORTANT]
> Si ejecuta únicamente `npm run dev`, solo se iniciará la interfaz de usuario en el puerto 5173. Cualquier intento de exportar a PDF fallará debido a la falta de comunicación con el servicio en el puerto 3001. Si requiere ejecutar los procesos por separado, utilice dos terminales:
> * Terminal 1: `npm run dev`
> * Terminal 2: `npm run server`

---

## Características Técnicas

### Plantillas Disponibles

* **Harvard Classic:** Diseño sobrio tradicional con tipografía serif y delimitadores horizontales estandarizados.
* **Harvard Modern:** Cabecera con contraste cromático y tipografía sans-serif de alta legibilidad.
* **Harvard Compact:** Estructura en dos columnas con panel lateral orientada a perfiles con alta densidad de datos.
* **Harvard Elegant:** Formato ejecutivo con panel lateral oscuro y descripción de trayectoria en párrafos continuos.
* **Harvard Elegant 2:** Cabecera asimétrica, tipografía jerárquica y soporte para fotografía profesional.
* **Modo ATS (Applicant Tracking Systems):** Plantilla lineal de una sola columna sin elementos gráficos, tablas anidadas ni imágenes, garantizando compatibilidad total con software de lectura y filtrado automatizado.

### Capacidades del Sistema

* **Previsualización WYSIWYG:** Ajuste dinámico de escala que mantiene la proporción real del estándar Letter (816 x 1056 px a 96 DPI).
* **Exportación PDF Vectorial:** Renderizado mediante navegador headless para asegurar fidelidad tipográfica, retención de estilos y saltos de página adecuados.
* **Soporte Bilingüe:** Internacionalización completa de la interfaz y plantillas en Español (ES) e Inglés (EN).
* **Persistencia de Datos:** Almacenamiento local automático mediante `localStorage` para prevenir pérdidas de información.

---

## Referencia de Scripts

| Comando | Función |
| :--- | :--- |
| `npm run dev:all` | Inicia concurrentemente el cliente Vite y el servicio de exportación PDF. |
| `npm run dev` | Inicia únicamente el servidor de desarrollo del cliente web. |
| `npm run server` | Inicia el servicio backend de Puppeteer en el puerto 3001. |
| `npm run build` | Valida tipos de TypeScript (`vue-tsc`) y compila los archivos para producción. |
| `npm run preview` | Sirve localmente los archivos compilados para validación previa a despliegue. |
| `npm run lint` | Ejecuta el análisis estático de código mediante Oxlint y ESLint. |
| `npm run format` | Aplica reglas de formato de código con Prettier. |

---

## Arquitectura del Proyecto

```text
cvjob/
├── server/                    # Servicio backend para renderizado de documentos
│   └── index.ts               # Servidor Express y automatización con Puppeteer
├── src/
│   ├── assets/                # Estilos globales y recursos estáticos
│   ├── components/
│   │   ├── editor/            # Componentes de edición organizados por sección
│   │   └── preview/           # Previsualización interactiva y gestión de plantillas
│   │       └── templates/     # Definición de plantillas visuales y modo ATS
│   ├── composables/           # Lógica reutilizable y clientes de API (usePDFExport.ts)
│   ├── i18n/                  # Archivos de traducción (es.json, en.json)
│   ├── stores/                # Gestión de estado centralizado con Pinia
│   ├── types/                 # Definiciones de tipos e interfaces TypeScript
│   ├── App.vue                # Componente principal de la aplicación
│   └── main.ts                # Punto de entrada de la aplicación
├── package.json               # Configuración del proyecto y dependencias
└── vite.config.ts             # Configuración del empaquetador Vite
```
