---
baseline_commit: 1d497f427c72fdda4d85d984350f26f6d9c4d516
---

# Story 1.1: Add Versioned Local Migrations Without Changing Farmer Workflows

Status: in-progress

Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

## Story

As a farmer,
I want app updates to keep my existing records safe,
so that I can continue using Masona Farms without losing field, crop-cycle, photo, reminder, or money records.

## Acceptance Criteria

1. Given an existing local database created by the current app, when the app initializes after the migration runner is added, then all existing fields, crop cycles, records, photos, reminders, and profile data still load, and the baseline migration is recorded exactly once.
2. Given the same existing local database, when initialization runs more than once, then no duplicate crop cycles, records, photos, reminders, or migration rows are created.
3. Given a fresh install, when the app initializes, then the same current tables are created through the migration path, and the app still reaches the first-run profile flow.
4. Given a record has `deleted_at` set, when initialization and migrations complete, then that record remains soft-archived and does not appear in normal `getRecords()` results.
5. Given a migration fails, when initialization catches the failure, then no destructive data change is attempted, existing records remain on the phone, and any farmer-facing error uses plain language.
6. Given current repository APIs are used by `App.tsx`, when this story is complete, then `initializeDatabase()`, `getFields()`, `getCropCycles()`, `getRecords()`, `getPhotos()`, `getReminders()`, `getUserProfile()`, and write methods remain compatible with existing callers.

## Tasks / Subtasks

- [x] Add a local migration module and registry. (AC: 1, 2, 3)
  - [x] Create a small `src/db` boundary for database opening, migration definitions, migration helpers, and migration execution.
  - [x] Keep the database name `masona-farms.db`.
  - [x] Add a `schema_migrations` table with at least migration id, name, and applied timestamp; include app version if it can be read without adding risky dependencies.
  - [x] Make migration application ordered and idempotent.
- [x] Move the current schema creation into baseline migration `001`. (AC: 1, 3, 6)
  - [x] Capture the current tables exactly: `app_meta`, `fields`, `crop_cycles`, `records`, `photos`, `reminders`, and `user_profiles`.
  - [x] Include the additive columns currently handled by `ensureColumn()` in the baseline schema or compatibility baseline path.
  - [x] Preserve current repository read/write behavior and data shapes.
- [x] Safely baseline existing databases. (AC: 1, 2, 4)
  - [x] Detect a pre-migration database by existing current tables/data.
  - [x] Ensure missing legacy additive columns are still added safely before marking baseline complete.
  - [x] Insert the baseline migration record exactly once for already-created databases.
  - [x] Preserve existing `app_meta.seeded` behavior, field-to-cycle backfill, and record-to-cycle linking without duplicating data.
- [x] Refactor `src/data/farmRepository.ts` to use the migration runner. (AC: 6)
  - [x] Keep public repository function names stable for `App.tsx`.
  - [x] Remove inline bulk schema creation from `initializeDatabase()` once equivalent migration coverage exists.
  - [x] Keep `ensureColumn()` only as an internal migration helper or compatibility helper with hard-coded table/column inputs.
- [x] Add migration/repository regression tests. (AC: 1, 2, 3, 4)
  - [x] Add a test command and minimal test tooling only if needed; do not introduce a heavy framework without reason.
  - [x] Cover fresh install initialization.
  - [x] Cover an existing current-schema database being marked as baseline.
  - [x] Cover repeated initialization.
  - [x] Cover soft-archived records staying hidden from normal record lists.
  - [x] Cover existing profile, fields, crop cycles, records, photos, and reminders remaining readable.
- [ ] Verify farmer-visible flows still work. (AC: 3, 4, 5, 6)
  - [x] Run `npm run typecheck`.
  - [x] If tests are added, run the relevant test command.
  - [ ] Manually verify first-run profile setup, existing profile load, field list, crop-cycle list, record list, photo list, reminder list, archive behavior, and adding a new record.

## Dev Notes

### Current State

