---
name: PR Studio
description: Precisão suíça, alma portuguesa — grelha tipográfica suíça, papel e duas tintas, o trabalho real como peça.
colors:
  paper: "#F6F5F1"
  paper-2: "#ECEAE3"
  ink: "#101010"
  ink-2: "#45453F"
  ink-3: "#5C5B55"
  rule: "#D9D6CE"
  rule-2: "#B9B5AA"
  swiss-red: "#C8102E"
  red-ink: "#A50D25"
  slate: "#2B3A55"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.7rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em to -0.04em"
    fontVariation: "wdth 112-118 (expanded)"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "wdth 100 (normal)"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    letterSpacing: "normal"
rounded:
  all: "0px"
spacing:
  section-y: "88px"
  pad-inline: "clamp(20px, 4vw, 56px)"
  container-max: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.swiss-red}"
    textColor: "#FFFFFF"
    rounded: "{rounded.all}"
    padding: "15px 22px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.all}"
    padding: "15px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.swiss-red}"
    textColor: "#FFFFFF"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.all}"
    padding: "15px 22px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: PR Studio

## Overview

**Creative North Star: "The Swiss Atelier" (Ateliê suíço)**

PR Studio's homepage sells Swiss precision by being Swiss precision: a sheet of paper (`#F6F5F1`) ruled into a strict typographic grid, two inks only — near-black and Swiss red — and one variable typeface (Archivo) stretched wide and heavy for display, set at normal width for reading. There are no cards with shadows anywhere in the built system; every block is a plane of paper separated by a 1px rule. The one deliberately "unflat" surface is the slate-blue frame (`#2B3A55`) that stages real screenshots (the Hotel Alpina site, sector-demo mockups) — it exists only to hold work, never as a decorative surface. This is a rejection of the previous system's dark hero with abstract decoration and a shelf of identical shadowed cards.

The homepage is animation-forward by explicit request, but the motion is orchestrated and grid-bound rather than decorative: a single startup choreography plays once (grid rules draw, a red "route" line draws down from the logo, the headline rises word-by-word, the real work-piece slides in from the right), then scroll-triggered reveals take over — section titles split into words that rise into place, plates (mockups, screenshots) reveal via `clip-path` wipes instead of fades, numbers and indices count/jump into position, a giant outlined-type marquee repeats the three services, and a soft red cursor dot trails the pointer on fine-pointer devices. Everything routes through `prefers-reduced-motion` and (for the cursor) `pointer: coarse`, collapsing to a static, fully legible page.

**Key Characteristics:**
- Paper-and-ink, not screens-and-cards: two inks total (`--ink`, `--red`), one paper surface, zero shadows, zero border-radius.
- A visible 12-column grid in the hero, drawn in on load as literal 1px rules — the grid is not a layout aid, it's the visual subject.
- One typeface (Archivo variable) doing two jobs via variation axes: `wdth` 112–118 + weight 800 for display, `wdth` 100 + weight 400 for body.
- Real client work (Hotel Alpina, MedVisp) is staged as "the piece" before any self-description; the About section is deliberately text-only (no portrait exists).
- Motion is a single startup sequence plus scroll-linked reveals — never idle/looping decoration except the marquee band and the cursor dot.

## Colors

Two inks on paper, plus one structural neutral (slate) reserved for screen frames only.

### Primary
- **Swiss Red** (`#C8102E`): the single accent. Drives primary CTAs (`.btn-red`), the progress bar, the hero's drawn "route" line, active nav/tab underlines, list bullets (`—`), pillar/step index numerals, form focus states, and the cursor dot. Used sparingly — most of the page is ink-on-paper; red marks the one thing to act on.
- **Red Ink** (`#A50D25`, "Deep Route Red"): the same red darkened for use as *text* on paper (links, "read more" affordances, price CTAs inside cards) where full-saturation red would fail contrast/legibility at small sizes.

### Neutral
- **Paper** (`#F6F5F1`): the page background and the dominant surface everywhere — body, header, footer, loader.
- **Paper Deep** (`#ECEAE3`): a slightly denser paper, used for secondary surfaces like the completed-form confirmation panel.
- **Ink** (`#101010`): primary text, headings, all structural 1px rules that need to read as "on," button fills, header border, footer border.
- **Ink Soft** (`#45453F`): secondary body copy, section subheads, card descriptions (`--ink-2`).
- **Ink Faint** (`#5C5B55`): tertiary/meta text — captions, timestamps, small print (`--ink-3`); still meets ~6.3:1 on paper per the code's own comment.
- **Rule** (`#D9D6CE`): the visible hairline grid color inside the hero and other decorative dividers (`--rule`).
- **Rule Deep** (`#B9B5AA`): slightly stronger hairlines — card borders, scrollbar thumb (`--rule-2`).

