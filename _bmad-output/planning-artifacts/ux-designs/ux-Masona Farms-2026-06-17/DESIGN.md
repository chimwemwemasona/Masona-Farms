---
name: Masona Farms
status: final
description: Mobile-first farm management system for farmers who need fast field records, reliable cost tracking, and plain-English profit visibility.
sources:
  - ../../prd.md
  - ../../../../docs/index.md
  - ../../../../docs/project-overview.md
  - ../../../../docs/architecture.md
  - ../../../../docs/component-inventory.md
  - ../../../../docs/data-models.md
  - ../../../../docs/technical-debt-and-prd-conflicts.md
  - ../../../../App.tsx
  - ../../../../src/theme.ts
updated: 2026-06-17
colors:
  canvas: '#F2F7F4'
  header: '#06452D'
  header-strong: '#043421'
  header-wash: '#08724A'
  surface: '#FFFFFF'
  surface-soft: '#F7FAF8'
  surface-mint: '#DFF6E9'
  line: '#DDE8E2'
  text: '#121C17'
  muted: '#68766F'
  primary: '#07945F'
  primary-strong: '#06613F'
  teal: '#1496A8'
  amber: '#EF8200'
  amber-soft: '#FFF1DC'
  red: '#E3353F'
  red-soft: '#FFE5E7'
  blue-soft: '#E8F5FF'
  shadow: 'rgba(20, 42, 31, 0.14)'
typography:
  screen-title:
    note: 'Platform native sans, 24-28sp, 800-900 weight'
  section-title:
    note: 'Platform native sans, 20-23sp, 800-900 weight'
  body:
    note: 'Platform native sans, 15-16sp, 500-700 weight'
  label:
    note: 'Platform native sans, 12-13sp, 700-900 weight'
  number:
    note: 'Platform native tabular numbers where available, 17-22sp, 800-900 weight'
rounded:
  xs: 8px
  sm: 8px
  md: 8px
  lg: 12px
  sheet: 24px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 10px
  '4': 14px
  '5': 18px
  '6': 24px
  '7': 32px
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '#FFFFFF'
    radius: '{rounded.md}'
    minHeight: 56px
  card:
    background: '{colors.surface}'
    radius: '{rounded.md}'
    border: 'none'
  sheet:
    background: '{colors.surface}'
    topRadius: '{rounded.sheet}'
  input:
    background: '{colors.surface-soft}'
    border: '{colors.line}'
    radius: '{rounded.sm}'
  status-good:
    background: '{colors.surface-mint}'
    foreground: '{colors.primary-strong}'
  status-watch:
    background: '{colors.amber-soft}'
    foreground: '{colors.amber}'
---

# Masona Farms - Design Spine

## Brand & Style

Masona Farms should feel like a practical farm notebook that also understands money. The current app already has the right foundation: green field identity, white working surfaces, strong readable type, bottom navigation, large touch targets, and plain labels. Preserve that confidence.

The visual system should serve farmers using the app in the field, sometimes in bright light, sometimes with unstable internet, and often while trying to record something quickly before moving to the next task. The design should feel sturdy, direct, and calm. It should not feel like a banking dashboard, a social app, or a decorative agricultural brochure.

Use the brand color to say "farm work is active and saved." Use amber and red only when attention or safety matters. Avoid ornamental imagery, decorative gradients, and oversized marketing sections inside the app. The product is a working tool.

## Colors

- **Field Green (`{colors.primary}` / `{colors.primary-strong}`)** is the primary action and active-state color. It marks selected tabs, saved actions, field progress, active filters, and positive operational states.
- **Deep Header Green (`{colors.header}`)** anchors the farm header and reinforces that the current farm is the working context.
- **Clean Surface (`{colors.surface}`)** holds cards, forms, lists, reports, and sheets. The app should continue to use surface contrast instead of heavy borders.
- **Soft Canvas (`{colors.canvas}`)** remains the page background. It gives a field-record product a warmer feel than pure white while staying readable outdoors.
- **Amber (`{colors.amber}`)** means watch, pending, waiting, or attention. It is not decorative.
- **Red (`{colors.red}`)** means safety, destructive action, overdue, withholding, conflict, or financial risk.
- **Teal (`{colors.teal}`)** may support neutral information such as sync, water, or guidance, but must not compete with primary green.

Avoid expanding into many crop-specific palettes. Crop identity may use icons and small accents, but shared farm records must stay visually consistent across crops and future enterprises.