- The app is a single-device Expo React Native app with local SQLite persistence and no backend, auth, sync, or cloud database. [Source: docs/architecture.md#Architecture Summary]
- `App.tsx` initializes the database once through `initializeDatabase()` and reloads data through repository functions after writes. [Source: docs/architecture.md#Application Flow]
- Persistence is centralized in `src/data/farmRepository.ts`, which currently opens `SQLite.openDatabaseSync("masona-farms.db")`. [Source: src/data/farmRepository.ts]
- `initializeDatabase()` currently runs `PRAGMA journal_mode = WAL`, creates all current tables inline, runs hard-coded `ensureColumn()` calls, then uses `app_meta.seeded` to avoid repeating seed logic. [Source: src/data/farmRepository.ts]
- Existing backfill behavior matters: `ensureCropCyclesForExistingFields()` creates active crop cycles for existing fields, and `migrateExistingRecordsToCropCycles()` links old records to crop cycles by field/crop matching. Preserve this behavior unless a test proves an existing bug and the fix is intentionally scoped. [Source: src/data/farmRepository.ts]
- Soft archive is implemented with `records.deleted_at`; `getRecords()` filters `WHERE deleted_at IS NULL`. This must remain unchanged. [Source: src/data/farmRepository.ts]

### Required Tables To Preserve

The baseline migration must preserve these production data tables:

- `app_meta`
- `user_profiles`
- `fields`
- `crop_cycles`
- `records`
- `photos`
- `reminders`

Do not drop, rename, split, or backfill these tables into new platform tables in this story. Future stories handle structured crop records, platform foundation tables, sync, inventory, and finance integrity. [Source: _bmad-output/planning-artifacts/architecture.md#6.1 Existing Tables To Preserve]

### Current Schema Snapshot

- `fields`: `id`, `crop`, `field`, `area`, `variety`, `planting_date`, `expected_harvest`, `stage`, `progress`, `status`, `accent`, `created_at`.
- `crop_cycles`: `id`, `field_id`, `field`, `crop`, `variety`, `planting_date`, `expected_harvest`, `stage`, `status`, `created_at`.
- `records`: `id`, `type`, `field`, `crop_cycle_id`, `crop_cycle_name`, `detail`, `quantity`, `date`, `amount`, `icon`, `tone`, `deleted_at`, `created_at`.
- `photos`: `id`, `field`, `category`, `record_id`, `record_label`, `uri`, `caption`, `created_at`.
- `reminders`: `id`, `title`, `detail`, `field`, `due_at`, `tone`, `icon`, `notification_id`, `created_at`.
- `user_profiles`: `id`, `farmer_name`, `farm_name`, `location`, `created_at`, `onboarding_completed`.
- `app_meta`: `key`, `value`.

Use `docs/data-models.md` and `src/data/farmRepository.ts` as the source of truth for exact column nullability and current read/write expectations.

### Migration Design Guardrails

- Add versioned SQLite migrations before any significant table split. This story is the foundation for future structured crop tables and platform tables. [Source: _bmad-output/planning-artifacts/architecture.md#6.2 Migration Strategy]
- The migration runner needs a `schema_migrations` table with migration id, migration name, applied timestamp, and app version if feasible. [Source: _bmad-output/planning-artifacts/architecture.md#6.2 Migration Strategy]
- Migrations should be ordered TypeScript modules, not ad hoc inline edits inside UI code. [Source: _bmad-output/planning-artifacts/architecture.md#6.2 Migration Strategy]
- Existing databases created before this story must be detected and marked as baseline safely. Do not duplicate records and do not recreate seed data. [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- Keep compatibility reads working. Later stories may let `getFields()`, `getCropCycles()`, and `getRecords()` read from new platform/structured tables, but this story keeps current shapes. [Source: _bmad-output/planning-artifacts/architecture.md#6.4 Compatibility Views Or Read Models]
- If a migration fails, stop and preserve the old schema/data. Farmer-facing copy must avoid words such as schema, migration, mutation, or foreign key. Use plain wording such as "Your records are still saved on this phone." [Source: _bmad-output/planning-artifacts/ux-designs/ux-Masona Farms-2026-06-17/EXPERIENCE.md#Voice and Tone]

### Expo SQLite Notes

- Installed dependency is `expo-sqlite` `~16.0.10` in `package.json`; stay compatible with the installed Expo SDK instead of upgrading dependencies in this story.
- The current code uses synchronous Expo SQLite APIs: `openDatabaseSync`, `execSync`, `runSync`, `getAllSync`, `getFirstSync`, and `withTransactionSync`. Keep this style unless the whole repository boundary is intentionally adapted.
- Expo's current SQLite docs show migration examples using `PRAGMA user_version`, ordered version checks, and WAL setup, and warn that bulk `execAsync()` does not escape parameters. In this codebase, migration SQL should stay hard-coded, and data writes should use parameterized `runSync` calls where values are involved. [Source: https://docs.expo.dev/versions/latest/sdk/sqlite/]
- Do not introduce SQLCipher, libSQL, web SQLite setup, or provider-based app architecture in this story. Those are not needed to meet the acceptance criteria.

### File Structure Guidance

Recommended paths:

- `src/db/database.ts`: opens/exports the SQLite database or factory helpers.
- `src/db/migrations/types.ts`: migration type definitions.
- `src/db/migrations/001_baseline_current_schema.ts`: current schema and baseline compatibility.
- `src/db/migrations/index.ts`: ordered migration registry.
- `src/db/migrate.ts`: `runMigrations(db)` and migration metadata helpers.
- `src/data/farmRepository.ts`: repository API stays public; delegates initialization to migration runner.

This path follows the architecture target for `src/db` while keeping existing `src/data` domain types and repository API stable. [Source: _bmad-output/planning-artifacts/architecture.md#5.1 Near-Term Mobile Architecture]

### Anti-Patterns To Avoid

- Do not rewrite `App.tsx` or redesign screens in this story.
- Do not add structured fertilizer, chemical, watering, labour, expense, harvest, sale, or payment tables yet.
- Do not add organisations, farms, enterprises, production units, production cycles, or production subjects yet.
- Do not enable sync, queue writes, or add backend/auth behavior.
- Do not parse free text into official supplier, buyer, product, dosage, or payment fields.
- Do not remove `app_meta.seeded` behavior unless an equivalent compatibility gate is tested.
- Do not use `ensureColumn()` as the main future migration system; it may remain only as a compatibility helper for known columns.
- Do not permanently delete production or financial records.

### Testing Requirements

No automated test framework exists today; `npm run typecheck` is the only configured verification command. [Source: docs/development-guide.md#Testing Setup]

The dev agent should add focused automated coverage for this story if practical. The tests should be small and repository-centered. If Expo SQLite is difficult to execute in Node, isolate migration planning/helpers enough to test them, and document any manual SQLite verification that remains.

Minimum automated or manual scenarios:

- Fresh install: empty database initializes, current tables exist, `schema_migrations` contains baseline once, and `getUserProfile()` returns `null`.
- Existing current-schema database: seeded profile, field, crop cycle, record, photo, reminder, and archived record survive initialization.
- Repeated initialization: migration rows are not duplicated and crop cycles are not duplicated.
- Soft archive: a record with `deleted_at` remains hidden from `getRecords()`.
- Compatibility writes: after migration, adding a field creates a crop cycle, adding a record links to the selected crop cycle, and adding a photo/reminder still reads back.

### Manual Verification Checklist

- Launch the app from a clean install and confirm the profile setup flow appears.
- Save a profile and confirm the app loads Home.
- Add a field and confirm Production/Fields and active crop-cycle reads still work.
- Add at least one fertilizer or expense record and confirm it appears in the log and reports still update.
- Archive a record and confirm it no longer appears in normal record lists or report totals.
- Add a photo/receipt and a reminder and confirm both still display.
- Run initialization twice by restarting the app and confirm no duplicate fields, crop cycles, records, photos, reminders, or migration rows.

### Previous Story Intelligence

This is the first implementation story in Epic 1, so there is no previous story file to learn from.

### Git Intelligence

Recent git history has only one local checkpoint commit: `1d497f4 chore: checkpoint before BMAD planning`. There are no prior implementation commits establishing a migration or test pattern. Use the current repository conventions and the planning artifacts as the guide.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#6.2 Migration Strategy]
- [Source: _bmad-output/planning-artifacts/prd.md#15. Migration And Backward Compatibility]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-Masona Farms-2026-06-17/EXPERIENCE.md#Offline, Sync, And Migration UX]
- [Source: docs/architecture.md#Data Architecture]
- [Source: docs/data-models.md#Tables]
- [Source: docs/development-guide.md#Testing Setup]
- [Source: docs/technical-debt-and-prd-conflicts.md#Highest-Impact Technical Debt]
- [Source: src/data/farmRepository.ts]
- [Source: package.json]
- [Source: https://docs.expo.dev/versions/latest/sdk/sqlite/]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-06-18: `npm run test:migrations` passed: fresh baseline, existing current-schema baseline, repeated initialization idempotency, legacy additive columns, failed migration rollback, preserved repository reads, and soft-archived records hidden from normal record lists.
- 2026-06-18: `npm run typecheck` passed.
- 2026-06-18: Manual Expo/device verification not run in this terminal session; farmer-visible flow checklist remains open.

### Completion Notes List

- Added a versioned local migration boundary under `src/db` with database opening, migration types, helper functions, ordered registry, and baseline migration `001`.
- Moved current SQLite table creation and known additive compatibility columns into the baseline migration while keeping the database name `masona-farms.db`.
- Added `schema_migrations` with migration id, name, applied timestamp, and nullable app version; migration application is ordered and idempotent.
- Refactored `initializeDatabase()` to run migrations first, then preserve existing `app_meta.seeded`, crop-cycle backfill, and old record linking behavior.
- Added a plain-language startup alert if database preparation fails: "Your records are still saved on this phone."
- Added focused migration regression tests using Node built-in test tooling and the installed TypeScript compiler, without adding a new dependency.
- Remaining limitation: manual Expo/device verification must still be completed before this story can move to review.

### File List

- App.tsx
- package.json
- scripts/run-migration-tests.mjs
- src/data/farmRepository.ts
- src/db/database.ts
- src/db/migrate.ts
- src/db/migrations/001_baseline_current_schema.ts
- src/db/migrations/helpers.ts
- src/db/migrations/index.ts
- src/db/migrations/types.ts

### Change Log

- 2026-06-18: Added local versioned migration runner and baseline schema migration.
- 2026-06-18: Refactored repository initialization to use migrations while preserving current public APIs.
- 2026-06-18: Added lightweight migration regression tests and startup failure copy.