### Screen-Frame Blue (structural, not decorative)
- **Slate** (`#2B3A55`): reserved exclusively for the frame/mat behind real screenshots and mockups (`.hero-piece-frame`, `.tw-mock`, sector-demo `.shot-screen` backgrounds vary per demo but the mockup mat is slate). It is the only saturated non-red, non-neutral color the system allows, and it never appears as text, background, or UI chrome — only as the "glass" that holds proof of work.

### Legacy aliases (do not use for new work)
The `:root` block keeps old variable names (`--bg`, `--bg-2`, `--card`, `--dark`, `--line`, `--line-2`, `--ember`, `--grad`, `--peach`, `--red-soft`, `--on-red`, `--on-dark`, `--on-dark-2`, `--sh-sm`, `--sh-lg`, `--r`) mapped onto the new tokens, purely so the older "kept" block (loader chrome, admin overlay, client-area, template viewer, blog-teaser internals — lines ~51–433) keeps rendering without a rewrite. New marketing UI should reference the new names (`--paper`, `--ink`, `--red`, `--rule`, `--slate`) directly, never the legacy aliases.

### Named Rules
**The Two-Ink Rule.** The entire marketing surface uses exactly two inks — near-black and Swiss red — plus paper and its rule-line neutrals. No third hue appears except the slate screen-frame, and slate is never used as an accent or interactive color.

**The No-Shadow Rule.** `--sh-sm` and `--sh-lg` are defined for legacy compatibility but the built system sets `box-shadow: none` on every card, button, band, and panel in the ateliê layer. Depth is never implied by shadow.

## Typography

**Display & Body Font:** Archivo (variable), with `"Helvetica Neue", Arial, sans-serif` fallback — one family for the whole page.

**Character:** A single grotesque stretched to its extremes: near-maximum width (`wdth` 112–118) and maximum weight (800) for anything that needs to shout (H1, H2, stat values, pillar/step numerals, the "PR." logotype), snapped back to normal width (`wdth` 100) and regular weight for anything meant to be read at length. The variable-font axis itself is the typographic "voice" — width is the lever, not a second typeface.

### Hierarchy
- **Display / H1** (weight 800, `clamp(2.7rem, 7vw, 6rem)`, line-height 0.95, letter-spacing −0.04em, `wdth` 112): the hero headline only. Rendered word-by-word via `.w > span` spans injected by JS.
- **H2 (section titles)** (weight 800, `clamp(2.2rem, 5vw, 4rem)`, line-height 0.98, letter-spacing −0.035em): one per section, always paired with a red-colored trailing full stop (`h2.display::after { content: "."; color: var(--red); }`) echoing the "PR." logotype's dot.
- **H3/H4** (weight 700, letter-spacing −0.02em, `wdth` 105): card and pillar titles, plan names, FAQ-adjacent headings.
- **Body** (weight 400, 17px, line-height 1.55): running copy; section subheads (`.section-sub`) cap at 58ch, FAQ answers at 68ch, card copy typically 60–70ch.
- **Label / Eyebrow** (weight 600, 0.9rem, no letter-spacing, no uppercase transform): section eyebrows, marked with a small red square (`::before`) instead of the color-block/pill treatment used elsewhere in older layers.
- **Mono/tabular numerals** (`font-variant-numeric: tabular-nums`, class `.mono`): stat counters, prices, footer year — numbers that update or align in a row never reflow character width.

### Named Rules
**The Width-Is-Voice Rule.** Emphasis is expressed by widening and weighting the same face (`wdth` + weight), never by swapping typefaces, italicizing, or adding a serif/script accent. The `.serif` utility class exists (legacy name) but resolves to plain red-colored text in the current world — it carries no serif font.

**The Dot Rule.** A red "." (`.dot`, or `h2.display::after`) closes the brand mark and every major section headline, tying every H2 visually back to the "PR." logotype.

## Layout