## Typography

Use platform-native sans-serif typography. The current heavy headings and labels work because they are readable and direct. Keep that posture, but do not overuse 900-weight text in dense forms.

- Screen titles use `{typography.screen-title}`.
- Section titles use `{typography.section-title}` and should stay short: "Records", "Upcoming work", "Total spent".
- Body copy uses `{typography.body}`. Empty states should be one or two practical sentences.
- Labels use `{typography.label}` and plain English.
- Financial values use `{typography.number}` with consistent currency formatting.

Do not introduce display serif, script, or decorative farm typography. Masona Farms is a field tool, not a seed packet.

## Layout & Spacing

The layout remains mobile-first, portrait, single-column, and thumb-friendly. Use the existing rhythm of full-width sections, card/list panels, bottom tabs, a floating add action, and bottom sheets.

Spacing follows a compact 4-based scale using `{spacing.1}` through `{spacing.7}`. Dense operational screens may use 8-14px gaps. Major sections use 18-24px gaps. Field work screens must never rely on tiny tap targets.

Cards and panels should be flatter than the current implementation over time. Current radii of 16-22px can remain during transition, but the forward design token for cards is `{rounded.md}` so repeated lists feel more like a tool and less like decorative cards.

## Elevation & Depth

Use elevation sparingly. Current card shadows help separate content from the pale canvas, but future screens should rely more on spacing, surface tone, and hairline dividers. Keep stronger elevation for:

- Bottom sheets.
- Floating add action.
- Bottom navigation.
- Temporary overlays.

Avoid nested cards and stacked shadow surfaces. A list panel may contain rows, but those rows should not become individual floating cards unless the user must compare them as separate objects.

## Shapes

Use `{rounded.md}` for cards, chips, inputs, and segmented controls. Use `{rounded.sheet}` only for bottom sheets. Use `{rounded.full}` for circular icon buttons, avatars, notification badges, and the floating add action.

The current circular farm mark may remain. Avoid pill-shaped text buttons when an icon button or segmented option is clearer.

## Components

- **Farm header**: Deep green area with farm name, location, offline/sync state, and notifications. It owns the working context. In future multi-farm mode, tapping the farm name opens the farm switcher.
- **Bottom tab bar**: Persistent primary navigation for the mobile app. Icons plus labels remain. Keep labels short enough for low-cost Android screens.
- **Floating add action**: Global quick capture. Opens a type picker before specialized entry sheets. It must always default to fast record entry, not a complex menu.
- **List panel**: White surface containing rows separated by hairline dividers. Use for records, reminders, suppliers, customers, workers, inventory products, and cycle history.
- **Metric strip / report cards**: Show practical numbers with short labels. Financial cards must distinguish estimate, synced/unsynced, and incomplete-data states when relevant.
- **Bottom sheet form**: Primary data-entry pattern. Sheets contain grouped fields, progressive disclosure, save action, and local/sync status copy.
- **Type chips**: Use for record type, crop, variety, field, cycle, and category selection. Active chip uses `{colors.surface-mint}` and `{colors.primary-strong}`.
- **Status chip**: Use "Good", "Watch", "Needs review", "Synced", "Waiting to sync", "Closed", "Paid", "Part paid", and "Owed". Avoid technical states like "dirty", "mutation", or "conflict object".
- **Record row**: Icon, type, cycle/unit, detail, date, amount where applicable, expandable details. Preserve the current expandable behavior.
- **Calendar day**: Month grid cell with count dots. Active day uses primary green. Dots show work exists, not severity.
- **Photo card**: Thumbnail, category tag, caption. Receipt photos should visually link to the expense, input, sale, or payment they support.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep labels plain: "Total spent", "Sales income", "Money still owed" | Use software or accounting jargon in normal farmer flows |
| Keep the green, white, and soft-canvas foundation | Turn the app into a one-note green dashboard with decorative farm graphics |
| Preserve bottom sheets for entry | Push long forms into cramped full-screen pages without grouping |
| Use red for safety, overdue, destructive, and conflict states | Use red for normal low-profit states without explaining the issue |
| Show whether data is saved locally or synced | Hide offline status behind settings |
| Use structured fields only where they improve recall, safety, traceability, or reports | Force every possible farm detail into required fields |
| Keep crop guidance visually separate from recordkeeping | Let ABE Chilli guidance define the whole product system |
