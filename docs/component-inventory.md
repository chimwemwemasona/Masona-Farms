# Component Inventory

Generated: 2026-06-17

## Overview

Most UI components are declared in `App.tsx`. The app does not have a separate component library folder. Styling is centralized at the bottom of `App.tsx` with shared tokens imported from `src/theme.ts`.

## App Shell

| Component | Purpose |
| --- | --- |
| `App` | Wraps the app with `SafeAreaProvider`. |
| `MasonaApp` | Owns app state, initializes database, loads data, handles navigation and modal flows. |
| `MasonaLogo` | In-app logo mark built with React Native views and vector icons. |
| `FadeInView` | Small animation wrapper for list/card entrance effects. |

## Screens

| Component | Purpose |
| --- | --- |
| `HomeScreen` | Dashboard metrics, insights, active fields, reminders, quick actions, and recent records. |
| `FieldsScreen` | Field list and active crop cycles. |
| `RecordsScreen` | Filtered record list and add-record action. |
| `CalendarScreen` | Month calendar, date jump, selected-day records, backfill chips, and upcoming work. |
| `ReportsScreen` | Finance cards, share action, PDF export, CSV export, agronomist summary, and benchmark checks. |
| `MoreScreen` | Farmer profile card, placeholder settings rows, and recent photos. |

## Modals And Forms

| Component | Purpose |
| --- | --- |
| `ProfileSetupModal` | First-run and edit profile flow. |
| `FieldFormModal` | Add/edit field and active crop-cycle facts. |
| `RecordFormModal` | Generic record entry for all record types. |
| `PhotoFormModal` | Photo selection, categorization, optional record linking, and caption. |
| `FieldDetailModal` | Field summary, related cycles, records, photos, spent, and earned. |
| `FormInput` | Shared text input wrapper. |

## Row And Card Components

| Component | Purpose |
| --- | --- |
| `MetricStrip` | Dashboard metric cards. |
| `SectionHeader` | Section title plus optional action. |
| `FieldRow` | Field list item with crop, stage, progress, and status. |
| `CropCycleRow` | Active crop cycle row. |
| `RecordRow` | Farm record row with expandable detail and archive action. |
| `ReminderRow` | Reminder row with alert detail. |
| `InsightRow` | Benchmark insight row. |
| `QuickAction` | Dashboard quick action tile. |
| `CalendarEventRow` | Calendar event row. |

## Design System

Implemented:

- Color, radius, and spacing tokens in `src/theme.ts`.
- Large touch targets for main actions and tabs.
- Plain-English labels such as `Total spent`, `Total earned`, and `Net profit` in generated reports.
- Empty states for missing fields, records, crop cycles, photos, and calendar events.

Limitations:

- Cards commonly use `radii.md` of `16`, while the newest UX rule prefers card radii of 8px or less unless the existing system requires otherwise.
- Many reusable components are inside `App.tsx`, making reuse and testing harder.
- No formal component prop documentation or Storybook-style visual test setup exists.

