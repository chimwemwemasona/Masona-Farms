---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Masona Farms-2026-06-17/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Masona Farms-2026-06-17/DESIGN.md
  - docs/index.md
  - docs/project-overview.md
  - docs/architecture.md
  - docs/source-tree-analysis.md
  - docs/component-inventory.md
  - docs/data-models.md
  - docs/api-contracts.md
  - docs/development-guide.md
  - docs/technical-debt-and-prd-conflicts.md
  - docs/project-scan-report.json
  - README.md
  - APP_PLAN.md
  - package.json
  - app.json
  - tsconfig.json
  - App.tsx
  - src/data/types.ts
  - src/data/farmRepository.ts
  - src/data/cropLibrary.ts
  - src/data/cropPractices.ts
  - src/data/farmData.ts
  - src/services/notifications.ts
  - src/theme.ts
workflowType: 'architecture'
project_name: 'Masona Farms'
user_name: 'Chimwemwe'
date: '2026-06-17'
status: 'complete'
lastStep: 8
completedAt: '2026-06-17'
---

# Masona Farms Brownfield Architecture Plan

## 1. Executive Summary

Masona Farms is currently a single-device Expo React Native Android app with local SQLite storage. It already gives farmers useful offline field, crop-cycle, record, calendar, photo, reminder, and report workflows. The approved PRD expands that working wedge into a multi-enterprise farm-management platform with organisations, farms, production units, production cycles, structured input records, inventory, sales, payments, roles, audit trails, and offline sync.

This architecture plan evolves the existing app incrementally. The first architectural priority is not a rewrite. It is to make the current local app safer to change by introducing versioned migrations, modular boundaries, typed services, and test coverage around persistence and reports. Structured crop records can then be added beside the current generic `records` table. Platform concepts and cloud sync should follow only after local data preservation, schema versioning, and finance rules are stable.

## 2. Current Baseline

### Runtime Shape

- App type: Expo React Native mobile app.
- Main platform target: Android portrait, with iOS configured but not primary.
- Entry point: `App.tsx` through Expo `node_modules/expo/AppEntry.js`.
- Local database: `expo-sqlite`, database name `masona-farms.db`.
- State management: React hooks inside `MasonaApp`.
- Navigation: custom bottom tab state, no React Navigation dependency.
- Backend: none.
- Authentication and authorization: none.
- Automated tests: none beyond `npm run typecheck`.

### Implemented Product Capabilities

- Local farmer profile.
- Fields and active crop cycles.
- Crop library with ABE Chilli and generic crop fallback.
- Generic farm records for activity, planting, fertilizer, chemical, irrigation, expense, labor, harvest, sale, payment, restocking, and problem.
- Crop-cycle linkage for records.
- Soft archive for records through `deleted_at`.
- Photos and receipt links by local URI.
- Local reminders and Expo notifications.
- Calendar events from crop practice rules, records, expected harvest, and chemical follow-up.
- Simple total earned, total spent, net profit, field cost, hectare cost, best crop, PDF export, CSV export, and share output.

### Main Architectural Gaps

- `App.tsx` mixes application shell, screens, forms, validation, report generation, export generation, and styles.
- SQLite schema creation is imperative and unversioned.
- Generic records cannot reliably support supplier history, dosage basis, withholding notes, buyer, payment status, labour identity, inventory movement, or precise profit reporting.
- No farm, organisation, enterprise, production unit, production subject, supplier, customer, inventory, audit log, user, membership, or role tables.
- Local-only storage is not sync-capable offline architecture.
- Financial reporting rules are too broad: `Sale` is revenue, `Harvest` is ignored, and most other amounts are expenses.

## 3. Architecture Principles

1. Preserve existing farmer records before changing schema or financial rules.
2. Extend the local-first app before introducing cloud dependencies.
3. Add versioned migrations before adding structured tables.
4. Keep generic legacy records visible, but do not use them as the final platform data model.
5. Design around production cycles, not fields alone.
6. Separate crop-specific guidance from general recordkeeping.
7. Make every money-bearing record explicit about whether it is spent, earned, owed, or informational.
8. Introduce backend, identity, tenancy, and sync as a platform layer, not as UI-only flags.
9. Keep UX plain, fast, mobile-first, and honest about incomplete data.

