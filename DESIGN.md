---
name: PR Studio
description: Precisão suíça, alma portuguesa — grelha tipográfica suíça sobre grafite, um único acento azul-gelo, o trabalho real como peça.
colors:
  paper: "#151B23"
  paper-2: "#1B222B"
  ink: "#E9EEF3"
  ink-2: "#AAB5C1"
  ink-3: "#7E8A97"
  rule: "#243240"
  rule-2: "#364656"
  ice-blue: "#3FAEFF"
  ice-blue-ink: "#3FAEFF"
  ice-blue-2: "#A6E6FF"
  slate: "#232D39"
  band: "#294263"
  band-ink: "#F2F5FA"
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
    backgroundColor: "{colors.ice-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.all}"
    padding: "15px 22px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.all}"
    padding: "15px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.ice-blue}"
    textColor: "{colors.paper}"
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

The build's own header comment still reads "PR STUDIO — ateliê suíço" and the underlying grammar is unchanged: a sheet of paper ruled into a strict typographic grid, exactly one accent ink, and one variable typeface (Archivo) stretched wide and heavy for display, set at normal width for reading. What changed on 2026-09-06 is the world the grammar is drawn on. The owner audited three palette candidates and picked **"Graphite Control Room"**: paper flips from a cream sheet (`#F6F5F1`) to a blue-graphite near-black (`#151B23`), ink flips from near-black to a light, near-white tone (`#E9EEF3`), and the single accent — the previous "Swiss Red" — is now an ice-blue (`#3FAEFF`) used identically as fill and as text (the code still calls the CSS variables `--red` / `--red-ink` for continuity, but both now resolve to the same ice-blue; don't be misled by the variable name). Alongside the palette swap the owner asked for two structural trims: the hero no longer draws its vertical column rules (there is no `gridDraw` animation or grid overlay left in the codebase — the grid is a layout scaffold again, not a visible subject), and the "Stalden · Valais · Suíça" locator line now closes the hero column instead of opening it, appearing after the pitch, CTAs, and trust list rather than above the headline. `body { color-scheme: dark }` and a `#151B23` `theme-color` meta tag make browser chrome (scrollbars, form controls, mobile status bar) match the graphite ground automatically. There are still no cards with shadows anywhere in the built system; every block is a plane of paper separated by a 1px rule. The one deliberately "unflat" surface is the slate frame (`#232D39`) that stages real screenshots — though on this dark ground it now reads as a subtly lighter tint of the same graphite family rather than the sharply contrasting navy island it was against cream paper.

The homepage is still animation-forward by explicit request, and the motion grammar itself hasn't changed: a single startup choreography plays once (the ice-blue "route" line draws down from the logo, the headline rises word-by-word, the real work-piece slides in from the right), then scroll-triggered reveals take over — section titles split into words that rise into place, plates reveal via `clip-path` wipes instead of fades, numbers and indices count/jump into position, a giant outlined-type marquee repeats the three services, and a small cursor dot trails the pointer on fine-pointer devices. Everything routes through `prefers-reduced-motion` and (for the cursor) `pointer: coarse`, collapsing to a static, fully legible page.

**Key Characteristics:**
- Paper-and-ink on a dark ground: ink (`--ink`) is now the *light* tone and paper (`--paper`) the *dark* one — an inversion of the previous light palette's roles, not just a hue swap.
- One accent, one pale twin: the single ice-blue accent (`--red` / `--red-ink`, identical value) drives every interactive/structural mark; a paler tint of the same hue (`--accent-2`, `#A6E6FF`) exists only for two ambient decorative touches, never as UI color.
- The hero grid is invisible again: no drawn column rules remain; structure comes only from the single route line and horizontal 1px rules.
- One typeface (Archivo variable) still doing two jobs via variation axes: `wdth` 112–118 + weight 800 for display, `wdth` 100 + weight 400 for body — unchanged by the palette work.
- Real client work (Hotel Alpina, MedVisp) is still staged as "the piece" before any self-description; the About section remains deliberately text-only (no portrait exists).
- Motion is still a single startup sequence plus scroll-linked reveals — never idle/looping decoration except the marquee band and the cursor dot.

## Colors

