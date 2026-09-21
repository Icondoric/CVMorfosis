import express from 'express'
import cors from 'cors'
import puppeteer from 'puppeteer'

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '20mb' }))

// ── POST /api/pdf ─────────────────────────────────────────────────────────────
app.post('/api/pdf', async (req: any, res: any) => {
  const { html, styles = '', filename = 'cv-harvard' } = req.body as {
    html: string
    styles?: string
    filename?: string
  }

  if (!html) return res.status(400).json({ error: 'html is required' })

  let browser: any = null
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

    // Set viewport to exactly match the CV width so layout is identical to screen (Letter size: 816x1056 px)
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 })

    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=816, initial-scale=1.0" />

  <!-- Google Fonts (must load before content) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />

  <!-- Reset + print accuracy -->
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 816px;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    /* Ensure borders and lines always render */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* ── Entornos continuos y adaptables (permite saltos de página naturales sin saltos en bloque) ── */
    section,
    .cv-preview,
    .cv-preview section,
    .cv-entry,
    .ats-entry,
    .cv2-section,
    .cv2-section-body,
    .cv2-section-body > div {
      break-inside: auto !important;
      page-break-inside: auto !important;
    }

    /* Evitar títulos huérfanos al final de página */
    h1, h2, h3, h4,
    .cv-section-title,
    .ats-section-title,
    .cv2-section-label,
    .cv-entry-header,
    .cv2-entry-header,
    .ats-entry-header {
      break-after: avoid !important;
      page-break-after: avoid !important;
    }

    /* Viñetas e ítems atómicos: no se parten por la mitad de una línea */
    li,
    tr {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    p {
      orphans: 2;
      widows: 2;
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
      waitUntil: 'networkidle0',
      timeout: 45000,
    })

    // Wait for web fonts to fully render
    await page.evaluateHandle('document.fonts.ready')

    // Extra settle time for any animations or layout shifts
    await new Promise(r => setTimeout(r, 200))

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      // Margen superior de 10mm (garantiza respiro en página 2+) y margen inferior de 14mm (~53px de espacio formal al pie)
      margin: { top: '10mm', right: '0mm', bottom: '14mm', left: '0mm' },
      preferCSSPageSize: false,
    })

    const safeName = (filename as string).replace(/[^a-z0-9_-]/gi, '_').toLowerCase()

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

app.get('/health', (_req: any, res: any) => res.json({ ok: true, server: 'PDF Puppeteer' }))

app.listen(PORT, () => {
  console.log(`\n✅ PDF server running at http://localhost:${PORT}\n`)
})
