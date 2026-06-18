---
baseline_commit: ba9bc3f519409273baf0fdce64ffea0fcf61b0e5
---

# Story 1.2: Add Repository And Report Regression Tests For Current Behavior

Status: in-progress

Completion Note: Ultimate context engine analysis completed - comprehensive developer guide created.

## Story

As a farmer,
I want updates to preserve the reports and records I already rely on,
so that improvements do not quietly break my farm history.

## Acceptance Criteria

1. Given seeded field, crop-cycle, sale, fertilizer, labour, harvest, payment, and archived records, when report totals are calculated, then totals match current app behavior and archived records are excluded.
2. Given the current report/export source data, when share, HTML/PDF source, and CSV source are generated or validated, then they use the same values and record rows as the current app behavior.
3. Given repository CRUD tests running against the migrated baseline schema, when fields, crop cycles, records, photos, reminders, and profile data are saved and reloaded, then returned TypeScript shapes match current app expectations.
4. Given the app initializes more than once against existing data, when migration and repository initialization run again, then crop cycles, migration rows, and seeded data are not duplicated.
5. No runtime finance rules, farmer-facing wording, record lists, archive behavior, or report calculations are intentionally changed in this story.

## Tasks / Subtasks

- [x] Add regression-test coverage using the existing no-new-dependency Node test pattern. (AC: 1, 2, 3, 4)
  - [x] Reuse or carefully extend the `node:test` harness in [scripts/run-migration-tests.mjs](C:/Users/justp/Documents/Masona%20Farms/scripts/run-migration-tests.mjs); do not introduce Jest, Vitest, or other test libraries unless explicitly approved.
  - [x] Add a package script for the new regression coverage, or expand the existing migration script if that keeps the test surface clearer.
  - [x] Keep `npm run test:migrations` working because Story 1.1 established it as the migration safety check.

- [x] Cover repository CRUD and reload behavior against a migrated baseline test database. (AC: 3, 4)
  - [x] Test `initializeDatabase()` after `runMigrations()` and repeated initialization.
  - [x] Test profile save/reload, field creation, automatic active crop cycle creation, field update propagation, record creation, photo creation, reminder creation, and `deleteRecord()` soft archive exclusion from `getRecords()`.
  - [x] Assert returned objects match the app-facing shapes from [src/data/types.ts](C:/Users/justp/Documents/Masona%20Farms/src/data/types.ts), including `cropCycleId`, `cropCycleName`, `deletedAt`, photo linkage, reminder tone/icon fields, and onboarding profile fields.

- [x] Lock current report totals and archive exclusion. (AC: 1, 5)
  - [x] Build a fixture with at least one active field/crop cycle and records for `Sale`, `Fertilizer`, `Labour`, `Harvest`, `Payment`, plus one archived money record.
  - [x] Assert current imperfect behavior exactly: `Sale` amounts count as earned, `Harvest` amounts are ignored, all other non-archived record amounts count as spent, and archived records do not count.
  - [x] Assert `Net profit` is earned minus spent using those current rules.

- [x] Lock export/report-source behavior without doing the full report extraction planned for Story 1.3. (AC: 2, 5)
  - [x] Prefer a minimal pure helper boundary only if tests cannot otherwise call production report logic.
  - [x] Do not refactor `ReportsScreen`, navigation, report layout, PDF/share/CSV user flows, or finance-rule semantics in this story.
  - [x] If a helper is extracted for testability, keep it behavior-only and small; Story 1.3 owns the broader extraction of report calculations and exports from `App.tsx`.
  - [x] Verify CSV escaping/source rows for field and record data, and HTML/share source totals where production code can be reached safely.

- [x] Verify and document the result. (AC: 1, 2, 3, 4, 5)
  - [x] Run `npm run test:migrations`.
  - [x] Run the new regression test command.
  - [x] Run `npm run typecheck`.
  - [ ] Manually verify current report flows with seeded or real local data: Total spent, Total earned, Net profit, exports, archived-record exclusion, and existing record lists match pre-change behavior.

### Review Findings

- [x] [Review][Patch] Repeated init regression test misses the existing-field restart path [scripts/run-regression-tests.mjs:293]
- [x] [Review][Patch] Export-source regression test does not assert every generated field and record row [scripts/run-regression-tests.mjs:452]
- [x] [Review][Patch] Manual verification task is checked off even though the completion notes say device UI verification was not run [_bmad-output/implementation-artifacts/1-2-add-repository-and-report-regression-tests-for-current-behavior.md:52]
- [x] [Review][Defer] App startup catch block covers profile/data refresh as well as database open [App.tsx:78] — deferred, pre-existing to Story 1.2 review scope
- [x] [Review][Defer] CSV export does not guard against spreadsheet formula injection [src/reports/currentReportRules.ts:168] — deferred, pre-existing export hardening; Story 1.2 preserves current export behavior

