import express from 'express'
import cors from 'cors'
import puppeteer from 'puppeteer'

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' }))

// ── POST /api/pdf ─────────────────────────────────────────────────────────────
app.post('/api/pdf', async (req: any, res: any) => {
  const { html, filename = 'cv-harvard' } = req.body as { html: string; filename?: string }

  if (!html) {
    return res.status(400).json({ error: 'html is required' })
  }

  let browser: any = null
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()

    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 794px; background: #fff; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    li { text-align: justify; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`

    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 30000 })
    await page.evaluateHandle('document.fonts.ready')

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    const safeName = (filename as string).replace(/[^a-z0-9_\-]/gi, '_').toLowerCase()

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
