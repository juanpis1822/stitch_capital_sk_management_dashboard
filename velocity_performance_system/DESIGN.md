---
name: Velocity Performance System
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#909097'
  outline-variant: '#46464c'
  surface-tint: '#c1c6dc'
  primary: '#c1c6dc'
  on-primary: '#2a3041'
  primary-container: '#050a1a'
  on-primary-container: '#74798d'
  inverse-primary: '#585e71'
  secondary: '#e2c62d'
  on-secondary: '#393000'
  secondary-container: '#c1a800'
  on-secondary-container: '#483d00'
  tertiary: '#b4c5ff'
  on-tertiary: '#002a78'
  tertiary-container: '#000827'
  on-tertiary-container: '#3870f8'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde2f9'
  primary-fixed-dim: '#c1c6dc'
  on-primary-fixed: '#151b2c'
  on-primary-fixed-variant: '#414659'
  secondary-fixed: '#ffe24c'
  secondary-fixed-dim: '#e2c62d'
  on-secondary-fixed: '#211b00'
  on-secondary-fixed-variant: '#524600'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-base:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-xs: 0.25rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style
The design system for this speed skating school is engineered for high-performance, precision, and athletic intensity. It targets athletes, coaches, and administrators who require organized data delivered with the urgency of a race track.

The aesthetic blends **Modern Corporate** with **High-Contrast Bold** elements. It utilizes a deep dark-mode foundation to allow the vibrant primary colors to pop, mimicking the visual experience of light reflecting off a polished skating rink. The interface should feel technical, organized, and fast, utilizing sharp typography and subtle depth to maintain professional clarity.

## Colors
The palette is rooted in a deep navy-black (`#050A1A`) to provide maximum contrast for technical data.
- **Primary:** Deep Navy-Black for backgrounds and deep layers.
- **Accent Yellow:** Used for primary actions, highlighting performance metrics, and "Present" status.
- **Accent Blue:** Used for secondary interactive elements and branding accents.
- **Accent Red:** Reserved for critical alerts, "Unpaid" status, and high-intensity branding moments.
- **Neutral:** A range of cool grays and pure white for text hierarchy and structural borders.

## Typography
The typography strategy balances athletic expression with data-heavy utility.
- **Headlines:** Uses *Anybody* for its variable width and aggressive, sporty feel. It should be used in all-caps for main section titles to evoke a sense of speed.
- **Body:** *Hanken Grotesk* provides a clean, modern, and highly legible experience for dashboards and administrative tasks.
- **Data & Tables:** *JetBrains Mono* is used for numerical data, timestamps, and status labels to ensure perfect vertical alignment and a technical, precise appearance.

## Layout & Spacing
The layout follows a **Fluid Grid** system with a focus on data density and dashboard efficiency.
- **Grid:** 12-column system for desktop, 4-column for mobile.
- **Rhythm:** An 8px linear scale (0.5rem) governs all spacing to maintain a structured, professional alignment.
- **Density:** Dashboard views should prioritize high information density with reduced vertical padding in data tables to allow more records per screen. Use `stack-sm` for related grouping and `stack-lg` to separate distinct functional modules.

## Elevation & Depth
In this dark-mode environment, depth is communicated through **Tonal Layering** rather than heavy shadows.
- **Base:** The primary background at `#050A1A`.
- **Surface:** Dashboard cards and containers use a slightly lighter `#111827` with a subtle 1px border of `#1F2937` to define boundaries.
- **Interactive:** Hover states on rows or cards should use a subtle blue tint or a 1px border highlight using the Accent Blue.
- **Overlays:** Modals and tooltips use a high-opacity blur (backdrop-filter) to maintain context while focusing user attention.

## Shapes
The shape language is **Soft** (0.25rem base). While the brand is aggressive, the UI maintains a level of modern professionalism by avoiding completely sharp corners. This slight rounding prevents the interface from feeling "dated" or overly "brutalist," keeping the focus on the content. Pill-shaped buttons are used only for status badges to distinguish them from interactive buttons.

## Components
- **Dashboard Cards:** Use a `#111827` background with a `stack-md` internal padding. Headers within cards should use `title-md`.
- **Data Tables:** High-readability rows with `data-mono` for numbers. Zebra-striping is discouraged; use subtle horizontal dividers (`#1F2937`) instead. Hover states should trigger a faint light-blue background highlight.
- **Buttons:** Primary buttons use the Accent Yellow with black text for maximum visibility. Secondary buttons are outlined in White.
- **Status Badges:** 
    - **Paid:** Green background, dark text, pill-shaped.
    - **Unpaid:** Red background, white text, pill-shaped.
    - **Present:** Yellow background, dark text, pill-shaped.
    - **Absent:** Slate-gray background, white text, pill-shaped.
- **Input Fields:** Darker than the card surface (`#020617`) with a 1px neutral-gray border that glows Blue on focus.
- **Performance Graphs:** Use the Accent Blue for line charts, with Accent Yellow for peak performance markers.