## 4. Component Treatment Map

### 4.1 Components That Remain Unchanged

These can remain functionally intact during the first architecture phase:

| Component | Current location | Rationale |
|---|---|---|
| Expo app runtime | `package.json`, `app.json` | The current stack matches the mobile-first, offline field-entry requirement. |
| TypeScript strict mode | `tsconfig.json` | Keep as the baseline quality guard. |
| Local notification helper | `src/services/notifications.ts` | The module is already isolated and can continue serving reminders. |
| Theme token file | `src/theme.ts` | Keep as the source of visual constants, then gradually align radii and naming to the UX design spine. |
| Crop library data | `src/data/cropLibrary.ts` | Keep as local crop guidance, but ensure it remains a recommendation module rather than core domain schema. |
| Crop practice calculations | `src/data/cropPractices.ts` | Keep for calendar and insights while moving report and domain calculations elsewhere. |
| Local PDF/CSV/share capability | `App.tsx`, future export service | Preserve exports because they are valuable before cloud sync exists. |
| Soft archive behavior | `records.deleted_at` | Continue archive-by-default for production and finance records. |

### 4.2 Components That Are Extended

| Component | Current state | Extension direction |
|---|---|---|
| Local SQLite repository | `src/data/farmRepository.ts` owns schema and CRUD | Add migration runner, schema version table, repository modules, and compatibility reads. |
| `fields` | Crop field/plot facts | Become production units of type `field`; retain compatibility view/read model for current screens. |
| `crop_cycles` | Active crop cycles only | Become production cycles with status, close/cancel/archive, actual dates, targets, and history. |
| `records` | Generic legacy farm records | Remain as legacy work log and universal note trail; link to structured records where applicable. |
| Photos | Local URI references linked to field and optional record | Extend to attachments with scope, category, linked entity type, and future upload status. |
| Reminders | Local reminders and notification IDs | Extend to scheduled work, follow-ups, withholding checks, sync review, and payment collection. |
| Home | Dashboard and quick actions | Add needs-review group, incomplete data prompts, and sync status when available. |
| Fields screen | Current field and active-cycle list | Evolve into Production surface for farms, enterprises, units, cycles, and cycle history. |
| Records screen | Generic filtered record list | Evolve into Work Log across legacy and structured records. |
| Calendar | Month view, backfill, upcoming work | Add schedule filters, cycle filters, withholding dates, skipped watering, and overdue work. |
| Reports | Simple totals and exports | Add scoped, honest reports by farm, enterprise, unit, cycle, supplier, worker, buyer, and date range. |
| More screen | Profile, placeholders, photos | Evolve into Manage surface for suppliers, buyers, workers, inventory, sync, backup, settings, and access. |

### 4.3 Components That Must Be Refactored

| Component | Refactor reason | Target boundary |
|---|---|---|
| `App.tsx` | 3,000+ lines mixing unrelated responsibilities | Split into app shell, screens, feature components, forms, reports, exports, and hooks. |
| Report calculations | Embedded in `App.tsx` with broad type rules | Move to `src/domain/reports` or `src/services/reports` with tested finance rules. |
| Record form | One generic form for all record types | Introduce type-specific form modules with shared field components. |
| Validation | Inline alert checks | Move to per-form validation helpers with plain-English error output. |
| Export builders | Embedded HTML/CSV generation | Move to export service so report rules and exports share the same calculations. |
| Repository schema setup | Unversioned `CREATE TABLE` and `ensureColumn()` | Replace with versioned migrations, while keeping current setup as migration version 1. |
| Money semantics | `amount` meaning depends on `type` | Introduce transaction/cost/revenue allocation model and explicit payment status. |
| Field/cycle display duplication | Name copies in records/photos/reminders | Keep for compatibility, but use stable IDs as primary links in new models. |

### 4.4 New Components

These are new architectural components, introduced in sequence:

| Component | Purpose | First phase |
|---|---|---|
| `src/db/migrations` | Versioned SQLite migrations and data transforms | Phase 1 |
| `src/db/schemaVersion` or `schema_migrations` table | Track applied local migrations | Phase 1 |
| Repository test harness | Verify migrations, CRUD, archive behavior, and report rules | Phase 1 |
| Domain services | Keep business logic out of UI | Phase 1 |
| Screen/component folders | Modularize the current app without changing behavior | Phase 1 |
| Structured crop records | Fertilizer, chemical, watering, labour, expense, harvest, sale, payment | Phase 1 to Phase 3 |
| Supplier, buyer, worker tables | Reusable people and shop history | Phase 1 to Phase 3 |
| Inventory tables | Products, stock receipts, stock issues, adjustments, valuation | Phase 3 |
| Platform foundation tables | Organisation, farm, enterprise, production unit, production cycle, production subject | Phase 2 |
| Local sync queue | Tracks local create/update/archive actions before cloud sync | Phase 2 |
| Backend/API layer | Owns identity, tenancy, authorization, audit, sync, and platform data | Phase 2 |
| Auth and membership model | Users, roles, permissions, organisation/farm membership | Phase 2 |
| Audit log | Trusted trail for finance, inventory, health, permissions, and exports | Phase 2 |
| Media attachment service | Future cloud upload, local backup, and attachment preservation | Phase 2 to Phase 3 |

### 4.5 Deprecated Components

Deprecated does not mean removed immediately.

| Component or pattern | Deprecation rule |
|---|---|
| Generic `records` as the only record model | Keep for legacy history and unusual notes; do not use for final structured fertilizer, chemical, sale, payment, labour, or inventory workflows. |
| `ensureColumn()` as primary migration strategy | Keep only as temporary compatibility support until migration runner owns schema changes. |
| UI-only record type rules for finance | Replace with explicit financial classification and allocation. |
| `fields` as the top-level production model | Migrate to production units, with fields as one unit type. |
| Current `user_profiles.farm_name` as farm entity | Preserve for bootstrap, then map to farm/organisation setup. |
| Hard-coded 7-day chemical withholding reminder | Replace with user-editable withholding date and product-specific notes. |
| Placeholder Manage rows | Replace with real Inventory, Suppliers, Buyers, Workers, Sync, Backup, and Settings surfaces. |
| Device-local-only photo URI assumptions | Keep current URI references, but add attachment migration and backup/upload strategy. |

## 5. Target Architecture

### 5.1 Near-Term Mobile Architecture

```text
Masona Farms/
|-- App.tsx                         # Thin app root after refactor
|-- src/
|   |-- app/
|   |   |-- MasonaApp.tsx            # App shell, boot, providers
|   |   |-- navigation.ts            # Current tab model, later React Navigation if needed
|   |-- screens/
|   |   |-- HomeScreen.tsx
|   |   |-- ProductionScreen.tsx
|   |   |-- WorkLogScreen.tsx
|   |   |-- CalendarScreen.tsx
|   |   |-- ReportsScreen.tsx
|   |   |-- ManageScreen.tsx
|   |-- components/
|   |   |-- common/
|   |   |-- records/
|   |   |-- production/
|   |   |-- reports/
|   |-- forms/
|   |   |-- FieldForm.tsx
|   |   |-- RecordTypePicker.tsx
|   |   |-- FertilizerForm.tsx
|   |   |-- ChemicalForm.tsx
|   |   |-- WateringForm.tsx
|   |   |-- LabourForm.tsx
|   |   |-- ExpenseForm.tsx
|   |   |-- HarvestForm.tsx
|   |   |-- SaleForm.tsx
|   |   |-- PaymentForm.tsx
|   |-- data/
|   |   |-- cropLibrary.ts
|   |   |-- cropPractices.ts
|   |   |-- types.ts
|   |-- db/
|   |   |-- database.ts
|   |   |-- migrations/
|   |   |-- repositories/
|   |-- domain/
|   |   |-- production/
|   |   |-- records/
|   |   |-- finance/
|   |   |-- reports/
|   |   |-- sync/
|   |-- services/
|   |   |-- notifications.ts
|   |   |-- exports.ts
|   |   |-- media.ts
|   |-- theme.ts
|-- tests/
|   |-- db/
|   |-- domain/
|   |-- reports/
```

