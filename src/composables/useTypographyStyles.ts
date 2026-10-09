/**
 * useTypographyStyles
 * ────────────────────────────────────────────────────────────────────────────
 * Single source of truth for CV typography & page-size configuration.
 *
 * Returns:
 *  - `cssVars`    → CSS custom properties + direct font/size props to bind on
 *                   the root element of every template via `:style="cssVars"`.
 *  - `pageConfig` → the full PAGE_SIZES entry (widthPx, heightPx, format…).
 *  - `pdfConfig`  → subset to send to the Puppeteer PDF server.
 *  - `typography` → reactive shorthand for cv.meta.typography with defaults.
 *
 * How templates consume this:
 *   const { cssVars, pageConfig } = useTypographyStyles()
 *   // In template root <div :style="[cvBaseStyle, cssVars]">
 *   // cvBaseStyle contains the static parts (padding, color, boxSizing…)
 *   // cssVars injects --cv-font-family, --cv-font-size, width & minHeight.
 *
 * Adding future DOCX export is trivial: call useTypographyStyles() in the
 * DOCX composable and read fontFamily.value + typography.value.fontSize.
 */

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCVStore } from '@/stores/cvStore'
import {
  FONT_FAMILIES,
  PAGE_SIZES,
  DEFAULT_TYPOGRAPHY,
} from '@/types/cv.types'

export function useTypographyStyles() {
  const store = useCVStore()
  const { cv } = storeToRefs(store)

  /** Resolved typography — always has every field (merges defaults for old CVs) */
  const typography = computed(() => ({
    ...DEFAULT_TYPOGRAPHY,
    ...(cv.value.meta.typography ?? {}),
  }))

  /** Resolved font-family CSS stack string */
  const fontFamilyStack = computed(
    () =>
      FONT_FAMILIES.find(f => f.key === typography.value.fontFamily)?.stack ??
      "Verdana, Geneva, Tahoma, sans-serif",
  )

  /** Resolved page-size config object */
  const pageConfig = computed(
    () =>
      PAGE_SIZES.find(p => p.key === typography.value.pageSize) ?? PAGE_SIZES[0]!,
  )

  /**
   * CSS custom properties + direct style props to bind on the CV root element.
   *
   * Using CSS custom properties lets child elements reference them with
   * `var(--cv-font-family)` without needing to import this composable.
   * The direct `fontFamily` / `fontSize` assignments ensure the root element
   * itself also picks up the values (custom-props alone are inherited, but
   * top-level inline style needs explicit assignment).
   */
  const cssVars = computed(() => ({
    // CSS custom properties (inherited by all children)
    '--cv-font-family': fontFamilyStack.value,
    '--cv-font-size':   `${typography.value.fontSize}px`,
    // Templates size their text as `calc(<design px> * var(--cv-scale))`
    '--cv-scale':       String(typography.value.fontSize / DEFAULT_TYPOGRAPHY.fontSize),
    '--cv-page-width':  `${pageConfig.value.widthPx}px`,
    '--cv-page-height': `${pageConfig.value.heightPx}px`,
    // Direct assignments for the root element
    fontFamily: fontFamilyStack.value,
    fontSize:   `${typography.value.fontSize}px`,
    width:      `${pageConfig.value.widthPx}px`,
    minHeight:  `${pageConfig.value.heightPx}px`,
  }))

  /**
   * Shape to send to the Puppeteer PDF server so it can call
   * `page.pdf({ format: pdfConfig.pageFormat, ... })`.
   * Also used by a future DOCX exporter for paper dimensions.
   */
  const pdfConfig = computed(() => ({
    pageFormat:  pageConfig.value.puppeteerFormat,
    pageWidthPx: pageConfig.value.widthPx,
    pageHeightPx: pageConfig.value.heightPx,
  }))

  return {
    typography,
    fontFamilyStack,
    pageConfig,
    cssVars,
    pdfConfig,
  }
}
