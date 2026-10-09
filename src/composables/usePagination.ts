/**
 * usePagination
 * ────────────────────────────────────────────────────────────────────────────
 * Splits a continuous CV root (`.cv-preview`) into sheets of `pageHeight` px.
 *
 * The CV stays a single DOM tree. Whenever a block would land on the margin
 * band around a sheet boundary, a spacer is inserted before it so it starts
 * on the next sheet, below the top margin. The root then gets a fixed height
 * of `totalPages * pageHeight`.
 *
 * The PDF server prints that same DOM with zero @page margins, so every PDF
 * page is an exact `pageHeight` slice of what the preview shows: the preview
 * and the export cannot disagree on where a page ends.
 */

import { ref, watch, onMounted, type Ref, type WatchSource } from 'vue'
import { useEventListener } from '@vueuse/core'
import { PAGE_MARGINS } from '@/types/cv.types'

const SPACER_ATTR = 'data-cv-spacer'

/** Blocks that are always moved whole, never split across sheets */
const ATOMIC_TAGS = new Set(['LI', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'IMG', 'SVG', 'TABLE'])
const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])
const HEADING_CLASS = /title|label|heading/i

/** Anything this short is moved whole (a header row, a single entry line…) */
const ATOMIC_MAX_HEIGHT = 56
/** A container never leaves less than this much of itself at the end of a sheet */
const MIN_LEAD = 60
const EPSILON = 0.5

interface Box { top: number; bottom: number }