## Dev Notes

### Business Context

This story is a technical enabler for Epic 1. Its purpose is to make future refactors safer before finance-rule changes, structured records, production-cycle upgrades, and sync work begin. The tests should protect the current local farmer workflow, even where current report behavior is not yet accounting-grade. [Source: C:/Users/justp/Documents/Masona Farms/_bmad-output/planning-artifacts/epics.md#Story-1.2]

### Current Behavior To Preserve

- App-level totals in [App.tsx](C:/Users/justp/Documents/Masona%20Farms/App.tsx) currently use:
  - earned/revenue: records where `record.type === "Sale"`
  - spent/expenses: records where `record.type !== "Sale" && record.type !== "Harvest"`
  - profit: earned minus spent
- Field detail totals use the same `Sale` versus non-`Sale`/non-`Harvest` split.
- `getBestCrop()` treats `Sale` as positive, `Harvest` as zero, and all other record types as negative.
- This means `Payment` currently counts as spent if it has an amount. That is not the future desired finance model, but it is the behavior to lock in this story.
- `getRecords()` excludes archived rows with `deleted_at IS NULL`; `deleteRecord()` is a soft archive, not a permanent delete. [Source: C:/Users/justp/Documents/Masona Farms/src/data/farmRepository.ts]

### Report And Export Surface

- Report UI and helper logic currently live in [App.tsx](C:/Users/justp/Documents/Masona%20Farms/App.tsx), including `ReportsScreen`, `buildDashboardMetrics`, `getBestCrop`, `buildAgronomistSummary`, `buildShareReport`, `buildReportHtml`, `buildReportCsv`, `csvCell`, and `escapeHtml`.
- Existing PDF/CSV/share export capability is a UX requirement because farmers may rely on exports while the app is local-only or used with poor connectivity. Preserve it. [Source: C:/Users/justp/Documents/Masona Farms/_bmad-output/planning-artifacts/ux-designs/ux-Masona Farms-2026-06-17/EXPERIENCE.md#Foundation]
- Future report language should prefer labels like `Total spent`, `Total earned`, and `Net profit`, but this story should not change visible labels. [Source: C:/Users/justp/Documents/Masona Farms/AGENTS.md#Reporting-rules]

### Repository Surface

Primary repository file: [src/data/farmRepository.ts](C:/Users/justp/Documents/Masona%20Farms/src/data/farmRepository.ts).

Relevant public functions:

- `initializeDatabase`
- `getFields`
- `getCropCycles`
- `getRecords`
- `getPhotos`
- `getReminders`
- `getUserProfile`
- `saveUserProfile`
- `resetFarmData`
- `addField`
- `updateField`
- `addRecord`
- `deleteRecord`
- `addPhoto`
- `addReminder`

Returned data shapes are defined in [src/data/types.ts](C:/Users/justp/Documents/Masona%20Farms/src/data/types.ts). The dev agent must assert app-facing objects, not only raw SQL rows.

### Migration And Test Harness Context

Story 1.1 added versioned local migrations and a no-new-dependency Node test harness:

- [src/db/database.ts](C:/Users/justp/Documents/Masona%20Farms/src/db/database.ts)
- [src/db/migrate.ts](C:/Users/justp/Documents/Masona%20Farms/src/db/migrate.ts)
- [src/db/migrations/index.ts](C:/Users/justp/Documents/Masona%20Farms/src/db/migrations/index.ts)
- [src/db/migrations/001_baseline_current_schema.ts](C:/Users/justp/Documents/Masona%20Farms/src/db/migrations/001_baseline_current_schema.ts)
- [scripts/run-migration-tests.mjs](C:/Users/justp/Documents/Masona%20Farms/scripts/run-migration-tests.mjs)

Use the same pattern unless there is a strong reason not to:

- Node built-in `node:test`
- Node built-in `assert`
- `typescript.transpileModule` loader for TypeScript files
- Fake `expo-sqlite`/SQLite database implementation for local tests

The docs may still say there is no automated test framework; treat that as stale after Story 1.1. The current source of truth is `package.json`, which has `test:migrations`. [Source: C:/Users/justp/Documents/Masona Farms/package.json]

### Architecture Constraints

- Keep the app modular and crop-cycle-centric. Records should attach to the crop cycle where possible, not only the field. [Source: C:/Users/justp/Documents/Masona Farms/AGENTS.md#Data-design-rules]
- Do not hard-code chilli-specific test assumptions into general repository/report behavior. A chilli fixture is acceptable only as example data.
- Important production and financial records should be archived rather than deleted. [Source: C:/Users/justp/Documents/Masona Farms/AGENTS.md#Data-design-rules]
- Store money values consistently, but do not introduce new finance semantics in this story. Future stories will separate sales, payments, outstanding money, harvest quantity, and expense categories.
- Current app is local-only. Tests should not assume cloud sync, network access, authentication, or multi-user state.

### UX Constraints

- This story should not change visible UX, but it protects UX-critical behavior: fast local data entry, existing record lists, archive behavior, and report exports.
- Manual verification should use farmer-facing labels and flows: `Total spent`, `Total earned`, `Net profit`, record lists, exports, and archived records.
- Do not introduce technical wording into user-facing report or archive text while adding test seams. [Source: C:/Users/justp/Documents/Masona Farms/_bmad-output/planning-artifacts/ux-designs/ux-Masona Farms-2026-06-17/EXPERIENCE.md#Voice-and-Tone]

### Scope Boundaries

Do not do these in Story 1.2:

- Do not change finance rules.
- Do not make `Payment` count as earned or ignored yet.
- Do not make `Harvest` count as revenue.
- Do not redesign Reports, Work Log, Add Entry, or archive UI.
- Do not add structured fertilizer/chemical/watering/labour/expense/harvest/sale/payment models.
- Do not perform the broad report extraction assigned to Story 1.3.
- Do not add external test dependencies without approval.

### Previous Story Intelligence

Story 1.1 completed migration groundwork and code review corrections:

- Migration tests passed with 7 assertions.
- `npm run typecheck` passed.
- `farmRepository` now opens the database lazily through `openFarmDatabase()` and runs migrations inside `initializeDatabase()`.
- Repeated initialization must preserve seeded metadata and avoid duplicate crop cycles.
- The fake database in `scripts/run-migration-tests.mjs` already models `app_meta`, `fields`, `crop_cycles`, `records`, `photos`, `reminders`, and `user_profiles`; extend it carefully if needed instead of creating an unrelated SQL simulator.

### Testing Requirements

Automated:

- `npm run test:migrations`
- New regression test command for repository/report behavior
- `npm run typecheck`

Manual:

- With seeded or real local data, open Reports and confirm Total spent, Total earned, Net profit, exports, archived-record exclusion, and existing record lists match pre-change behavior.
- Include at least one archived record in manual verification so the report/list exclusion is actually checked.

### References

- [Epic and Story 1.2 source](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/epics.md)
- [PRD](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/prd.md)
- [Architecture plan](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/architecture.md)
- [Experience spine](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/ux-designs/ux-Masona%20Farms-2026-06-17/EXPERIENCE.md)
- [Design spine](C:/Users/justp/Documents/Masona%20Farms/_bmad-output/planning-artifacts/ux-designs/ux-Masona%20Farms-2026-06-17/DESIGN.md)
- [Repository](C:/Users/justp/Documents/Masona%20Farms/src/data/farmRepository.ts)
- [App report helpers](C:/Users/justp/Documents/Masona%20Farms/App.tsx)
- [Migration test harness](C:/Users/justp/Documents/Masona%20Farms/scripts/run-migration-tests.mjs)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run test:migrations` - passed, 7 tests.
- `npm run test:regression` - passed, 4 tests after review patches.
- `npm run typecheck` - passed.

### Completion Notes List

- Added `src/reports/currentReportRules.ts` as a small behavior-only report helper so production report totals and export-source builders can be tested without changing farmer-facing report flows.
- Updated `App.tsx` to call the report helper for totals, field report values, best crop, agronomist summary, share report, HTML report, and CSV report.
- Added `scripts/run-regression-tests.mjs` using Node `node:test`, `assert`, TypeScript transpilation, and a fake SQLite database matching the existing Story 1.1 test style.
- Covered repository save/reload behavior for profile, fields, active crop cycles, records, photos, reminders, field update propagation, repeated initialization, and soft archive exclusion.
- Covered current report behavior: `Sale` counts as earned, `Harvest` is ignored, `Payment` and other non-sale/non-harvest records count as spent, archived records are excluded, and share/HTML/CSV source data remains stable.
- Code review patches strengthened repeated-initialization and export row assertions, and corrected the manual verification task to remain open until a device/local UI pass is performed.
- Manual UI verification on a device was not run in this coding pass; the seeded regression fixtures validate the same report/export/archive behavior at source level.

### File List

- App.tsx
- package.json
- scripts/run-regression-tests.mjs
- _bmad-output/implementation-artifacts/deferred-work.md
- src/reports/currentReportRules.ts

## Change Log

- 2026-06-18: Story created and marked ready for development.
- 2026-06-18: Implemented repository and report regression tests; status moved to review.
- 2026-06-18: Addressed code review patch findings; status returned to in-progress pending manual UI verification.