This structure should be introduced gradually. The first refactor should move code without changing behavior, then add tests, then change data shape.

### 5.2 Future Platform Architecture

The future platform should use a local-first mobile app plus a backend-owned trust boundary:

```text
Mobile App
  - local SQLite working store
  - local migrations
  - sync queue
  - offline entry forms
  - conflict review UX
  - exports and backup

Backend API
  - authentication
  - organisation and farm tenancy
  - authorization and roles
  - server-side validation
  - audit logging
  - sync endpoints
  - report endpoints for larger datasets
  - media upload references

Cloud Database
  - organisations, users, farms, enterprises
  - production units, subjects, cycles
  - structured production records
  - inventory, suppliers, buyers, workers
  - costs, revenue, payments
  - audit log and sync metadata
```

Backend stack is an open decision. The architecture requires a backend, but does not require choosing one before Phase 1 local stabilization. The backend choice should be made before implementing roles, cloud sync, tenant isolation, audit trails, or multi-user collaboration.

## 6. Data Architecture

### 6.1 Existing Tables To Preserve

- `app_meta`
- `user_profiles`
- `fields`
- `crop_cycles`
- `records`
- `photos`
- `reminders`

These tables are production data and must remain readable after migrations.

### 6.2 Migration Strategy

Introduce a migration runner before any significant table split.

Required migration features:

- A `schema_migrations` table with migration id, name, applied timestamp, and app version if available.
- Migrations stored as ordered TypeScript modules, not ad hoc inline edits.
- Idempotent checks where older app versions may have used `ensureColumn()`.
- Transactional migration execution where SQLite supports it.
- Backup/export prompt before destructive or large data-transform migrations.
- Test fixtures covering current schema, older schema shapes, and migration output.

`initializeDatabase()` should become orchestration:

1. Open database.
2. Enable WAL and foreign keys where safe.
3. Create migration tracking table.
4. Apply pending migrations.
5. Run compatibility backfills only when required.
6. Return typed repository access.

### 6.3 Database Migrations

#### Migration 001: Baseline Current Schema

Capture the existing schema as version 1:

- `app_meta`
- `user_profiles`
- `fields`
- `crop_cycles`
- `records`
- `photos`
- `reminders`
- Current additive columns currently handled by `ensureColumn()`

Compatibility: must recognize databases already created by the current app and mark baseline safely.

#### Migration 002: Stable IDs And Metadata

Add sync-ready metadata without enabling sync yet:

- `local_id`
- `server_id`
- `sync_status`
- `created_at`
- `updated_at`
- `archived_at` where relevant
- `legacy_source` where migrated from current tables

For existing rows, preserve current IDs as local IDs.

#### Migration 003: Production Foundation Local Tables

Add local platform foundation tables:

- `organisations`
- `farms`
- `enterprises`
- `production_units`
- `production_cycles`
- `production_subjects`

Initial backfill:

- `user_profiles.farm_name` seeds one local farm.
- Existing `fields` become `production_units` of type `field`.
- Existing `crop_cycles` become `production_cycles`.
- Existing crop names seed crop enterprises where needed.

#### Migration 004: Structured Crop Record Tables

Add structured tables while keeping `records`:

- `fertilizer_applications`
- `chemical_applications`
- `watering_records`
- `labour_records`
- `expense_records`
- `harvest_records`
- `sale_records`
- `payment_records`

Each structured table must link to the most precise available scope:

- `production_cycle_id` when known.
- `production_unit_id` when cycle is unknown.
- `farm_id` for farm/general records.
- Legacy `record_id` when derived from a generic record.

Only migrate structured fields when safely inferable. Otherwise keep the generic record as legacy history and mark missing structured data in the UI.

#### Migration 005: Reusable Parties And Products

Add:

- `suppliers`
- `buyers`
- `workers`
- `teams`
- `products`
- `input_products`

Backfill saved previous values from structured records where exact values exist. Avoid parsing old free-text detail into official supplier/product records unless the farmer confirms.