export function usePagination(
  getRoot: () => HTMLElement | null | undefined,
  pageHeight: Ref<number>,
  sources: WatchSource[],
) {
  const totalPages = ref(1)

  /** Inline margin-top values we overrode, to restore on the next pass */
  const pushedMargins = new Map<HTMLElement, string>()

  function clear(root: HTMLElement) {
    root.querySelectorAll(`[${SPACER_ATTR}]`).forEach(s => s.remove())
    pushedMargins.forEach((original, el) => { el.style.marginTop = original })
    pushedMargins.clear()
    root.style.height = ''
    root.style.overflow = ''
  }

  function paginate() {
    const root = getRoot()
    if (!root || !root.offsetWidth) return
    clear(root)

    const H = pageHeight.value
    const { top: marginTop, bottom: marginBottom } = PAGE_MARGINS
    const usable = H - marginTop - marginBottom
    // The preview is shown under transform: scale(); measure in unscaled px
    const scale = root.getBoundingClientRect().width / root.offsetWidth || 1
    let contentBottom = 0

    const box = (el: Element): Box => {
      const origin = root.getBoundingClientRect().top
      const r = el.getBoundingClientRect()
      return { top: (r.top - origin) / scale, bottom: (r.bottom - origin) / scale }
    }
    const pageOf = (top: number) => Math.floor((top + EPSILON) / H)
    /** First y where content may start on a sheet */
    const pageStart = (page: number) => (page === 0 ? 0 : page * H + marginTop)

    function isAtomic(el: HTMLElement, height: number, style: CSSStyleDeclaration) {
      if (ATOMIC_TAGS.has(el.tagName.toUpperCase())) return true
      if (height <= ATOMIC_MAX_HEIGHT) return true
      if (style.columnCount !== 'auto') return true
      // Only inline content inside: it is a single run of text
      return !Array.from(el.children).some(c => {
        const display = getComputedStyle(c).display
        return display !== 'none' && display !== 'contents' && !display.startsWith('inline')
      })
    }

    function isHeading(el: Element | null): el is HTMLElement {
      if (!(el instanceof HTMLElement) || el.hasAttribute(SPACER_ATTR)) return false
      const b = box(el)
      if (b.bottom - b.top > ATOMIC_MAX_HEIGHT) return false
      return HEADING_TAGS.has(el.tagName) || HEADING_CLASS.test(el.className)
    }

    /** Adjacent list items, ignoring anything else (a spacer means the neighbour already moved) */
    const previousItem = (el: Element) => {
      const prev = el.previousElementSibling
      return prev instanceof HTMLElement && prev.tagName === 'LI' ? prev : null
    }
    const nextItem = (el: Element) => {
      const next = el.nextElementSibling
      return next instanceof HTMLElement && next.tagName === 'LI' ? next : null
    }

    /** Moves `el` down so its top edge sits at `target` */
    function pushTo(el: HTMLElement, target: number) {
      const parent = el.parentElement!
      const ps = getComputedStyle(parent)
      const isRow = ps.display.includes('flex') && !ps.flexDirection.startsWith('column')

      if (isRow && ps.flexWrap === 'nowrap') {
        // A spacer would become a sibling column here: shift the item itself
        if (!pushedMargins.has(el)) pushedMargins.set(el, el.style.marginTop)
        let margin = parseFloat(getComputedStyle(el).marginTop) || 0
        for (let i = 0; i < 4; i++) {
          const delta = target - box(el).top
          if (Math.abs(delta) < EPSILON) break
          margin += delta
          el.style.marginTop = `${margin}px`
        }
        return
      }

      const spacer = document.createElement('div')
      spacer.setAttribute(SPACER_ATTR, '')
      spacer.setAttribute('aria-hidden', 'true')
      spacer.style.cssText =
        `display:block;height:0;width:100%;margin:0;padding:0;border:0;` +
        `flex:0 0 ${isRow ? '100%' : 'auto'};grid-column:1/-1;visibility:hidden;`
      parent.insertBefore(spacer, el)
      // Gaps and collapsed margins shift the result, so converge on the target
      let height = 0
      for (let i = 0; i < 4; i++) {
        const delta = target - box(el).top
        if (Math.abs(delta) < EPSILON) break
        height = Math.max(0, height + delta)
        spacer.style.height = `${height}px`
      }
    }

    /**
     * Lays out the children of `container` across sheets.
     * Returns true when the container should instead be moved whole to the
     * next sheet (its first lines would otherwise be stranded).
     */
    function flow(container: HTMLElement, canBubble: boolean): boolean {
      let lastBottom = 0

      for (const child of Array.from(container.children) as HTMLElement[]) {
        if (child.hasAttribute(SPACER_ATTR)) continue

        for (let attempt = 0; attempt < 6; attempt++) {
          const b = box(child)
          const height = b.bottom - b.top
          if (height <= EPSILON) break

          const page = pageOf(b.top)
          const start = pageStart(page)
          const limit = (page + 1) * H - marginBottom
          const inTopMargin = b.top < start - EPSILON

          if (!inTopMargin && b.bottom <= limit + EPSILON) {
            contentBottom = Math.max(contentBottom, b.bottom)
            lastBottom = Math.max(lastBottom, b.bottom)
            break
          }

          const style = getComputedStyle(child)
          if (style.display === 'none' || style.position === 'absolute' || style.position === 'fixed') break

          if (inTopMargin) {
            pushTo(child, start)
            continue
          }

          const atStart = b.top - start < 1
          const atomic = isAtomic(child, height, style)

          if (!atomic) {
            // Already at the top of its sheet: it can only be split, not moved
            if (!flow(child, !atStart)) break
          } else if (height > usable || atStart) {
            // Taller than a sheet: nowhere to move it, let it run over
            contentBottom = Math.max(contentBottom, b.bottom)
            break
          }

          let first = child
          if (child.tagName === 'LI') {
            // Widow: the last bullet never moves alone, it takes the previous one along
            const prev = previousItem(child)
            if (prev && !nextItem(child)) first = prev
            // Orphan: a single bullet is never left behind either
            const before = previousItem(first)
            if (before && !previousItem(before)) first = before
          }
          // Headings travel with the block they introduce
          while (isHeading(first.previousElementSibling)) first = first.previousElementSibling

          const cb = box(container)
          const containerAtStart = cb.top - pageStart(pageOf(cb.top)) < 1
          if (canBubble && !containerAtStart && box(first).top - cb.top < MIN_LEAD) return true

          pushTo(first, (page + 1) * H + marginTop)
        }
      }

      // Deep bottom padding reserves room for decoration (e.g. the Wave footer)
      if (container !== root && lastBottom) {
        const padding = parseFloat(getComputedStyle(container).paddingBottom) || 0
        if (padding > marginBottom) {
          contentBottom = Math.max(contentBottom, lastBottom + padding - marginBottom)
        }
      }
      return false
    }

    flow(root, false)

    totalPages.value = Math.max(1, Math.ceil((contentBottom + marginBottom - EPSILON) / H))
    root.style.height = `${totalPages.value * H}px`
    root.style.overflow = 'clip'
  }

  onMounted(paginate)
  watch([pageHeight, ...sources], paginate, { deep: true, flush: 'post' })
  // Web fonts and photos change line heights after the first layout
  useEventListener(document.fonts, 'loadingdone', paginate)
  useEventListener(document, 'load', e => {
    const root = getRoot()
    if (root && e.target instanceof Node && root.contains(e.target)) paginate()
  }, { capture: true })

  return { totalPages, paginate }
}