The hero renders an explicit 12-column grid (`repeat(12, minmax(0,1fr))`, 24px column gap) inside a `max-width: 1320px` container with responsive inline padding (`clamp(20px, 4vw, 56px)`). The grid lines themselves are drawn as a `repeating-linear-gradient` overlay and animate in on load (`gridDraw`) — the grid is literally visible, not just a layout convention. Copy occupies columns 1–7/1–8; the real work-piece occupies columns 8–13, top-aligned, so the "piece" and the "words" read as two things placed on the same ruled sheet. Below 980px the grid collapses to a single column and the piece drops below the copy.

Outside the hero, sections use a simpler rhythm: `section { padding: 88px 0; }`, a `.wrap` container capped at 1320px, and a two-column `.section-head` (index/eyebrow at 3fr, title+subhead at 9fr) with a top rule instead of a divider. Content grids (pillars, steps, plans, folio shots, stats) are typically 3- or 4-up CSS grids with 32px gaps that collapse to 1–2 columns under 900px and to a single column under 520–600px. Vertical rhythm inside these grids comes from a shared 1px top rule (`border-top: 1px solid var(--ink)` or `--rule-2`) rather than padding or shadow — blocks read as "cells of the grid," not "cards floating on the page."

## Elevation & Depth

Flat by design, stated explicitly in the code's own header comment: "Sem cartões com sombra: os blocos são definidos por réguas de 1px" (no cards with shadows: blocks are defined by 1px rules). `--sh-sm: none` and every component's `box-shadow` is `none` in the ateliê layer (the one exception, `#cookieBanner`, still carries a soft shadow inherited from the legacy block — an un-migrated leftover, not a design intent). Depth and grouping are communicated entirely through rule-lines (1px borders in `--ink`, `--rule`, or `--rule-2`) and through the slate frame around real screenshots, which reads as a "glass" plane precisely because everything around it is matte paper.

### Named Rules
**The Ruled-Block Rule.** Every grouped unit (pillar, step, stat, plan, shot, FAQ item) opens with a top rule instead of a boxed shadow container. Hover states darken the rule to `--ink` or tint the label red; they never add elevation.

## Shapes

Zero border-radius everywhere (`--r: 0px`), including buttons, inputs, chips, the cookie banner, and the WhatsApp FAB — the one deliberate exception is the small circular avatar mask on the MedVisp logo mock (`.tw-mock-logo img { border-radius: 50%; }`) and the red progress/cursor dots, which stay circular because they represent points, not blocks. Corners are square throughout; the form's the field style uses a bottom-border-only input (no boxed outline) so text fields read as ruled lines on the sheet rather than boxes floating on it.

## Components

### Buttons
- **Shape:** rectangular, zero radius, 1px border, 15px/22px padding.
- **Primary (`.btn-red`):** red fill, white text, border matches fill; hover sweeps to ink via an inset `::before` layer that slides in from the left (`transform: translateX(-101%) → none`) rather than a color-transition — a wipe, not a fade.
- **Secondary (`.btn` default, dark):** ink fill, paper text; hover sweeps to red using the same wipe mechanic.
- **Ghost (`.btn-ghost`):** transparent fill, ink border and text; hover sweeps to ink fill with paper text.
- **Magnetic variant (`.magnetic`):** on fine-pointer devices, primary CTAs (hero, CTA bands, contact submit) translate a few px toward the cursor on `pointermove` and snap back on leave — a small "tactile" flourish layered on top of the wipe.

### Cards / Blocks
- **Corner Style:** none (0px radius throughout).
- **Background:** transparent (paper shows through); the only filled blocks are the dark `.bundle` panel (ink fill, paper text) and the red `.cta-band`.
- **Shadow Strategy:** none — see Elevation & Depth.
- **Border:** a single top rule (`--ink` for numbered/primary blocks like pillars/steps/plans; `--rule-2` for secondary lists like the trabalho-recente cards and FAQ items).
- **Internal Padding:** modest, asymmetric (`22px 0 26px` typical) — padding is vertical only; blocks span the full grid-cell width with no horizontal inset, reinforcing the "sheet" feel.
- **Reveal behavior:** cards carry a `.reveal` class toggled to `.in` by an IntersectionObserver; numerals/indices additionally animate up from `translateY(45%)` with a fade, and screenshot plates reveal via a `clip-path` wipe rather than opacity alone.