#### Migration 006: Inventory And Financial Integrity

Add:

- `stock_receipts`
- `stock_issues`
- `stock_transfers`
- `stock_adjustments`
- `inventory_batches`
- `cost_allocations`
- `revenue_allocations`
- `payment_allocations`

This migration should not run before report tests exist.

#### Migration 007: Sync And Audit Metadata

Add local tables needed before cloud sync:

- `sync_queue`
- `sync_conflicts`
- `audit_events`
- `media_attachments`

This prepares the mobile app for backend sync without forcing immediate cloud rollout.

### 6.4 Compatibility Views Or Read Models

During transition, existing screens may continue reading current shapes through compatibility functions:

- `getFields()` can read from `production_units` once migration is complete, while returning `CropField`.
- `getCropCycles()` can read from `production_cycles`, while returning `CropCycle`.
- `getRecords()` can return a merged Work Log from legacy `records` and structured records.
- Reports must declare whether they are using legacy estimates or structured finance records.

## 7. Domain Boundaries

### Production

Owns:

- Farms.
- Enterprises.
- Production units.
- Production cycles.
- Production subjects.
- Crop library and crop recommendations as advisory data.

Does not own:

- Payment status.
- Inventory stock valuation.
- User permissions.

### Work Records

Owns:

- Activity entries.
- Fertilizer, chemical, watering, labour, harvest, problem, and follow-up records.
- Legacy record visibility.

Does not own:

- Final finance calculations; it emits money effects to finance.

### Finance

Owns:

- Expense classification.
- Revenue classification.
- Payment status.
- Cost and revenue allocation.
- Profit report rules.
- Outstanding money.

Does not own:

- Crop guidance or production stage rules.

### Inventory

Owns:

- Products.
- Stock receipts.
- Stock issues.
- Transfers.
- Adjustments.
- Batch, expiry, unit cost, and valuation.

It emits production cost records when stock is issued to a production cycle.

### People And Parties

Owns:

- Suppliers.
- Buyers.
- Workers.
- Teams.
- Future users and memberships when backend identity exists.

### Sync And Platform

Owns:

- Local queue.
- Conflict detection.
- Server identity mapping.
- Tenant boundaries.
- Audit trail.
- Retry and rollback state.

## 8. API And Backend Direction

No API exists today. Backend work should not be simulated through frontend-only abstractions.

Before multi-user or cloud-backed claims, define:

- Authentication method.
- User, organisation, farm, and membership model.
- Role and permission matrix.
- Tenant isolation checks.
- REST or GraphQL API contract.
- Sync protocol, including local IDs, server IDs, idempotency keys, changed-at timestamps, and conflict rules.
- Audit logging requirements.
- Media upload and retention rules.

Recommended initial API scope:

- `POST /auth/*` or provider-specific auth integration.
- `GET /me`.
- Organisation and farm membership endpoints.
- CRUD for farms, enterprises, production units, production cycles.
- CRUD for structured records.
- Sync batch push/pull endpoints.
- Media attachment endpoints.
- Report endpoints only after local report rules are stable.

## 9. Backward Compatibility Requirements

1. Existing SQLite databases must open after the migration runner is introduced.
2. Existing local IDs must remain stable as local IDs.
3. Existing `fields` must appear as production units of type `field`.
4. Existing `crop_cycles` must appear as production cycles.
5. Existing `records` must remain visible in Work Log as legacy records.
6. Existing archived records with `deleted_at` must stay archived.
7. Existing photos must remain linked by local URI and visible where possible.
8. Existing reminders must continue to show and fire locally where notification IDs remain valid.
9. Existing report totals should either remain reproducible under legacy mode or show a clear "Report rules changed" note.
10. No migration should parse free text into official supplier, buyer, product, dosage, or payment fields without safe inference or user review.
11. Before local-to-cloud migration, the app must offer backup/export.
12. Future server IDs must not replace local IDs in a way that breaks offline references.

## 10. Rollout Plan

### Phase 1: Stabilize The Current Wedge

Architecture work:

- Add migration runner and baseline migration.
- Add repository and report tests.
- Split `App.tsx` by screens, forms, services, and domain helpers.
- Move report calculations and export builders out of UI.
- Keep current screens and user flows behaviorally equivalent.
- Add structured crop forms/tables one group at a time.

Product effect:

- Farmers keep using the app offline.
- Reports become more honest and testable.
- Developers can add PRD fields without breaking the whole shell.

### Phase 2: Introduce Platform Foundation

Architecture work:

- Add local organisation, farm, enterprise, production unit, production cycle, and production subject tables.
- Map existing profile, fields, and crop cycles into the platform model.
- Decide backend stack and API contract.
- Add auth, memberships, tenant isolation, and roles in backend design.
- Add local sync queue schema but keep sync feature-gated.

Product effect:

- Current crop workflows start using the same model that later supports livestock, poultry, aquaculture, and beekeeping.

### Phase 3: Inventory And Financial Integrity

Architecture work:

- Add suppliers, buyers, workers, products, stock movement, expense allocation, revenue allocation, and payment allocation.
- Connect inventory issue to production cost.
- Define report scopes and estimate/accounting-grade labels.

Product effect:

- Reports can answer supplier history, input usage, labour summary, money owed, and net profit with better confidence.

### Phase 4: Enterprise Expansion

Architecture work:

- Add livestock, poultry, aquaculture, beekeeping, and configurable enterprise extensions as modules over the shared platform model.
- Keep enterprise-specific tables separate from shared production, finance, inventory, and reporting primitives.

Product effect:

- Masona Farms becomes multi-enterprise without forcing animals, flocks, ponds, or colonies into crop fields.

### Phase 5: Integrations And Advanced Operations

Architecture work:

- Integrate with Outgrower OS only through stable APIs.
- Evaluate mobile money, accounting, weather, SMS, maps, IoT, scales, and buyer platforms.
- Add larger dashboards and asynchronous reports where needed.

## 11. Rollback Plan

### Local Migration Rollback

SQLite table-splitting migrations are difficult to reverse safely. Rollback should focus on preserving data and disabling new behavior:

- Create backup/export before major migrations.
- Keep old tables until new tables are verified.
- Use feature flags to hide new structured screens if issues occur.
- Keep compatibility reads from legacy tables.
- Never drop `records`, `fields`, or `crop_cycles` in early phases.
- If a structured migration fails, stop the migration, keep the old schema usable, and surface a plain error that records are still saved on the phone.

### Feature Rollback

- Structured forms can roll back to generic legacy record capture while keeping structured tables dormant.
- New reports can roll back to legacy estimate reports with clear labels.
- Sync rollout can roll back by disabling push/pull while leaving local queue entries intact.
- Backend-dependent features must fail closed for permissions and fail open for local data entry only where no private cross-user data can leak.

### Cloud Sync Rollback

- Keep local-first writes enabled.
- Stop sync worker with a remote/config flag.
- Preserve `sync_queue` entries for later retry.
- Do not delete local records after server acknowledgement until the app has verified local and server references.
- For conflicts involving money, inventory, health, or safety, never auto-resolve during rollback.

## 12. Implementation Patterns

### Naming

- TypeScript types and components: `PascalCase`.
- Functions and variables: `camelCase`.
- SQLite tables and columns: `snake_case`.
- Domain IDs in TypeScript: `camelCase` ending in `Id`.
- User-facing labels: plain English, for example `Total spent`, `Money still owed`, `Cost of fertilizer`.

### Data Rules

- Store dates as ISO-compatible strings. UI may display localized dates, but persistence should remain sortable.
- Store money as a consistent integer minor unit in new finance tables if possible; if `REAL` remains temporarily, isolate conversions in finance helpers.
- Store units explicitly. Do not infer kg, litres, ml, bags, plants, or hectares from text.
- Use stable IDs for relationships; duplicated display names are compatibility fields only.
- Soft archive important production and financial records by default.

### UI Rules

