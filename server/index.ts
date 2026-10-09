import express, { type Request, type Response } from 'express'
import cors from 'cors'
import puppeteer, { type Browser } from 'puppeteer'
import { PAGE_SIZES } from '../src/types/cv.types'
import { toSafeFilename } from '../src/utils/filename'

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '20mb' }))

// Web fonts for the CV. Keep in sync with the <link> tags in index.html.
const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&family=Carlito:ital,wght@0,400;0,700;1,400;1,700&family=Gelasio:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&display=swap'

interface PdfRequestBody {
  html?: string
  styles?: string
  filename?: string
  pageFormat?: string
  lang?: string
  title?: string
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)

/** Only known paper formats reach Puppeteer; anything else falls back to Letter. */
function resolvePageSize(pageFormat: unknown) {
  return PAGE_SIZES.find(p => p.puppeteerFormat === pageFormat) ?? PAGE_SIZES[0]
}

// ── POST /api/pdf ─────────────────────────────────────────────────────────────
app.post('/api/pdf', async (req: Request, res: Response) => {
  const { html, styles = '', filename = 'cv-harvard', pageFormat, lang, title = 'CV' } = (req.body ?? {}) as PdfRequestBody

  if (!html) return res.status(400).json({ error: 'html is required' })

  const pageSize = resolvePageSize(pageFormat)
  // Declared document language, read by ATS parsers and screen readers
  const htmlLang = lang === 'en' ? 'en' : 'es'

  let browser: Browser | null = null
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    })

    const page = await browser.newPage()

    // Set viewport to exactly match the CV width so layout is identical to screen
    await page.setViewport({ width: pageSize.widthPx, height: pageSize.heightPx, deviceScaleFactor: 1 })

    const fullHtml = `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(String(title).slice(0, 200))}</title>
  <meta name="viewport" content="width=${pageSize.widthPx}, initial-scale=1.0" />

  <!-- Google Fonts (must load before content) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet" />

  <!-- Reset + print accuracy -->
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: ${pageSize.widthPx}px;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    /* Ensure borders and lines always render */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* ── Paginación ───────────────────────────────────────────────────────
     * The browser already split the CV into sheets (usePagination): blocks
     * near a sheet boundary were moved below it with spacers, and the root
     * is exactly N sheets tall. Printing with zero page margins makes every
     * PDF page an exact slice of the preview, so no break rule may move
     * content again here.
     */
    .cv-preview,
    .cv-preview * {
      break-before: auto !important;
      break-after: auto !important;
      break-inside: auto !important;
      orphans: 1 !important;
      widows: 1 !important;
    }

    /* Empty-field hints are a preview aid; hidden (not removed) so the layout the browser paginated is kept */
    .cv-placeholder {
      visibility: hidden !important;
    }

    @page {
      size: ${pageSize.widthPx}px ${pageSize.heightPx}px;
      margin: 0;
    }
  </style>

  <!-- All Vue scoped styles captured from the browser document -->
  <style>${styles}</style>
</head>
<body>
  ${html}
</body>
</html>`

    await page.setContent(fullHtml, {
      waitUntil: 'load',
      timeout: 45000,
    })

    // Wait for web fonts to fully render
    await page.evaluateHandle('document.fonts.ready')

    // Extra settle time for any animations or layout shifts
    await new Promise(r => setTimeout(r, 200))

    const pdfBuffer = await page.pdf({
      width: `${pageSize.widthPx}px`,
      height: `${pageSize.heightPx}px`,
      printBackground: true,
      // Sheet margins live inside the CV itself (see the @page rule above)
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true,
    })

    const safeName = toSafeFilename(String(filename))

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
      'Content-Length': String(pdfBuffer.length),
    })
    return res.end(Buffer.from(pdfBuffer))

  } catch (err) {
    console.error('[PDF server] Error:', err)
    return res.status(500).json({ error: 'PDF generation failed', detail: String(err) })
  } finally {
    if (browser) await browser.close()
  }
})

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true, server: 'PDF Puppeteer' }))

app.listen(PORT, () => {
  console.log(`\n✅ PDF server running at http://localhost:${PORT}\n`)
})