A single ice-blue accent on graphite-dark paper, with a pale twin of that same accent reserved for two ambient touches, and a dedicated saturated blue ("band") for a short list of flat-color banner panels. Audited contrast (from the code's own comment): ink 14.8:1, ink-2 8.3:1, ink-3 4.9:1, accent-as-text 7.2:1, text-on-accent 7.2:1 — all against paper.

### Primary
- **Ice-Blue** (`#3FAEFF`): the system's only true accent. Drives primary CTAs (`.btn-red`), the scroll progress bar, the hero's drawn route line, active nav/tab underlines, list bullets (`—`), pillar/step index numerals, the H2 trailing dot, form focus states, the text-selection highlight, and the input caret. The variable that used to be a separately-darkened "Red Ink" for text legibility (`--red-ink`) now holds the exact same hex as the fill variable (`--red`) — on this dark paper the accent is already contrast-safe as text (7.2:1), so the two no longer need to diverge. Used identically for `.read-more` links, price CTAs inside pillars, and every fill role above.

### Secondary
- **Ice-Blue Pale** (`#A6E6FF`, `--accent-2`): a lighter tint of the same hue, deliberately narrow in scope — it appears only as the bullet dot between words in the service marquee and as the default (non-hover) fill of the cursor-trail dot. It never appears as text, a border, or an interactive fill; when the cursor dot expands over an interactive element it switches to the primary accent instead, not to this tint.

### Neutral
- **Paper** (`#151B23`): the page background and dominant surface everywhere — body, header, footer, loader. On this dark palette, paper doubles as the fixed text color drawn *on* the accent and on ink-filled surfaces (buttons, `.cta-band`, `::selection`), the inverse of the old light palette where a separate near-white handled that role.
- **Paper Deep** (`#1B222B`): a slightly different-toned paper, used for secondary surfaces like the completed-form confirmation panel (`.form-done`).
- **Ink** (`#E9EEF3`): primary text, headings, all structural 1px rules that need to read as "on," and — because it's the *light* tone in this palette — the fill color buttons and screen-frame carets sweep *to*, not away from.
- **Ink Soft** (`#AAB5C1`): secondary body copy, section subheads, card descriptions (`--ink-2`); also reused verbatim as the secondary text color on the "band" panels.
- **Ink Faint** (`#7E8A97`): tertiary/meta text — captions, timestamps, small print (`--ink-3`).
- **Rule** (`#243240`): the hairline grid/divider color inside the hero and elsewhere (`--rule`).
- **Rule Deep** (`#364656`): slightly stronger hairlines — card borders, scrollbar thumb (`--rule-2`).

### Screen-Frame Slate (structural, not decorative)
- **Slate** (`#232D39`): reserved exclusively for the frame/mat behind real screenshots and mockups (`.hero-piece-frame`, `.tw-mock`). It is still the only surface allowed to break the flat paper plane, but on this dark palette it sits close in value to `paper`/`paper-2` — a subtly lighter graphite rather than the sharply contrasting navy it was against the old cream paper. It never appears as text, background, or UI chrome outside that role.

### Band (structural panel color, not decorative)
- **Band** (`#294263`): a new, dedicated saturated blue reserved for a short, fixed list of flat-color "announcement" panels — the language-mismatch banner (`.lang-hint`), the results/bundle panel (`.bundle`), and the folio closing CTA (`.folio-cta`). Text on band uses **Band Ink** (`#F2F5FA`) for headings/body and the same tone as `--ink-2` (`#AAB5C1`) for secondary text. This replaces the previous palette's approach of filling those same panels with the `ink` token directly — band now carries its own hue instead of borrowing ink's.

### Legacy aliases (do not use for new work)
The `:root` block keeps old variable names (`--bg`, `--bg-2`, `--card`, `--dark`, `--dark-2`, `--line`, `--line-2`, `--ember`, `--grad`, `--peach`, `--red-soft`, `--on-red`, `--on-dark`, `--on-dark-2`, `--sh-sm`, `--sh-lg`, `--r`) mapped onto the new tokens (`--bg`→paper, `--card`→`#1B222B`, `--dark`→`var(--band)`, `--dark-2`→`#0F141B`, `--line`/`--line-2`→rule/rule-2, `--ember`/`--grad`→accent, `--on-red`→paper, `--on-dark`/`--on-dark-2`→band-ink/ink-2), purely so the older "kept" block (loader chrome, admin overlay, client-area, template viewer, blog-teaser internals — lines ~51–433) keeps rendering without a rewrite. New marketing UI should reference the new names (`--paper`, `--ink`, `--red`, `--rule`, `--slate`, `--band`) directly, never the legacy aliases.

### Named Rules
**The Two-Ink Rule.** The entire marketing surface is built from exactly one ink and one accent — plus paper and its rule-line neutrals. The accent's pale twin (`--accent-2`) is not a second accent; it's a tint of the same hue permitted only for the two ambient marks named under Secondary above. No other hue appears except the structural slate frame and the band panel color, and neither is ever used as an interactive or text color outside its named role.

**The No-Shadow Rule.** `--sh-sm` and `--sh-lg` are defined for legacy compatibility but the built system sets `box-shadow: none` on every card, button, band, and panel in the ateliê layer. Depth is never implied by shadow. The one exception, `#cookieBanner`, still carries `box-shadow: 0 12px 30px rgba(16,16,16,0.12)` inherited from the legacy block — a leftover, not a design intent, and on this darker paper the near-black shadow it was tuned for is now barely perceptible.

## Typography

**Display & Body Font:** Archivo (variable), with `"Helvetica Neue", Arial, sans-serif` fallback — one family for the whole page. Unchanged by the palette revision.

**Character:** A single grotesque stretched to its extremes: near-maximum width (`wdth` 112–118) and maximum weight (800) for anything that needs to shout (H1, H2, stat values, pillar/step numerals, the "PR." logotype), snapped back to normal width (`wdth` 100) and regular weight for anything meant to be read at length.

### Hierarchy
- **Display / H1** (weight 800, `clamp(2.7rem, 7vw, 6rem)`, line-height 0.95, letter-spacing −0.04em, `wdth` 112): the hero headline only. Rendered word-by-word via `.w > span` spans injected by JS.
- **H2 (section titles)** (weight 800, `clamp(2.2rem, 5vw, 4rem)`, line-height 0.98, letter-spacing −0.035em): one per section, paired with an accent-colored trailing full stop (`h2.display::after { content: "."; color: var(--red); }`) echoing the "PR." logotype's dot.
- **H3/H4** (weight 700, letter-spacing −0.02em, `wdth` 105): card and pillar titles, plan names, FAQ-adjacent headings.
- **Body** (weight 400, 17px, line-height 1.55): running copy; section subheads (`.section-sub`) cap at 58ch, FAQ answers at 68ch, card copy typically 60–70ch.
- **Label / Eyebrow** (weight 600, 0.9rem, no letter-spacing, no uppercase transform): marked with a small accent square (`::before`). Outside the hero, this label is now visually hidden (`.section-head .eyebrow` is clipped to a 1×1px sr-only region) — see Layout and Section Heads below.
- **Mono/tabular numerals** (`font-variant-numeric: tabular-nums`, class `.mono`): stat counters, prices, footer year.

### Named Rules
**The Width-Is-Voice Rule.** Emphasis is expressed by widening and weighting the same face (`wdth` + weight), never by swapping typefaces, italicizing, or adding a serif/script accent. The `.serif` utility class exists (legacy name) but resolves to plain accent-colored text — it carries no serif font.

**The Dot Rule.** An accent-colored "." (`.dot`, or `h2.display::after`) closes the brand mark and every major section headline, tying every H2 visually back to the "PR." logotype.

## Layout

The hero still renders a 12-column grid (`repeat(12, minmax(0,1fr))`, 24px column gap) inside a `max-width: 1320px` container with responsive inline padding (`clamp(20px, 4vw, 56px)`), and copy still occupies columns 1–7/1–8 while the real work-piece occupies columns 8–13, top-aligned. What's different: the grid lines are no longer drawn. There is no `repeating-linear-gradient` overlay and no `gridDraw` keyframe anywhere in the codebase (`.hero .wrap::before { content: none; }`) — the 12-column grid is purely a layout scaffold now, invisible to the eye. The hero's only visible structural marks are a single ice-blue "route" line (`.hero .wrap::after`) that descends from the logo and draws itself in on load (`routeDraw`), plus ordinary horizontal 1px rules. The eyebrow/locator line ("Stalden · Valais · Suíça") is placed with `order: 10` inside the hero's grid, so it visually closes the column — appearing after the pitch, CTAs, and trust list — instead of opening it; its entrance animation also fires last in the startup sequence (1.1s delay, after everything else). Below 980px the grid collapses to a single column and the piece drops below the copy.

Outside the hero, section rhythm is unchanged: `section { padding: 88px 0; }`, a `.wrap` container capped at 1320px, content grids with 32px gaps collapsing per the section. What changed is the section head itself: `.section-head` still declares a two-column grid (`minmax(0,3fr) minmax(0,9fr)`), but the eyebrow that used to occupy the 3fr column is now visually hidden everywhere except the hero (`position: absolute` + clip, sr-only) — see Components → Section Heads. Because the empty 3fr track still reserves its space, every section head now reads as a single, indented title block (indented roughly a quarter of the container width) under a full-width top rule, not a two-column "label beside title" layout. Vertical rhythm inside content grids still comes from a shared 1px top rule (`border-top: 1px solid var(--ink)` or `--rule-2`) rather than padding or shadow.

## Elevation & Depth

Flat by design, stated explicitly in the code's own header comment: "Sem cartões com sombra: os blocos são definidos por réguas de 1px" (no cards with shadows: blocks are defined by 1px rules) — unchanged by the palette work. `--sh-sm: none` and every component's `box-shadow` is `none` in the ateliê layer. Depth and grouping are still communicated entirely through rule-lines and through the slate frame around real screenshots — though, as noted under Colors, that frame now reads as a subtler lift against the graphite ground than it did against cream paper, since slate, paper, and paper-2 are all close in value.

### Named Rules
**The Ruled-Block Rule.** Every grouped unit (pillar, step, stat, plan, shot, FAQ item) opens with a top rule instead of a boxed shadow container. Hover states darken the rule to `--ink` or tint the label with the accent; they never add elevation.

## Shapes

Zero border-radius everywhere (`--r: 0px`), including buttons, inputs, chips, the cookie banner, and the WhatsApp FAB — unaffected by the palette change. The one deliberate exception is the small circular avatar mask on the MedVisp logo mock (`.tw-mock-logo img { border-radius: 50%; }`) and the accent progress/cursor dots, which stay circular because they represent points, not blocks. The form's field style still uses a bottom-border-only input (no boxed outline) so text fields read as ruled lines on the sheet rather than boxes floating on it.

## Components

### Buttons
- **Shape:** rectangular, zero radius, 1px border, 15px/22px padding.
- **Primary (`.btn-red`):** accent (ice-blue) fill, paper-colored text (paper is the dark tone in this palette), border matches fill; hover sweeps to the light `ink` fill via an inset `::before` layer that slides in from the left — text stays paper-colored throughout, since paper reads dark against both the accent and the light ink fill.
- **Secondary (`.btn` default):** ink fill (light, near-white in this palette — not "dark" the way it was in the previous light theme), paper-colored text; hover sweeps to the accent fill using the same wipe mechanic, text unchanged.
- **Ghost (`.btn-ghost`):** transparent fill, ink border and text; hover sweeps to an ink fill with paper-colored text.
- **Magnetic variant (`.magnetic`):** on fine-pointer devices, primary CTAs translate a few px toward the cursor on `pointermove` and snap back on leave — unchanged by the palette work.

### Cards / Blocks
- **Corner Style:** none (0px radius throughout).
- **Background:** transparent (paper shows through); the filled blocks are now the `.bundle` panel (band fill, band-ink text — previously ink-filled) and the accent-filled `.cta-band` (paper-colored text).
- **Shadow Strategy:** none — see Elevation & Depth.
- **Border:** a single top rule (`--ink` for numbered/primary blocks like pillars/steps/plans; `--rule-2` for secondary lists like the trabalho-recente cards and FAQ items).
- **Internal Padding:** modest, asymmetric (`22px 0 26px` typical), vertical only.
- **Reveal behavior:** unchanged — `.reveal`/`.in` via IntersectionObserver, numerals animate up with a fade, screenshot plates reveal via a `clip-path` wipe.

### Screen Frames (signature component)
The `.hero-piece-frame` / `.tw-mock` / `.shot-screen` pattern: a slate mat (`#232D39`) holding a real screenshot or a synthetic sector-mockup. This remains the only place flatness gives way to a distinct "device" surface, and it's where all real proof of work lives — but on this dark ground the mat's lift is subtler than before (slate is close in value to paper/paper-2, not a saturated navy against cream). On scroll, the hero's frame still gets a scroll-linked zoom (`animation-timeline: view()`) where supported; folio shots still reveal via a left-to-right `clip-path` wipe.

### Inputs / Fields
- **Style:** no box — a single bottom border (`border-bottom: 1px solid var(--ink)`), transparent background, no radius.
- **Focus:** border-bottom switches to the accent plus a 1px accent inset shadow (`box-shadow: 0 1px 0 var(--red)`).
- **Error:** `aria-invalid="true"` forces the bottom border to the accent color independent of focus state; inline `.field-err` text appears beneath.

### Navigation
Sticky header on paper with a 1px ink bottom border (no shadow, no blur). Links get an accent underline that grows from the left on hover/active; the active language toggle gets the same treatment. Below 1000px the link list collapses into a paper dropdown with per-item top rules; a hairline `.langs` switcher and a bordered hamburger square replace the full nav.

### Section Heads (signature component)
Still a two-column grid (index-width `3fr` + title/subhead `9fr`) opening with a full-width top rule, but the index/eyebrow column is now empty to the eye: `.section-head .eyebrow` is visually hidden (absolutely positioned, 1×1px, clipped) everywhere it's used as a section head, leaving only the reserved blank track as an indent in front of the title. What reads visually is an indented title + subhead block under a top rule — the "index column beside the title" composition from the previous palette no longer exists visually, even though the same grid and the eyebrow markup are still in the DOM (kept for i18n keys and screen readers). On scroll-reveal, the H2 still splits into per-word spans that rise with a slight rotation, and the subhead still reveals via a left-to-right `clip-path` wipe.

### Marquee (signature component)
A full-bleed band (top+bottom 1px ink rules) of oversized outlined type looping the three service names. Most repetitions render as `-webkit-text-stroke` outlines in `ink`; the periodic solid repeats (`nth-child(8n+3)`, `nth-child(8n+7)`) are solid **ink**-colored, not accent-colored, and the bullet dot between words uses the pale **ice-blue-2** tint rather than the primary accent — both corrections to how the marquee's coloring reads in the previous DESIGN.md. The band carries a persistent pause toggle at its right edge (`.motion-btn`, `aria-pressed`, choice stored in localStorage, hidden under `prefers-reduced-motion` and in print) which stops both the band and the headline rotator; hover-pause remains as a secondary affordance. The toggle sits behind a vertical 1px rule in **ink** — the same value as the band's own top and bottom rules, not the fainter `rule-2` — and its CSS-drawn bars/triangle scale with the band (`clamp(15px, 3.2vw, 30px)`) over a 46px-minimum touch target.

## Do's and Don'ts

### Do:
- **Do** keep the palette to exactly one ink and one accent (ice-blue) on paper; reserve the pale accent tint (`--accent-2`) strictly for the marquee dot and the cursor trail's resting state, and slate strictly for the frame behind real screenshots.
- **Do** express emphasis via the Archivo variable axes (width + weight), never by introducing a second typeface or an italic/serif treatment.
- **Do** close major headings and the wordmark with an accent-colored "." (`.dot` / `h2.display::after`).
- **Do** build every grouped block from a 1px top rule, never a shadowed box.
- **Do** use wipe/clip-path transitions instead of opacity-only fades.
- **Do** gate every animation behind `prefers-reduced-motion: reduce` (and the cursor dot additionally behind `pointer: coarse`).
- **Do** keep the hero's structure carried by the single route line and horizontal rules only — the grid is a layout scaffold again, not a drawn visual; don't reintroduce a column-rule overlay without the owner asking for it back.
- **Do** treat real client work (Hotel Alpina, MedVisp) as the thing shown first, staged inside the slate frame.

### Don't:
- **Don't** add `box-shadow` or `border-radius` to any new marketing component — both are zeroed system-wide by design.
- **Don't** introduce a genuinely new hue. A paler tint of the existing accent is permitted only for the two named ambient marks (marquee dot, cursor trail rest state) — it is not a general-purpose second accent. Anything needing a distinct filled-panel treatment belongs in the `band` role or the slate screen-frame role, not a new color.
- **Don't** reference the legacy `--bg`/`--card`/`--dark`/`--line`/`--ember`/`--grad` variable names in new work — they're compatibility aliases for the pre-ateliê "kept" block, not the current token source of truth.
- **Don't** assume the CSS variable names `--red` / `--red-ink` mean the color is red — under the Graphite palette both resolve to ice-blue (`#3FAEFF`); read the computed value, not the variable name.
- **Don't** fabricate a portrait, landscape photography, or testimonials on this homepage — PRODUCT.md confirms none exist and none should be invented.
- **Don't** treat this system as covering the whole site yet: blog.html, preco-site-suica.html, caso-hotel-alpina.html, and the other legal/article pages (13 pages total) still carry the previous dark-blue design and have not been migrated to this Graphite world.