- Keep bottom sheets for add/edit flows.
- Required fields stay minimal.
- Saved previous values should be offered for suppliers, buyers, workers, products, units, methods, and cycles.
- Show incomplete structured records with plain attention chips like `No supplier`, `Missing buyer`, or `No payment status`.
- Show whether a money value counts as spent, earned, owed, or ignored.
- Use `Estimate` labels when reports include legacy or incomplete records.

### Error And Sync Rules

- User-facing errors must explain the fix.
- Do not expose schema, mutation, dirty, or foreign-key language to farmers.
- Sync conflicts must preserve local records and require review for finance, inventory, health, and safety records.
- Backend authorization must be enforced server-side, not only hidden in UI.

## 13. Requirements Coverage

| PRD area | Architecture support |
|---|---|
| Farms and fields | Existing fields preserved, then mapped to farms and production units. |
| Crop cycles | Existing crop cycles extended to production cycles with history and status. |
| Fertilizer and chemical records | Structured tables and forms added beside legacy records. |
| Watering records | Structured watering records with method, schedule, rainfall, skipped/issue notes. |
| Labour records | Worker/team and labour cost allocation introduced. |
| Expenses | Expense records scoped to farm, enterprise, unit, cycle, or general operation. |
| Revenue | Harvest, sale, buyer, payment status, payment allocation, and money owed modeled separately. |
| Reports | Report service owns scoped totals, estimate labels, and export consistency. |
| Inventory | New stock movement and valuation model in Phase 3. |
| Multiple enterprise types | Shared production model supports crop, livestock, poultry, aquaculture, and future modules. |
| Offline | Existing local entry preserved; future sync queue turns local-only into sync-capable offline. |
| Security and privacy | Backend identity, tenancy, roles, and audit required before shared-farm release. |
| Migration | Versioned local migrations and backup/export protect existing records. |

## 14. Open Architecture Decisions

These remain intentionally open because the current codebase does not yet force an answer:

1. Backend stack and hosting model.
2. Authentication provider or custom auth approach.
3. First platform module after crops: inventory, poultry, livestock, or aquaculture.
4. Minimum role set for first shared-farm release.
5. Whether initial cloud sync is full bidirectional sync or backup/restore plus manual merge.
6. Which reports must be accounting-grade at first platform launch.
7. Whether React Navigation should replace the custom tab state when nested Production and Manage flows grow.

## 15. Validation Results

### Coherence Validation

The plan is coherent with the current Expo React Native and SQLite app. It keeps the existing offline UX and local data model working while introducing migration, modularity, structured records, and tests before platform expansion. It does not require a backend before local stabilization, but it clearly marks backend identity and authorization as required before multi-user platform claims.

### Requirement Coverage Validation

The architecture supports the approved PRD through staged capability growth. Current crop workflows are preserved and extended. Platform concepts are introduced locally first, then connected to backend identity, tenancy, sync, and audit when the product is ready for shared-farm operation.

### Implementation Readiness Validation

Ready for implementation planning, with these caveats:

- Phase 1 can be implemented from this architecture without choosing a backend.
- Phase 2 requires a backend decision before authentication, tenant isolation, and sync implementation.
- Financial report changes require tests before behavior changes.
- Migrations require backup/export UX before any irreversible transformation.

### Architecture Completeness Checklist

- [x] Project context analyzed.
- [x] Existing source code baseline identified.
- [x] Package manifests and configuration reviewed.
- [x] Database migration gap identified.
- [x] Components unchanged, extended, refactored, new, and deprecated distinguished.
- [x] Database migration sequence defined.
- [x] Backward compatibility requirements defined.
- [x] Rollout and rollback considerations defined.
- [x] UX specification reflected in navigation, forms, states, and language.
- [x] PRD platform requirements mapped to architecture phases.

## 16. First Implementation Priorities

1. Add a versioned SQLite migration runner and mark the current schema as baseline.
2. Add tests for repository behavior and current report calculations.
3. Move report calculations and export generation out of `App.tsx`.
4. Split `App.tsx` into screens, forms, and reusable components without changing behavior.
5. Add structured crop record tables and forms incrementally, starting with fertilizer and chemical records because they unlock supplier, dosage, safety, withholding, observed-result, and input-cost questions.

No code has been implemented as part of this architecture document.