### Screen Frames (signature component)
The `.hero-piece-frame` / `.tw-mock` / `.shot-screen` pattern: a slate-blue (`#2B3A55`) mat holding a real screenshot or a synthetic sector-mockup (built from inline `<div>` bars standing in for headings/images/buttons, colored per-sector). This is the only place shadows-free flatness gives way to a distinct "device" surface, and it is where all real proof of work (Hotel Alpina, MedVisp, and the 7 sector demos) lives. On scroll, the hero's frame gets a scroll-linked zoom (`animation-timeline: view()`, scales to 1.28 and drifts up) where the browser supports it; folio shots reveal via a left-to-right `clip-path` wipe instead.

### Inputs / Fields
- **Style:** no box — a single bottom border (`border-bottom: 1px solid var(--ink)`), transparent background, no radius.
- **Focus:** border-bottom switches to red plus a 1px red inset shadow (`box-shadow: 0 1px 0 var(--red)`) — a ruled-line focus ring, not a glow.
- **Error:** `aria-invalid="true"` forces the bottom border to red independent of focus state; inline `.field-err` text appears beneath.

### Navigation
Sticky header on paper with a 1px ink bottom border (no shadow, no blur). Links get a red underline that grows from the left on hover/active (`scaleX` transform); the active language toggle gets the same red underline treatment. Below 1000px the link list collapses into a paper dropdown with per-item top rules instead of the underline treatment; a hairline `.langs` switcher and a bordered hamburger square replace the full nav.

### Section Heads (signature component)
A two-column head (index-width eyebrow column + title/subhead column) opening with a full-width top rule — used to introduce every major section. On scroll-reveal, the H2 splits into per-word spans that rise with a slight rotation (`wordIn`), and the eyebrow/subhead reveal via a left-to-right `clip-path` wipe with staggered delays — the same wipe-not-fade language used everywhere else.

### Marquee (signature component)
A full-bleed band (top+bottom 1px ink rules) of oversized outlined type looping the three service names, most repetitions rendered as `-webkit-text-stroke` outlines with periodic solid-red-inked repeats and a red bullet dot between words. Pauses on hover. This is the loudest single element on the page and functions as the system's "wordmark of the whole business" rather than a component to reuse elsewhere.

## Do's and Don'ts

### Do:
- **Do** keep the palette to exactly two inks (ink, Swiss red) on paper; reserve slate strictly for the frame behind real screenshots.
- **Do** express emphasis via the Archivo variable axes (width + weight), never by introducing a second typeface or an italic/serif treatment.
- **Do** close major headings and the wordmark with a red "." (`.dot` / `h2.display::after`).
- **Do** build every grouped block from a 1px top rule, never a shadowed box.
- **Do** use wipe/clip-path transitions (buttons, reveals, plates) instead of opacity-only fades — motion should read as something being drawn or uncovered, not faded in.
- **Do** gate every animation behind `prefers-reduced-motion: reduce` (and the cursor dot additionally behind `pointer: coarse`), collapsing straight to the final, fully legible state.
- **Do** treat real client work (Hotel Alpina, MedVisp) as the thing shown first, staged inside the slate frame; synthetic sector demos use the same frame pattern but are visually distinguishable as mockups (chrome dots, placeholder bars) rather than real screenshots.

### Don't:
- **Don't** add `box-shadow` or `border-radius` to any new marketing component — both are zeroed system-wide by design, with the sole radius exception being the circular MedVisp avatar mask and the round progress/cursor dots.
- **Don't** introduce a third accent hue. If something needs a non-red, non-ink treatment, it almost certainly belongs in the slate screen-frame role, not as a new UI color.
- **Don't** reference the legacy `--bg`/`--card`/`--dark`/`--line`/`--ember`/`--grad` variable names in new work — they're compatibility aliases for the pre-ateliê "kept" block (loader chrome, admin overlay, client area, template viewer), not the current token source of truth.
- **Don't** fabricate a portrait, landscape photography, or testimonials on this homepage — PRODUCT.md confirms none exist and none should be invented; the About section is deliberately typographic instead of photographic.
- **Don't** treat this system as covering the whole site yet: blog.html, preco-site-suica.html, caso-hotel-alpina.html, and the other legal/article pages (13 pages total) still carry the previous dark design and have not been migrated to the ateliê suíço world. Building new homepage-adjacent work against this DESIGN.md is correct; assuming another page already matches it is not.
