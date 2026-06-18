---
baseline_commit: 0c6d399944a46e25d01c5dfe4f1d3b3fd8c7e4b9
---

# Story 1.3: Extract Report Calculations And Exports From `App.tsx`

Status: review

Completion Note: Ultimate context engine analysis completed - comprehensive developer guide created.

## Story

As a farmer,
I want reports and exports to keep working after the app is reorganized,
so that I can still explain farm costs and income while the app evolves.

## Acceptance Criteria

1. Given existing records and fields, when the Reports screen renders, then Revenue, Expenses, Net profit, Cost / field, Cost / ha, Best crop, Farm activity, and export actions match the current pre-extraction behavior.
2. Given a farmer shares a report, exports PDF, or exports CSV, when the output is generated, then the output contains the same labels, values, row ordering, escaping behavior, fallback behavior, file names, MIME types, and farmer-facing error copy as before.
3. Given Story 1.2 regression fixtures, when report helper tests run, then current imperfect finance behavior remains locked: `Sale` counts as earned, `Harvest` is ignored, every other non-archived money record counts as spent, and archived records remain excluded by repository reads.
4. Given the refactor is complete, when `App.tsx` is reviewed, then report calculations, report payload creation, dashboard metric construction, and export orchestration are no longer defined inline in the UI file except for wiring callbacks into `ReportsScreen`.
5. No report scope, finance rule, visible label, screen layout, navigation behavior, dependency, database schema, API, sync behavior, or structured record model is changed in this story.

## Tasks / Subtasks

- [x] Finish the report-domain extraction already started in Story 1.2. (AC: 1, 3, 4)
  - [x] Keep and extend `src/reports/currentReportRules.ts`; do not create a second competing report rules module.
  - [x] Move `buildDashboardMetrics()` out of `App.tsx` into the report helper boundary, along with any small report-only types/helpers it needs.
  - [x] Preserve the current dashboard metric labels and hints exactly: `Revenue`, `Expenses`, `Net profit`, `Farm activity`, `All crop sales`, `Inputs and labor`, `Season margin`, and `Add sales to measure`.
  - [x] Keep the same count rules: sales count is `record.type === "Sale"`, expense count is non-`Sale`, non-`Harvest`, positive amount, records-this-week uses the existing date logic, and profit tone is red only when profit is negative.

- [x] Extract export orchestration out of `ReportsScreen` while preserving UI behavior. (AC: 2, 4, 5)
  - [x] Add a small export service/helper, preferably `src/services/reportExports.ts`, for building and running share/PDF/CSV export actions.
  - [x] Keep platform side effects injectable enough to unit test payload generation and branch behavior without launching native share sheets.
  - [x] Preserve current native integrations: `Share.share()` for text share, `Print.printToFileAsync({ html })` for PDF generation, `Sharing.isAvailableAsync()` / `Sharing.shareAsync()` for file sharing, and `FileSystem.writeAsStringAsync()` to write `masona-farms-report.csv`.
  - [x] Preserve current fallbacks: PDF shows `Alert.alert("PDF created", file.uri)` when Expo Sharing is unavailable; CSV falls back to `Share.share({ title: "Masona Farms CSV report", message: csv })`.
  - [x] Preserve current farmer-facing failure copy exactly: `Share failed`, `PDF export failed`, and `CSV export failed` with the existing messages.

- [x] Keep `ReportsScreen` as presentation plus callback wiring only. (AC: 1, 2, 4, 5)
  - [x] `ReportsScreen` may still render report cards, export buttons, the agronomist summary, and benchmark checks in `App.tsx` until Story 1.4 splits screens.
  - [x] It should receive or derive a prepared report view model from extracted helpers instead of constructing report math/export payloads inline.
  - [x] Do not rename the current tab, buttons, section headers, report cards, or export button text.

- [x] Strengthen the existing regression test harness around the completed extraction. (AC: 1, 2, 3)
  - [x] Extend `scripts/run-regression-tests.mjs` using the current no-new-dependency pattern: Node `node:test`, `assert`, and TypeScript transpilation.
  - [x] Add or update tests for extracted dashboard metrics, including zero-revenue margin, negative-profit tone, record counts, and records-this-week behavior.
  - [x] Add tests for export orchestration branches using fake `Share`, `Print`, `Sharing`, `FileSystem`, and `Alert` dependencies.
  - [x] Keep the existing `current report rules preserve sale, harvest, payment, and archive behavior` and `current report export sources preserve rows, escaping, and plain totals` coverage passing.

- [x] Verify and document the result. (AC: 1, 2, 3, 5)
  - [x] Run `npm run test:regression`.
  - [x] Run `npm run test:migrations`.
  - [x] Run `npm run typecheck`.
  - [x] Manually open Reports with existing or seeded local data and verify totals, report cards, Share, PDF, CSV, archived-record exclusion, and visible labels match the pre-extraction behavior.

### Review Findings

- [ ] [Review][Patch] Include untracked export service in the Story 1.3 change set [src/services/reportExports.ts:1]

## Dev Notes

### Business Context

This is Epic 1 stabilization work. It reduces the risk of the large `App.tsx` file before Story 1.4 splits screens and forms, while preserving reports farmers already use to explain costs and income. The story covers FR-061 and NFR-012: report totals must be preserved or rule changes must be explicit, and user-facing text must remain plain English. [Source: C:/Users/justp/Documents/Masona Farms/_bmad-output/planning-artifacts/epics.md#Story-1.3]

### Current State

- The app is an Expo React Native local-only mobile app with custom tab state, local SQLite, no backend, no auth, and no sync. [Source: C:/Users/justp/Documents/Masona Farms/_bmad-output/planning-artifacts/architecture.md#2-Current-Baseline]
- `App.tsx` still owns the report screen component and native export side effects. Current report call sites are around `ReportsScreen`, `shareReport()`, `exportPdf()`, `exportCsv()`, and `buildDashboardMetrics()`. [Source: C:/Users/justp/Documents/Masona Farms/App.tsx]
- Story 1.2 already added `src/reports/currentReportRules.ts` and wired `App.tsx` to it for core totals, field values, best crop, agronomist summary, share text, HTML, and CSV source. Build on that module; do not duplicate it. [Source: C:/Users/justp/Documents/Masona Farms/src/reports/currentReportRules.ts]
- `scripts/run-regression-tests.mjs` already loads TypeScript files through `typescript.transpileModule` and tests report totals/export-source behavior. Extend this harness instead of adding Jest, Vitest, or another dependency. [Source: C:/Users/justp/Documents/Masona Farms/scripts/run-regression-tests.mjs]

### Current Report Rules To Preserve

- `calculateFarmTotals(records)`:
  - `Sale` records count as earned/revenue.
  - `Harvest` records are ignored for money totals.
  - Every other non-archived record amount counts as spent/expenses.
  - Profit is revenue minus expenses.
- `calculateFieldReportValues(totals, fields)`:
  - Cost per field is total expenses divided by field count, or `0` if there are no fields.
  - Cost per hectare parses the first number from `field.area`, sums those values, and divides expenses by total parsed area, or `0` if no area is parsed.
- `getBestCrop(fields, records)`:
  - Maps records to crops by `record.field`.
  - `Sale` is positive, `Harvest` is zero, all other types are negative.
  - Empty data returns `No data` and `Add sales and expenses`.
- `buildAgronomistSummary(fields, records)`:
  - Chooses the first field with status `Watch`, or the first field.
  - Uses up to four records linked by field name.
  - Empty field data returns `Add a field to create an agronomist summary.`

These rules are imperfect, especially `Payment` counting as spent, but this story must preserve them. Future finance stories will introduce explicit sales, payments, outstanding money, and estimate/accounting-grade report labels.

### Export Behavior To Preserve

- Share text title: `Masona Farms report`.
- Share text source starts with `Masona Farms Report`, then includes `Revenue`, `Expenses`, `Net profit`, `Cost per field`, `Cost per hectare`, `Best crop`, `Active fields`, `Recent records`, and `Agronomist summary`.
- PDF source is generated by `buildReportHtml()` and printed with `Print.printToFileAsync({ html })`.
- PDF share uses `Sharing.shareAsync(file.uri, { mimeType: "application/pdf", dialogTitle: "Share Masona Farms PDF report" })`.
- CSV source is generated by `buildReportCsv(fields, records)`.
- CSV writes to `${FileSystem.cacheDirectory}masona-farms-report.csv`.
- CSV share uses `Sharing.shareAsync(fileUri, { mimeType: "text/csv", dialogTitle: "Share Masona Farms CSV report" })` when available.
- CSV fallback uses `Share.share({ title: "Masona Farms CSV report", message: csv })`.
- CSV escaping currently wraps every value in double quotes and escapes embedded double quotes. Do not harden formula injection in this story; that is deferred work from Story 1.2 review.

### Architecture Guardrails

- Move report calculations to `src/reports` or report-domain helpers and export side effects to `src/services`; this follows the architecture target of reports and exports leaving UI code. [Source: C:/Users/justp/Documents/Masona Farms/_bmad-output/planning-artifacts/architecture.md#4.3-Components-That-Must-Be-Refactored]
- Keep crop-specific guidance separate from report and finance rules. Do not import crop-practice or crop-library logic into report rules unless it is already part of current behavior.
- Do not introduce backend, sync, auth, platform entities, structured crop tables, new report scopes, or estimate labels in this story.
- Keep the current bottom-tab app shape and Reports screen presentation unchanged. Story 1.4 owns screen/form splitting. [Source: C:/Users/justp/Documents/Masona Farms/_bmad-output/planning-artifacts/epics.md#Story-1.4]

### Latest Technical Notes

- The installed project stack is Expo `~54.0.0`, React Native `0.81.4`, TypeScript `~5.9.2`, `expo-print` `^56.0.3`, `expo-sharing` `^56.0.16`, and `expo-file-system` `^56.0.7`. [Source: C:/Users/justp/Documents/Masona Farms/package.json]
- Expo SDK 54 docs show `Print.printToFileAsync({ html })` creates a PDF file in the app cache and returns a file result; keep the current API. [Source: https://docs.expo.dev/versions/v54.0.0/sdk/print/]
- Expo Sharing docs require checking `Sharing.isAvailableAsync()` before file sharing where availability can vary, and `Sharing.shareAsync(url, options)` shares a local file URL; keep the current availability branch and local file URI handling. [Source: https://docs.expo.dev/versions/v54.0.0/sdk/sharing/]
- Expo FileSystem docs mark several legacy functions as deprecated in the new API surface and say legacy methods should be imported from `expo-file-system/legacy`; the current app already imports legacy FileSystem, so do not migrate APIs as part of this behavior-preserving story. [Source: https://docs.expo.dev/versions/v54.0.0/sdk/filesystem/]

### Previous Story Intelligence

Story 1.2 is complete and is the direct dependency:

- Migration tests and regression tests passed.
- `src/reports/currentReportRules.ts` was intentionally introduced as a small behavior-only report helper.
- `App.tsx` now imports `buildAgronomistSummary`, `buildReportCsv`, `buildReportHtml`, `buildShareReport`, `calculateFarmTotals`, `calculateFieldReportValues`, and `getBestCrop`.
- Regression tests lock current report behavior: `Sale` counts as earned, `Harvest` is ignored, `Payment` and other non-sale/non-harvest records count as spent, archived records are excluded, and share/HTML/CSV source data remains stable.
- Story 1.2 review deferred CSV formula-injection hardening; do not silently change CSV escaping in this story.

Story 1.1 established:

- `src/db` migration runner and baseline schema.
- `npm run test:migrations`.
- Lazy database opening and farmer-safe startup failure handling.
- The no-new-dependency Node test style used by both migration and regression tests.

### Git Intelligence

Recent commits show the current direction:

- `0c6d399 Refactor database access in farmRepository to use a singleton pattern; enhance migration handling with applied migration names; add current report rules for farm reporting`
- `ba9bc3f feat: Add comprehensive documentation and project structure for Masona Farms`
- `1d497f4 chore: checkpoint before BMAD planning`

Use the current report helper/test pattern from `0c6d399` as the local convention.

### Files Expected To Change

Likely update:

- `App.tsx` - remove inline dashboard metric and export orchestration logic, keeping Reports UI behavior.
- `src/reports/currentReportRules.ts` - add prepared dashboard/report view-model helpers.
- `src/services/reportExports.ts` - new export orchestration helper with injectable dependencies.
- `scripts/run-regression-tests.mjs` - extend regression coverage for the extracted helpers.

Likely unchanged:

- `src/data/farmRepository.ts` - no repository behavior change is needed.
- `src/data/types.ts` - avoid type shape changes unless a small exported report-specific type is clearly needed.
- Database migration files - no schema change.

### Testing Requirements

Automated:

- `npm run test:regression`
- `npm run test:migrations`
- `npm run typecheck`

Manual:

- Open the Reports tab with existing or seeded data.
- Confirm visible report cards still show the same labels, values, and hints.
- Trigger Share and compare the text report against pre-extraction values.
- Trigger PDF export and confirm it creates/shares the same report content or shows the same fallback alert when sharing is unavailable.
- Trigger CSV export and confirm rows, file name, share behavior, and fallback text sharing match current behavior.
- Include an archived record in the data set so archive exclusion is verified indirectly through reports and directly through record lists.

### Scope Boundaries

Do not do these in Story 1.3:

- Do not change finance rules.
- Do not make `Payment` count as earned or ignored yet.
- Do not make `Harvest` count as revenue.
- Do not add estimate labels.
- Do not add report scopes by farm, enterprise, unit, crop cycle, supplier, worker, buyer, or date range.
- Do not split `ReportsScreen` into a new screen file unless it is very small and clearly mechanical; Story 1.4 owns screen splitting.
- Do not add new dependencies.
- Do not change database schema, migrations, repository return shapes, or user-facing labels.

### References

- [Epic and Story 1.3 source](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/epics.md)
- [Architecture plan](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/architecture.md)
- [PRD](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/prd.md)
- [Experience spine](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/ux-designs/ux-Masona%20Farms-2026-06-17/EXPERIENCE.md)
- [Design spine](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/ux-designs/ux-Masona%20Farms-2026-06-17/DESIGN.md)
- [Current app report/export call sites](C:/Users/justp/Documents/Masona%20Farms/App.tsx)
- [Current report helper](C:/Users/justp/Documents/Masona%20Farms/src/reports/currentReportRules.ts)
- [Regression test harness](C:/Users/justp/Documents/Masona%20Farms/scripts/run-regression-tests.mjs)
- [Package manifest](C:/Users/justp/Documents/Masona%20Farms/package.json)
- [Expo Print docs](https://docs.expo.dev/versions/v54.0.0/sdk/print/)
- [Expo Sharing docs](https://docs.expo.dev/versions/v54.0.0/sdk/sharing/)
- [Expo FileSystem docs](https://docs.expo.dev/versions/v54.0.0/sdk/filesystem/)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- `npm run test:regression` - passed, 6 tests.
- `npm run test:migrations` - passed, 7 tests.
- `npm run typecheck` - passed.
- Manual Expo/mobile Reports verification passed per Chimwemwe: Reports tab, totals/cards, Share, PDF, CSV, archived-record exclusion, and visible labels match pre-extraction behavior.

### Completion Notes List

- Extended `src/reports/currentReportRules.ts` with `DashboardMetric`, `ReportModel`, `buildDashboardMetrics()`, and `buildReportModel()` so report math/view-model construction is outside `App.tsx`.
- Added `src/services/reportExports.ts` with injectable share/PDF/CSV export orchestration that preserves current native calls, fallbacks, file names, MIME types, and farmer-facing failure copy.
- Updated `ReportsScreen` in `App.tsx` to render from the extracted report model and wire extracted export callbacks while keeping the current Reports UI labels and buttons.
- Strengthened `scripts/run-regression-tests.mjs` with dashboard metric and export orchestration branch coverage, including fallback and error behavior.
- Manual Reports verification passed; all story tasks and subtasks are complete and the story is ready for review.

### File List

- App.tsx
- scripts/run-regression-tests.mjs
- src/reports/currentReportRules.ts
- src/services/reportExports.ts
- _bmad-output/implementation-artifacts/1-3-extract-report-calculations-and-exports-from-app-tsx.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-06-18: Story created and marked ready for development.
- 2026-06-18: Extracted dashboard report model and export orchestration; automated checks passed; manual mobile Reports verification remains.
- 2026-06-18: Manual mobile Reports verification passed; story moved to review.
