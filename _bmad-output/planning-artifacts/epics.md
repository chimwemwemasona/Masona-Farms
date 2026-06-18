---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
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
---

# Masona Farms - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Masona Farms, decomposing the requirements from the PRD, UX Design, Architecture requirements, existing project documentation, and current codebase into implementable brownfield stories.

## Requirements Inventory

### Functional Requirements

FR-001: Users with permission shall create and manage organisations.
FR-002: An organisation shall contain one or more farms.
FR-003: Organisation settings shall include default currency, unit preferences, enabled modules, and user membership.
FR-004: An organisation shall manage multiple farms.
FR-005: Each farm shall have a name, location, optional GPS details, active status, and assigned users.
FR-006: Farm-level expenses and reports shall be supported.
FR-007: A farm shall support multiple enterprises.
FR-008: Each enterprise shall have an enterprise type, production purpose, active status, expected outputs, standard activities, and default units.
FR-009: Reports shall compare enterprise performance.
FR-010: Users shall create production units under farms and enterprises.
FR-011: Production units shall support type-specific size or capacity fields.
FR-012: Production units shall support parent-child relationships.
FR-013: Production units shall retain production history across cycles.
FR-014: Users shall create production cycles linked to enterprise and production unit.
FR-015: Each cycle shall track planned start, actual start, expected end, actual end, status, targets, planned inputs, and expected outputs.
FR-016: Users shall close, cancel, or archive cycles while preserving historical records.
FR-017: Reports shall calculate planned versus actual performance by cycle.
FR-018: Each production cycle shall identify its production subject.
FR-019: Production subjects shall support both individual and group-based management.
FR-020: Subject-specific modules shall extend the common production model without breaking shared reporting.
FR-021: Crop enterprises shall support crop and variety catalogues.
FR-022: Crop cycles shall support planting, transplanting, expected harvest, plant population, crop stage, crop inspections, input applications, irrigation, pest and disease observations, corrective actions, harvest forecasts, harvest records, and yield calculations.
FR-023: Fertilizer applications shall capture fertilizer name, application date, dosage value, dosage unit, dosage basis, quantity used, supplier, purchase price, application notes, and observed result.
FR-024: Chemical applications shall capture chemical name, date, dosage, target pest/disease/condition, quantity used, supplier, purchase price, safety notes, withholding notes, and observed result.
FR-025: Irrigation records shall capture date, method, schedule type, rainfall notes, skipped watering, and irrigation issues.
FR-026: Livestock enterprises shall support species, breed, production purpose, individual animal records, animal groups, herds, movements, weights, breeding, births, health incidents, treatments, vaccinations, mortality, sales, and disposal.
FR-027: Animal health records shall capture treatment cost, medicine usage, dosage, withdrawal period, authorised recorder, recovery status, and follow-up.
FR-028: Breeding records shall support natural mating, artificial insemination, pregnancy checks, expected birth dates, births, parent-child relationships, and weaning.
FR-029: Poultry enterprises shall support flock creation, poultry-house allocation, placement, daily opening quantity, feed consumption, water consumption, mortality, culls, vaccinations, average weight, uniformity, egg production, egg grading, hatchability, feed conversion ratio, and flock closure.
FR-030: Aquaculture enterprises shall support ponds, cages, fish batches, stocking, fingerling source, feed schedules, feed consumption, water-quality measurements, mortality, sampling, average weight, biomass estimation, feed conversion ratio, partial harvest, final harvest, and cycle closure.
FR-031: The platform shall support configurable enterprise types such as beekeeping, mushroom production, snail farming, insect farming, and future agricultural enterprises.
FR-032: Configurable enterprise types shall define production units, production subjects, common activities, inputs, outputs, and report metrics.
FR-033: The system shall manage input products, feed, medicines, vaccines, seed, fertilizer, chemicals, fuel, packaging, spare parts, and finished outputs.
FR-034: Inventory shall support stock receipts, issues, transfers, adjustments, damaged stock, expired stock, batch numbers, expiry dates, unit costs, stock valuation, reorder levels, and reconciliation.
FR-035: Supplier records shall be reusable across purchases, stock receipts, fertilizer records, chemical records, medicines, feed, equipment, and expenses.
FR-036: Issuing stock to a production cycle shall create both inventory movement and production cost records.
FR-037: Activities shall support planned dates, completion dates, assigned users or teams, labour used, equipment used, inputs consumed, costs, photos, notes, and status.
FR-038: Labour shall support worker profiles, permanent and casual workers, teams, attendance, task assignments, labour hours, daily rates, piece-work rates, and labour cost allocation.
FR-039: Equipment shall support registration, category, ownership status, operator assignment, usage records, fuel usage, maintenance schedules, repairs, downtime, operating cost, and assignment to activities.
FR-040: Outputs shall be defined by enterprise and production cycle.
FR-041: Output records shall capture quantity, unit, quality or grade, rejects, batch, storage destination, internal use, processing, and sale eligibility.
FR-042: Sales shall support customer registration, quotations, sales orders, delivery notes, invoices, payments received, outstanding balances, product batches, sales by enterprise, sales by production cycle, and customer history.
FR-043: Expenses shall support categories, supplier records, purchase records, receipt attachments, recurring expenses, approval workflows, and allocation to farm, enterprise, unit, cycle, or general operation.
FR-044: Profitability shall calculate cost per hectare, production unit, animal, bird, pond, kilogram, litre, farm, enterprise, production unit, and production cycle where the underlying data supports it.
FR-045: The system shall support organisation administrators, farm owners, farm managers, agronomists, livestock officers, veterinarians, poultry managers, aquaculture managers, storekeepers, finance officers, supervisors, workers, and auditors.
FR-046: Permissions shall be configurable by organisation, farm, enterprise, production unit, module, and action.
FR-047: Privileged finance, inventory, health, and user-management actions shall be audited.
FR-048: Users shall only access organisations and farms where they have membership.
FR-049: Selected mobile workflows shall support offline data entry.
FR-050: Offline-created records shall queue for sync when connectivity returns.
FR-051: Sync shall handle retries, duplicate prevention, server IDs, local IDs, and conflict detection.
FR-052: Conflict messages shall be clear and safe, especially for financial, inventory, and health records.
FR-053: Locally entered records shall not be lost during sync, migration, or app upgrades.
FR-054: Introduce a versioned migration framework before replacing or splitting the current SQLite schema.
FR-055: Map current `user_profiles` to a future local owner profile or organisation bootstrap flow.
FR-056: Map current `fields` to production units of type `Field`.
FR-057: Map current `crop_cycles` to production cycles linked to crop enterprises.
FR-058: Preserve current generic records as legacy records even when structured records are introduced.
FR-059: Migrate structured fields only where values can be safely inferred; otherwise leave fields blank or marked unknown.
FR-060: Preserve soft-archived records.
FR-061: Preserve report totals or explicitly explain any recalculation rule changes.
FR-062: Provide manual export or backup before major local-to-cloud migration.

### NonFunctional Requirements

NFR-001: New enterprise types shall be added through configuration and modular domain extensions.
NFR-002: Crop-specific recommendations shall remain separate from general recordkeeping.
NFR-003: Shared reporting shall use common enterprise, unit, cycle, input, output, cost, and revenue abstractions.
NFR-004: Farm financial data shall be private by default.
NFR-005: Cloud-backed versions shall provide authentication, authorization, tenant isolation, audit trails, secure password handling, rate limiting, session management, and export controls.
NFR-006: Sensitive farm data shall not be logged unnecessarily.
NFR-007: The platform shall support backup, restore, retry queues, duplicate prevention, disaster recovery, and idempotent financial transactions.
NFR-008: Schema migrations shall be versioned, repeatable, and tested.
NFR-009: Common screens shall load within three seconds under normal conditions.
NFR-010: Large reports shall be paginated, filtered, or processed asynchronously.
NFR-011: The platform shall handle large animal, flock, inventory, activity, and financial datasets.
NFR-012: User-facing text shall use plain English.
NFR-013: Mobile data entry shall prioritize short forms, saved previous values, date pickers, dropdowns, and large touch targets.
NFR-014: Required fields shall be limited to the minimum needed to preserve useful records.
NFR-015: The product shall support low-cost Android devices and poor connectivity.

### Additional Requirements

- Treat the current Expo React Native Android app and local SQLite store as the brownfield baseline; do not rewrite or discard existing offline crop-recordkeeping flows.
- Preserve existing tables `app_meta`, `user_profiles`, `fields`, `crop_cycles`, `records`, `photos`, and `reminders` through early migrations.
- Add a versioned SQLite migration runner with a `schema_migrations` table before any schema split or platform data backfill.
- Capture the existing schema as the baseline migration and safely mark already-created local databases without duplicating or losing records.
- Add sync-ready metadata such as `local_id`, `server_id`, `sync_status`, `created_at`, `updated_at`, `archived_at`, and `legacy_source` where relevant, without enabling sync prematurely.
- Add local platform foundation tables for organisations, farms, enterprises, production units, production cycles, and production subjects.
- Backfill `user_profiles.farm_name` into a local farm bootstrap, `fields` into production units of type `field`, `crop_cycles` into production cycles, and existing crop names into crop enterprises where needed.
- Add structured crop record tables for fertilizer applications, chemical applications, watering records, labour records, expense records, harvest records, sale records, and payment records while keeping generic `records` visible.
- Link structured records to the most precise available scope: production cycle first, then production unit, farm, or legacy record.
- Add reusable suppliers, buyers, workers, teams, products, and input products; do not parse old free text into official records unless values are safely inferred or farmer-reviewed.
- Add inventory and financial integrity tables only after report tests exist: stock receipts, issues, transfers, adjustments, batches, cost allocations, revenue allocations, and payment allocations.
- Add local sync preparation tables before cloud sync: sync queue, sync conflicts, audit events, and media attachments.
- Split `App.tsx` into app shell, screens, feature components, forms, reports, exports, hooks, and domain helpers without changing behavior first.
- Move report calculations and export builders out of UI into shared report/export services with tests.
- Keep crop library and crop-practice guidance separate from core production and finance schemas.
- Keep generic `records` as legacy work log/history, not as the final data model for structured input, labour, sales, payment, or inventory workflows.
- Replace broad UI-only finance rules with explicit financial classification and allocation rules.
- Replace hard-coded chemical withholding behavior with editable withholding dates and notes.
- Keep local notifications available for reminders, follow-ups, withholding checks, and payment collection prompts.
- Define backend stack, API contracts, authentication, memberships, tenant isolation, role matrix, audit logging, sync protocol, and media upload rules before implementing multi-user platform claims.
- Backend authorization must be enforced server-side once a backend exists; frontend-only hidden actions are not sufficient.
- Maintain compatibility reads so current screens can continue to show fields, crop cycles, legacy records, photos, reminders, and reports during transition.
- Before local-to-cloud migration, provide backup/export and explain any report recalculation rule changes.
- Use feature flags or dormant tables to roll back structured screens, new reports, sync worker, and backend-dependent features without data loss.

### UX Design Requirements

UX-DR1: Preserve the current mobile-first bottom-tab app shape while evolving tabs from Home, Fields, Records, Calendar, Reports, More toward Home, Production, Log, Calendar, Reports, Manage.
UX-DR2: Preserve the farm header with farm name, location, offline/local-save state, and future sync state; tapping farm name should later open a farm switcher when multi-farm support exists.
UX-DR3: Preserve the floating add action as the fastest route to record entry and make it open an Add Entry picker with recent/common actions first.
UX-DR4: Preserve bottom-sheet forms for add/edit flows and organize fields into Required, Money, Notes, Photos, and Follow-up groups.
UX-DR5: Replace the generic-only record form with type-specific sheets for Fertilizer, Chemical, Watering, Labour, Expense, Harvest, Sale, Payment, Photo, and General note.
UX-DR6: Keep required fields minimal and use saved previous values for suppliers, buyers, workers/teams, products, units, methods, and cycles.
UX-DR7: Fertilizer entry must capture crop cycle, fertilizer name, date applied, quantity or dosage, optional dosage basis, supplier/shop, purchase price, notes, observed result, receipt photo, and a result follow-up reminder.
UX-DR8: Chemical entry must capture crop cycle, chemical name, date applied, dosage, target problem, safety notes, editable withholding notes/date, observed result, receipt/photo, and follow-up/safety reminders.
UX-DR9: Watering entry must capture crop cycle, watering date, method, daily/scheduled option, rainfall notes, skipped watering, irrigation issues, and calendar backfill prefills.
UX-DR10: Labour entry must capture date, task, worker/team or "Not recorded", amount paid, optional hours/days or piece-work quantity, scope, and notes.
UX-DR11: Expense entry must capture date, category, amount, scope, optional supplier, receipt photo, recurrence, and plain copy explaining whether it affects cycle profit or farm-level cost.
UX-DR12: Harvest entry must capture date, production cycle, quantity harvested, unit, optional quality/grade, rejects, storage destination, internal use, notes, and photo; harvest must not count as revenue until sold.
UX-DR13: Sale and payment entry must capture buyer, quantity sold, unit, selling price or total revenue, payment status, amount received, payment method/status, and outstanding amount visibility.
UX-DR14: Production must redesign current Fields into farms, enterprises, production units, active cycles, and cycle history while preserving current field rows and progress.
UX-DR15: Unit Detail must extend Field Detail with current cycle, past cycles, linked inventory issues, labour and supplier summaries, and close/cancel/archive cycle actions.
UX-DR16: Work Log must redesign Records into searchable, filterable legacy and structured records grouped by date, type, farm, enterprise, unit, cycle, money effect, and incomplete status.
UX-DR17: Calendar must preserve month grid, date jump, selected-day list, upcoming work, and backfill chips while adding schedule/cycle filters, watering schedule, withholding dates, overdue states, and skipped work states.
UX-DR18: Reports must progressively add scoped cards for Total spent, Total earned, Net profit, Cost of fertilizer, Cost of chemicals, Labour cost, Harvest quantity, Sales income, and Money still owed.
UX-DR19: Reports must support scopes by farm, enterprise, production unit, production cycle, supplier, worker/team, buyer/customer, and date range as the underlying data becomes available.
UX-DR20: Reports using generic or incomplete data must show "Estimate" and explain missing structure in plain English.
UX-DR21: Manage must turn placeholder rows into Inventory, Suppliers, Buyers, Workers and teams, Photo records, Offline sync and backup, Settings, and future Roles and access.
UX-DR22: Empty states must be helpful and action-oriented for first run, no fields/units, no active cycle, no records, no photos, and no calendar events.
UX-DR23: Incomplete structured records must show attention chips such as "No supplier", "Missing buyer", or "No payment status".
UX-DR24: Archive/delete UX must soft archive production and finance records by default with copy explaining that history is kept but hidden from normal lists and reports.
UX-DR25: Offline and sync copy must use farmer-friendly text: "Saved on this phone", "Waiting to sync", "Synced", "Needs review", and "Could not sync. Your record is still on this phone."
UX-DR26: Sync conflict review must show plain choices and must not auto-overwrite financial, inventory, health, or safety records.
UX-DR27: Accessibility must provide at least 48dp Android and 44pt iOS touch targets, labels for icon-only actions, selected tab state, persistent form labels, field-specific error messages, screen-reader-readable amounts/dates/status, and non-color status signals.
UX-DR28: The calendar must not rely on dots alone; the selected-day list must remain the accessible source of event details.
UX-DR29: Dynamic text must not truncate critical labels such as record type, amount, payment status, or safety warning.
UX-DR30: Visual implementation must preserve the green, white, and soft-canvas foundation, keep amber/red meaningful, avoid ornamental imagery, and gradually align cards, chips, inputs, and repeated surfaces toward 8px radii where practical.
UX-DR31: The theme token file must remain the visual source of truth and be consolidated with design-spine colors, radii, spacing, status, input, sheet, and button tokens.
UX-DR32: User-facing labels must use plain terms such as "Total spent", "Money still owed", "Cost of fertilizer", "No supplier saved yet", and "Saved on this phone."

### FR Coverage Map

FR-001: Epic 3 - Farm, enterprise, unit, and cycle management.
FR-002: Epic 3 - Farm, enterprise, unit, and cycle management.
FR-003: Epic 3 - Farm, enterprise, unit, and cycle management.
FR-004: Epic 3 - Farm, enterprise, unit, and cycle management.
FR-005: Epic 3 - Farm, enterprise, unit, and cycle management.
FR-006: Epic 3 - Farm-level expenses and reports.
FR-007: Epic 3 - Enterprise management.
FR-008: Epic 3 - Enterprise settings and defaults.
FR-009: Epic 3 - Enterprise performance comparison.
FR-010: Epic 3 - Production unit creation.
FR-011: Epic 3 - Production unit type-specific facts.
FR-012: Epic 3 - Production unit parent-child relationships.
FR-013: Epic 3 - Production unit cycle history.
FR-014: Epic 3 - Production cycle creation.
FR-015: Epic 3 - Production cycle planning, status, targets, and outputs.
FR-016: Epic 3 - Cycle close, cancel, and archive.
FR-017: Epic 3 - Planned versus actual cycle reporting.
FR-018: Epic 3 - Production subject linkage.
FR-019: Epic 3 - Individual and group production subjects.
FR-020: Epic 3 - Shared production model extensions.
FR-021: Epic 3 - Crop catalogues and variety support.
FR-022: Epic 2 - Structured crop-cycle production records.
FR-023: Epic 2 - Fertilizer application records.
FR-024: Epic 2 - Chemical application records.
FR-025: Epic 2 - Watering and irrigation records.
FR-026: Epic 6 - Livestock enterprise module.
FR-027: Epic 6 - Livestock health records.
FR-028: Epic 6 - Livestock breeding records.
FR-029: Epic 6 - Poultry enterprise module.
FR-030: Epic 6 - Aquaculture enterprise module.
FR-031: Epic 6 - Configurable enterprise types.
FR-032: Epic 6 - Configurable enterprise definitions and metrics.
FR-033: Epic 4 - Inventory products and finished outputs.
FR-034: Epic 4 - Stock movement and valuation.
FR-035: Epic 4 - Reusable supplier records.
FR-036: Epic 4 - Inventory issue to production cost.
FR-037: Epic 2 - Activity records and work status.
FR-038: Epic 4 - Workers, teams, attendance, rates, and labour allocation.
FR-039: Epic 4 - Equipment records, usage, fuel, maintenance, and costs.
FR-040: Epic 2 - Output definition by enterprise and cycle.
FR-041: Epic 2 - Harvest and output records.
FR-042: Epic 2 and Epic 4 - Sales, customers, payments, balances, and history.
FR-043: Epic 2 and Epic 4 - Expense records, supplier linkage, receipt attachments, and allocation.
FR-044: Epic 2, Epic 3, and Epic 4 - Profitability by supported scope where data allows.
FR-045: Epic 5 - Role model.
FR-046: Epic 5 - Configurable permissions.
FR-047: Epic 5 - Audited privileged actions.
FR-048: Epic 5 - Membership-based access.
FR-049: Epic 1 and Epic 5 - Offline data entry now and sync-capable offline later.
FR-050: Epic 5 - Offline sync queue.
FR-051: Epic 5 - Sync retries, IDs, duplicate prevention, and conflicts.
FR-052: Epic 5 - Farmer-safe conflict messages.
FR-053: Epic 1 and Epic 5 - No loss of local records during migration or sync.
FR-054: Epic 1 - Versioned migration framework.
FR-055: Epic 3 - Profile to owner/organisation bootstrap mapping.
FR-056: Epic 3 - Field to production unit mapping.
FR-057: Epic 3 - Crop cycle to production cycle mapping.
FR-058: Epic 1 - Legacy generic record preservation.
FR-059: Epic 1 - Safe structured migration rules.
FR-060: Epic 1 - Soft archive preservation.
FR-061: Epic 1 - Report total preservation or recalculation explanation.
FR-062: Epic 1 and Epic 5 - Backup/export before major migration.

### Implementation Coverage Notes

The FR Coverage Map shows where each PRD requirement is represented in the epic plan. It does not mean the requirement is already implemented or ready for immediate development.

Use these readiness meanings during sprint planning:

- **Implemented:** Already exists in the current app.
- **Local implementation story:** Can be built in the current local SQLite app without backend decisions.
- **Technical enabler:** Required engineering work that protects or prepares product behavior, but does not itself ship a farmer-facing capability.
- **Decision prerequisite:** Product or architecture decision required before implementation stories can be finalized.
- **Specification prerequisite:** Contract, policy, or design artifact required before implementation.
- **Backend-required:** Cannot be claimed complete until backend identity, authorization, tenancy, sync, or audit support exists.
- **Candidate backlog:** Valid future scope, but not committed to implementation sequence until a prioritization decision is approved.

Sprint planning must use both the FR Coverage Map and these readiness meanings.

## Epic List

### Epic 1: Protect Existing Farm Records And Prepare The App To Evolve

Farmers can keep using the current offline crop app while migrations, tests, modular app structure, report services, and compatibility reads make future changes safe.

**FRs covered:** FR-049, FR-053, FR-054, FR-058, FR-059, FR-060, FR-061, FR-062

**Boundary note:** Stories in this epic must make farmer-visible safety explicit: existing records still open, old reports still explain themselves, backups exist before risky changes, and tests protect current local flows. Each Epic 1 implementation story must verify the affected current farmer flows before it is considered complete.

### Epic 2: Structured Crop Records And Clear Cycle Profit

Farmers can record fertilizer, chemicals, watering, labour, expenses, harvests, sales, and payments with structured fields tied to crop cycles, while reports explain total spent, total earned, net profit, missing data, and estimates.

**FRs covered:** FR-022, FR-023, FR-024, FR-025, FR-037, FR-040, FR-041, FR-042, FR-043, FR-044

**Boundary note:** Crop-cycle structured finance remains an operational estimate until Epic 4 inventory, buyer, supplier, payment, and allocation records are complete.

### Epic 3: Farm, Enterprise, Unit, And Cycle Management

Farmers can manage farm business structure beyond today's field-only model: farms, enterprises, production units, production cycles, production subjects, cycle history, and planned versus actual performance.

**FRs covered:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-055, FR-056, FR-057

**Boundary note:** This epic introduces the local platform model and compatibility reads. Multi-user organisation membership and access control are deferred to Epic 5.

### Epic 4: Suppliers, Inventory, Workers, Buyers, And Financial Integrity

Farmers can reuse suppliers, buyers, workers, products, and inventory movements so stock, input use, labour cost, sales, payments, and profit reports become more reliable.

**FRs covered:** FR-033, FR-034, FR-035, FR-036, FR-038, FR-039, FR-042, FR-043, FR-044

### Epic 5: Shared Farm Access, Privacy, Audit, And Sync

Farm teams can safely work across users and devices with authentication, memberships, permissions, audit trails, sync queues, conflict review, and no loss of locally entered records.

**FRs covered:** FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053, FR-062

**Boundary note:** This epic must start with backend, authentication, authorization, sync, and API contract decisions before implementing shared-farm access.

### Epic 6: Multi-Enterprise Farm Modules

Farmers can extend Masona Farms beyond crops into livestock, poultry, aquaculture, beekeeping, and future enterprise types using the shared production, finance, inventory, and reporting model.

**FRs covered:** FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032

**Boundary note:** Enterprise modules must be delivered incrementally and must reuse Epic 3, Epic 4, and Epic 5 primitives instead of adding isolated generic record piles. Candidate module stories are not committed to implementation sequence until Decision 6.A is approved.

### Assumptions For Story Creation

- Early implementation stories preserve Expo React Native and local SQLite unless explicitly marked as backend decision or platform implementation work.
- Existing local data preservation means old records remain visible and exportable; structured migration only happens where values are safe to infer or farmer-reviewed.
- Profit reporting before Epic 4 is operational and must be labeled as an estimate when data is generic or incomplete.
- Backend, authentication, authorization, sync, and API choices must be decided before shared-farm access stories implement code.
- New enterprise modules must reuse the shared production, finance, inventory, and sync primitives instead of creating isolated generic record systems.

### Story Slicing Guidance

- Epic 1 stories must keep behavior equivalent until tests and migrations are in place.
- Epic 1 refactor stories should move one boundary at a time: reports/export logic, repository/migrations, screens/forms/components.
- Epic 2 stories should deliver one structured record family at a time, starting with fertilizer and chemical because they unlock the biggest PRD gaps.
- Epic 3 stories should introduce platform language gradually through the UI: Field becomes Production Unit under the hood before the farmer must learn every platform concept.
- Epic 4 stories should not claim accounting-grade profit until inventory movements, payment allocations, and report rules are tested.
- Epic 5 stories should separate decision records, backend contracts, mobile sync preparation, and shared-farm UI.
- Epic 6 stories should start with the first prioritized non-crop enterprise instead of building livestock, poultry, aquaculture, and beekeeping all at once.

### Second-Order Risks To Carry Into Stories

- Internal stabilization stories must include farmer-visible regression checks.
- Legacy generic records must remain understandable and must not be presented as failed or bad records.
- Platform concepts should use plain UI wording while preserving precise technical model names in code and documentation.
- Report rule changes must include legacy estimate handling and plain recalculation notes.
- Sync stories must preserve local-first trust before cross-device convenience.
- Enterprise expansion stories must protect shared reporting and finance consistency.

### Story Creation Warnings

- Epic 3 stories must be small enough that each one leaves the current app usable and understandable.
- Epic 2 and Epic 4 stories must state whether money values are estimate-grade or finance-integrity-grade.
- Epic 5 decision stories must produce concrete artifacts, not vague research outcomes.
- Epic 6 story creation must either identify the first non-crop enterprise priority or mark that priority as a dependency before implementation.
- No story may require future epics to function, though it may prepare data or compatibility paths for them.

## Epic 1: Protect Existing Farm Records And Prepare The App To Evolve

Farmers can keep using the current offline crop app while migrations, tests, modular app structure, report services, and compatibility reads make future changes safe.

### Story 1.1: Add Versioned Local Migrations Without Changing Farmer Workflows

As a farmer,
I want app updates to keep my existing records safe,
So that I can continue using Masona Farms without losing field, crop-cycle, photo, reminder, or money records.

**Business objective:** Protect existing local farm records before schema changes.

**Story classification:** technical enabler, local-only

**Requirements covered:** FR-053, FR-054, FR-060; NFR-008.

**Affected existing components:** `src/data/farmRepository.ts`, current SQLite tables, `initializeDatabase()`, `ensureColumn()` behavior.

**New components:** Migration runner, migration registry, migration metadata helpers.

**Database changes:** Add `schema_migrations` table and baseline migration metadata.

**API changes:** None. Local repository API remains compatible.

**Migration requirements:** Safely detect existing databases and mark the current schema as baseline without duplicating records.

**Compatibility concerns:** Existing records, fields, crop cycles, photos, reminders, profile, and soft-archived records must remain readable.

**Acceptance Criteria:**

**Given** an existing local database created by the current app
**When** the app initializes after the migration runner is added
**Then** all existing fields, crop cycles, records, photos, reminders, and profile data still load
**And** the baseline migration is recorded exactly once.

**Given** a fresh install
**When** the app initializes
**Then** the same current tables are created through the migration path
**And** the app still reaches the first-run profile flow.

**Test requirements:** Repository tests for fresh install, existing schema baseline, repeated initialization, and soft-archived record preservation.

**Manual verification:** Open an existing local database, confirm existing profile, fields, crop cycles, records, photos, reminders, reports, and archived records remain visible or correctly hidden, then create a new record to confirm local entry still works.

**Dependencies:** None.

**Explicit exclusions:** No structured crop tables, no sync, no backend, no UI redesign.

**Rollback considerations:** Keep current table creation logic available until migration tests pass; if migration fails, stop before destructive changes and surface a plain local-data-safe error.

### Story 1.2: Add Repository And Report Regression Tests For Current Behavior

As a farmer,
I want updates to preserve the reports and records I already rely on,
So that improvements do not quietly break my farm history.

**Business objective:** Lock current behavior before refactors and finance-rule changes.

**Story classification:** technical enabler, local-only

**Requirements covered:** FR-053, FR-061; NFR-008.

**Affected existing components:** `src/data/farmRepository.ts`, report calculations in `App.tsx`, archive behavior, PDF/CSV/share report builders.

**New components:** Test harness, repository fixtures, report calculation fixtures.

**Database changes:** None beyond test database setup.

**API changes:** None.

**Migration requirements:** Tests must run against migrated baseline schema.

**Compatibility concerns:** Current report behavior must be documented even where it is imperfect: `Sale` counts as revenue, `Harvest` is ignored, and other money values count as expenses.

**Acceptance Criteria:**

**Given** seeded field, crop-cycle, sale, fertilizer, labour, harvest, payment, and archived records
**When** report totals are calculated
**Then** totals match the current app behavior
**And** archived records are excluded.

**Given** repository CRUD tests
**When** fields, crop cycles, records, photos, reminders, and profile data are saved and reloaded
**Then** the returned TypeScript shapes match current app expectations.

**Test requirements:** Add automated tests for repository CRUD, archive exclusion, current totals, and export-source data.

**Manual verification:** Run current report flows with seeded or real local data and confirm Total spent, Total earned, Net profit, exports, archived-record exclusion, and existing record lists match the pre-change app behavior.

**Dependencies:** Story 1.1.

**Explicit exclusions:** Do not change finance rules yet.

**Rollback considerations:** Tests can be removed without app runtime impact, but failing tests should block future refactors.

### Story 1.3: Extract Report Calculations And Exports From `App.tsx`

As a farmer,
I want reports and exports to keep working after the app is reorganized,
So that I can still explain farm costs and income while the app evolves.

**Business objective:** Reduce single-file risk while preserving report behavior.

**Story classification:** technical enabler, local-only

**Requirements covered:** FR-061; NFR-012.

**Affected existing components:** `App.tsx`, `ReportsScreen`, `buildDashboardMetrics`, `buildAgronomistSummary`, `buildShareReport`, `buildReportHtml`, `buildReportCsv`.

**New components:** Report service/domain helper, export service/helper, tests for extracted functions.

**Database changes:** None.

**API changes:** None.

**Migration requirements:** None.

**Compatibility concerns:** UI labels and exported values must remain unchanged except internal source location.

**Acceptance Criteria:**

**Given** existing records and fields
**When** the Reports screen renders
**Then** Total spent, Total earned, Net profit, cost per field/hectare, and export actions match pre-extraction behavior
**And** the code path is covered by tests.

**Given** a farmer exports PDF, CSV, or share text
**When** the export is generated
**Then** the output contains the same practical labels and values as before.

**Test requirements:** Unit tests for extracted calculations and export payload generation; typecheck.

**Manual verification:** Open Reports, generate PDF/CSV/share output, and compare labels and totals against the pre-extraction behavior using the same local records.

**Dependencies:** Story 1.2.

**Explicit exclusions:** No new report scopes, no estimate labels yet unless existing behavior already shows them.

**Rollback considerations:** Keep extraction mechanical and reversible; old inline helpers can be restored if behavior diverges.

### Story 1.4: Split Current Screens And Forms Without Behavior Change

As a farmer,
I want the app to feel familiar after internal cleanup,
So that I can keep adding fields, records, photos, reminders, and reports without relearning the app.

**Business objective:** Make feature work safer by reducing `App.tsx` size without changing user flows.

**Story classification:** technical enabler, local-only

**Requirements covered:** FR-049, FR-053; NFR-013, NFR-015.

**Affected existing components:** `App.tsx`, `HomeScreen`, `FieldsScreen`, `RecordsScreen`, `CalendarScreen`, `ReportsScreen`, `MoreScreen`, `FieldFormModal`, `RecordFormModal`, `PhotoFormModal`, `ProfileSetupModal`, row/card components.

**New components:** `src/screens/*`, `src/forms/*`, `src/components/*`, shared hooks/helpers as needed.

**Database changes:** None.

**API changes:** None.

**Migration requirements:** None.

**Compatibility concerns:** Current navigation tabs, bottom sheets, validation messages, quick actions, and local-save behavior must remain intact.

**Acceptance Criteria:**

**Given** the refactor is complete
**When** a farmer uses profile setup, creates a field, adds a record, adds a photo, views calendar, archives a record, and exports a report
**Then** each flow behaves the same as before
**And** user-facing text remains plain English.

**Given** the codebase after refactor
**When** typecheck and regression tests run
**Then** they pass without changing persistent data.

**Test requirements:** Typecheck, existing regression tests, manual smoke test for major flows.

**Manual verification:** Complete the current smoke path: profile setup or profile load, create a field, start or view a crop cycle, add a record, add a photo, view calendar, archive a record, reopen reports, and export a report.

**Dependencies:** Story 1.3.

**Explicit exclusions:** No new screens, no tab rename, no structured forms, no visual redesign beyond preserving existing layout.

**Rollback considerations:** Refactor in small file moves; each moved component should be revertible independently.

### Story 1.5: Add Backup And Legacy Record Safety Messaging Before Major Data Changes

As a farmer,
I want clear backup and legacy-history messages before big app changes,
So that I know my old records are still useful and safe.

**Business objective:** Build farmer trust before structured migration and future sync work.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-058, FR-059, FR-062; UX-DR20, UX-DR24, UX-DR25.

**Affected existing components:** Reports export/share flows, More screen, record archive copy, future migration prompts.

**New components:** Backup/export entry point, legacy record messaging helper, plain-English migration notice pattern.

**Database changes:** None.

**API changes:** None.

**Migration requirements:** Before later data-transform migrations, the app must offer export/backup and explain that old records remain history.

**Compatibility concerns:** Existing PDF/CSV/share exports must keep working; legacy generic records must not be shown as bad or failed records.

**Acceptance Criteria:**

**Given** a farmer opens Manage/More before a major data migration
**When** backup/export is available
**Then** the app offers a plain-English backup action using current export capability
**And** explains that old records will be kept as history.

**Given** a generic legacy record remains after structured records are introduced later
**When** it appears in the log or report context
**Then** it can be labeled as legacy history without blocking use
**And** reports using it can be marked as estimates in later stories.

**Test requirements:** Manual verification of backup/export entry point, copy review, export generation, archive behavior.

**Manual verification:** From Manage/More and report/export surfaces, confirm backup/export copy is plain English, export still works, archive copy explains history is kept, and legacy records remain understandable rather than marked as failed records.

**Dependencies:** Story 1.3.

**Explicit exclusions:** No cloud backup, no sync, no server storage, no structured migration execution.

**Rollback considerations:** Backup messaging can be hidden by feature flag while preserving export functions.

## Epic 2: Structured Crop Records And Clear Cycle Profit

Farmers can record fertilizer, chemicals, watering, labour, expenses, harvests, sales, and payments with structured fields tied to crop cycles, while reports explain total spent, total earned, net profit, missing data, and estimates.

### Story 2.1: Add Structured Fertilizer And Chemical Records Beside Legacy Records

As a farmer,
I want fertilizer and chemical applications to capture supplier, dosage, safety, and observed results,
So that I can understand what was applied, what it cost, and what happened afterward.

**Business objective:** Turn the highest-value input records into structured, reportable crop-cycle data.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-022, FR-023, FR-024, FR-058; UX-DR7, UX-DR8.

**Affected existing components:** `RecordFormModal`, `RecordsScreen`, `CalendarScreen`, `ReportsScreen`, `src/data/farmRepository.ts`, `FarmRecord` types.

**New components:** `FertilizerForm`, `ChemicalForm`, structured application repository methods, validation helpers.

**Database changes:** Add `fertilizer_applications` and `chemical_applications` tables with links to `crop_cycle_id`, field/production-unit compatibility fields, optional `legacy_record_id`, supplier text, dosage value/unit/basis, quantity used, purchase price, safety/withholding notes, observed result, and dates.

**API changes:** Local repository API adds create/read methods for structured fertilizer and chemical records; no backend API.

**Migration requirements:** Existing generic Fertilizer and Chemical records remain in `records`; only safe links to `legacy_record_id` are created if needed.

**Compatibility concerns:** Existing generic records remain visible in Work Log/Records and reports as legacy estimate inputs.

**Acceptance Criteria:**

**Given** a farmer adds a fertilizer record from the quick add action
**When** required fields are saved
**Then** the structured fertilizer record is linked to the selected crop cycle
**And** any entered purchase price contributes to Cost of fertilizer as an estimate-grade value.

**Given** a farmer adds a chemical record
**When** safety or withholding notes are entered
**Then** the record stores editable withholding details
**And** calendar follow-up/safety reminders use the saved date instead of a hard-coded rule.

**Test requirements:** Repository tests for create/read structured fertilizer and chemical records; validation tests; manual form flow tests.

**Dependencies:** Stories 1.1 and 1.2.

**Explicit exclusions:** No inventory stock deduction, no official supplier table, no product catalogue, no backend sync.

**Rollback considerations:** Structured forms can be hidden and generic record capture remains available.

### Story 2.2: Add Structured Watering, Labour, And Expense Records

As a farmer,
I want watering, labour, and expense records to capture the details that affect crop-cycle costs,
So that I can later see what work was done and what it cost.

**Business objective:** Improve daily work and cost traceability without overloading field entry.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-025, FR-037, FR-043; UX-DR9, UX-DR10, UX-DR11.

**Affected existing components:** Generic record form, `RecordsScreen`, `CalendarScreen`, report calculations, repository.

**New components:** `WateringForm`, `LabourForm`, `ExpenseForm`, structured repositories and validators.

**Database changes:** Add `watering_records`, `labour_records`, and `expense_records` tables with crop-cycle/scope links, worker/team text, task, amount paid, expense category, amount, method, schedule type, rainfall/skipped/issue notes, and optional legacy link.

**API changes:** Local repository create/read methods for structured watering, labour, and expenses.

**Migration requirements:** Existing generic Irrigation, Labor, and Expense records remain legacy records.

**Compatibility concerns:** Amounts count as estimate-grade costs until Epic 4 finance allocation exists.

**Acceptance Criteria:**

**Given** a farmer backfills watering from the calendar
**When** Watering opens
**Then** the selected date and crop cycle are prefilled where known.

**Given** a farmer records labour or an expense
**When** an amount and scope are saved
**Then** the value contributes to the relevant cycle/farm estimate
**And** the record clearly states whether it affects cycle profit or farm-level cost.

**Test requirements:** Repository tests, report estimate tests, manual calendar backfill test.

**Dependencies:** Story 2.1 patterns.

**Explicit exclusions:** No worker table, no attendance module, no recurring expense engine, no approvals.

**Rollback considerations:** Hide structured forms and keep generic records visible.

### Story 2.3: Add Structured Harvest, Sale, And Payment Records With Outstanding Money

As a farmer,
I want harvests, sales, and payments recorded separately,
So that I can see harvest quantity, sales income, and money still owed.

**Business objective:** Separate production output from earned/received money.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-040, FR-041, FR-042, FR-044; UX-DR12, UX-DR13.

**Affected existing components:** `RecordFormModal`, `ReportsScreen`, record rows, export builders, repository.

**New components:** `HarvestForm`, `SaleForm`, `PaymentForm`, buyer text capture, payment status helpers.

**Database changes:** Add `harvest_records`, `sale_records`, and `payment_records` tables with crop-cycle link, quantity harvested/sold, unit, buyer text, selling price, total revenue, payment status, amount received, payment method/status, outstanding amount, and optional legacy link.

**API changes:** Local repository create/read methods for harvest, sales, and payments.

**Migration requirements:** Existing generic Harvest, Sale, and Payment records remain legacy; no free-text parsing into buyer/payment fields.

**Compatibility concerns:** Harvest must not count as revenue until sold; generic sale/payment records remain estimate-grade unless structured values exist.

**Acceptance Criteria:**

**Given** a farmer records a harvest
**When** quantity and unit are saved
**Then** Harvest quantity updates
**And** Total earned does not change unless a sale is also recorded.

**Given** a farmer records a part-paid sale
**When** amount received is less than total revenue
**Then** Reports show Sales income and Money still owed
**And** the sale row shows Part paid.

**Test requirements:** Repository tests, report tests for paid/part-paid/unpaid states, manual sale/payment flow.

**Dependencies:** Story 2.2.

**Explicit exclusions:** No customer table, no invoices, no sales orders, no accounting-grade receivables.

**Rollback considerations:** Structured harvest/sale/payment forms can be hidden; legacy records stay visible.

### Story 2.4: Redesign Add Entry And Work Log Around Structured And Legacy Records

As a farmer,
I want to choose the right entry type quickly and find old and new records together,
So that structured data does not slow down field work.

**Business objective:** Keep fast mobile entry while introducing structured records.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-022, FR-037, FR-058; UX-DR3, UX-DR4, UX-DR5, UX-DR16, UX-DR23.

**Affected existing components:** Floating add action, `RecordFormModal`, `RecordsScreen`, `RecordRow`, filters, empty states.

**New components:** Add Entry picker, Work Log adapters, incomplete-data chips, shared structured record row details.

**Database changes:** None beyond reading structured tables from prior stories.

**API changes:** Local read model merges legacy and structured records into a Work Log view.

**Migration requirements:** Legacy records remain visible and can be labeled as legacy history when helpful.

**Compatibility concerns:** Current Records screen behavior should evolve without hiding existing records.

**Acceptance Criteria:**

**Given** a farmer taps the floating add action
**When** Add Entry opens
**Then** common actions show first: Record work, Fertilizer, Chemical, Watering, Labour, Expense, Harvest, Sale, Photo.

**Given** the farmer opens Work Log
**When** both legacy and structured records exist
**Then** the list shows both in date order
**And** incomplete structured records show plain chips such as No supplier, Missing buyer, or No payment status.

**Test requirements:** Component tests if available; manual quick-add and filter tests; typecheck.

**Dependencies:** Stories 2.1, 2.2, 2.3.

**Explicit exclusions:** No full Production tab rename yet, no inventory, no sync conflict UI.

**Rollback considerations:** Add Entry can fall back to current generic record modal.

### Story 2.5: Add Estimate-Grade Crop-Cycle Reports For Structured Records

As a farmer,
I want crop-cycle reports to explain spending, earnings, harvests, and missing details,
So that I can make decisions without assuming the numbers are perfect.

**Business objective:** Provide practical cycle profit while being honest about incomplete data.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-044, FR-061; UX-DR18, UX-DR19, UX-DR20.

**Affected existing components:** `ReportsScreen`, field detail modal, report/export services from Epic 1, dashboard metrics.

**New components:** Report scope selector for crop cycle, estimate labels, missing-data summary, structured report calculators.

**Database changes:** None beyond structured table reads.

**API changes:** Local report service reads structured and legacy records.

**Migration requirements:** Legacy generic records contribute only under clearly labeled estimate rules.

**Compatibility concerns:** Existing global totals remain available; changed report rules need plain notes.

**Acceptance Criteria:**

**Given** structured crop records exist for a crop cycle
**When** the farmer views Reports scoped to that cycle
**Then** the app shows Total spent, Total earned, Net profit, Cost of fertilizer, Cost of chemicals, Labour cost, Harvest quantity, Sales income, and Money still owed where supported
**And** values are labeled Estimate when legacy or incomplete data is included.

**Given** report rules differ from old totals
**When** the report is shown or exported
**Then** the farmer sees a plain note explaining what changed.

**Test requirements:** Report tests for structured-only, legacy-only, and mixed data; export tests; manual report scope verification.

**Dependencies:** Stories 2.1-2.4.

**Explicit exclusions:** No accounting-grade stock valuation, no cost per plant unless plant population exists, no async report processing.

**Rollback considerations:** Feature flag new scoped reports and keep existing reports as legacy estimates.

## Epic 3: Farm, Enterprise, Unit, And Cycle Management

Farmers can manage farm business structure beyond today's field-only model: farms, enterprises, production units, production cycles, production subjects, cycle history, and planned versus actual performance.

### Story 3.1: Introduce Local Farm And Enterprise Foundation From Existing Profile

As a farmer,
I want my existing farm profile to become the start of my farm business setup,
So that I can later manage more farms and enterprises without losing my current data.

**Business objective:** Create the local platform foundation without forcing a multi-user or backend jump.

**Story classification:** technical enabler, local-only

**Requirements covered:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-007, FR-008, FR-055.

**Affected existing components:** `user_profiles`, profile setup/edit flow, `MoreScreen`, repository initialization.

**New components:** Local farm and enterprise repository/types, bootstrap mapper from profile.

**Database changes:** Add local `farms` and `enterprises` tables with local IDs, name, location/defaults, active status, type, production purpose, expected outputs, default units, and timestamps.

**API changes:** Local repository methods for reading bootstrap farm and enterprises.

**Migration requirements:** Map `user_profiles.farm_name` and `location` into one local farm; seed crop enterprises from existing fields/cycles where safe.

**Compatibility concerns:** Existing profile remains readable; UI can still show current farm name.

**Acceptance Criteria:**

**Given** an existing local profile
**When** migrations run
**Then** one local farm is created from profile data
**And** existing profile setup/edit behavior still works.

**Given** existing crop fields
**When** enterprises are seeded
**Then** crop enterprises are created only where safe
**And** no duplicate enterprises are created on repeated initialization.

**Test requirements:** Migration tests for profile-to-farm bootstrap and idempotent enterprise seeding.

**Dependencies:** Story 1.1.

**Explicit exclusions:** No organisation membership, no login, no roles, no backend.

**Rollback considerations:** Keep profile as compatibility source; farm/enterprise tables can remain dormant if UI feature is disabled.

### Story 3.2: Map Existing Fields Into Production Units With Compatibility Reads

As a farmer,
I want my current fields and plots to keep appearing normally,
So that the app can support more production places later without confusing today's crop work.

**Business objective:** Move from field-only storage toward reusable production units.

**Story classification:** technical enabler, local-only

**Requirements covered:** FR-010, FR-011, FR-012, FR-013, FR-056; UX-DR14.

**Affected existing components:** `fields`, `getFields()`, `FieldsScreen`, `FieldRow`, field detail modal.

**New components:** Production unit types, repository methods, compatibility mapper returning current `CropField` shape.

**Database changes:** Add `production_units` with farm/enterprise links, type, name, size/capacity fields, parent ID, active status, compatibility field ID, and timestamps.

**API changes:** Local repository can read/write production units while `getFields()` remains compatible.

**Migration requirements:** Map current `fields` to production units of type `field`; preserve field IDs as local compatibility links.

**Compatibility concerns:** Current field list, detail modal, photos, reminders, and records still resolve by existing field references.

**Acceptance Criteria:**

**Given** existing fields
**When** production unit migration runs
**Then** each field appears as a production unit of type Field
**And** the Fields/Production list still shows the same field names, crops, areas, stages, and statuses.

**Given** a field is edited
**When** compatibility reads are used
**Then** existing records/photos/reminders still display under the correct field context.

**Test requirements:** Migration tests, compatibility read tests, manual field add/edit/detail flow.

**Dependencies:** Story 3.1.

**Explicit exclusions:** No houses, ponds, pens, apiaries, or custom unit forms yet.

**Rollback considerations:** Continue reading from `fields` if production-unit read model is disabled.

### Story 3.3: Map Crop Cycles Into Production Cycles And Add Cycle History

As a farmer,
I want to see current and past crop cycles for a field,
So that I can compare seasons instead of losing history when a crop ends.

**Business objective:** Preserve production history across cycles.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-014, FR-015, FR-016, FR-017, FR-057, FR-060; UX-DR15.

**Affected existing components:** `crop_cycles`, `getCropCycles()`, `FieldsScreen`, field detail modal, report scope logic.

**New components:** Production cycle types, cycle history repository/read model, close/cancel/archive actions.

**Database changes:** Add/extend `production_cycles` with enterprise ID, production unit ID, subject ID where available, planned start, actual start, expected end, actual end, status, targets, planned inputs, expected outputs, compatibility crop cycle ID, and timestamps.

**API changes:** Local repository methods for active cycles, cycle history, close/cancel/archive.

**Migration requirements:** Map existing `crop_cycles` to production cycles; preserve active status; keep existing crop cycle IDs stable as compatibility links.

**Compatibility concerns:** Existing active crop-cycle selectors continue working; old records linked by crop_cycle_id still resolve.

**Acceptance Criteria:**

**Given** an existing active crop cycle
**When** migration completes
**Then** it appears as an active production cycle linked to its production unit and enterprise.

**Given** a farmer closes a cycle
**When** they return to the unit detail
**Then** the cycle appears in history
**And** existing records linked to that cycle remain visible.

**Test requirements:** Migration tests, close/cancel/archive tests, report link tests, manual cycle-history flow.

**Dependencies:** Story 3.2.

**Explicit exclusions:** No sync, no multi-user approvals, no livestock/poultry/aquaculture cycles yet.

**Rollback considerations:** Keep old `crop_cycles` table and active-cycle compatibility reads.

### Story 3.4: Introduce Production Subjects For Crops Without Changing Crop Guidance

As a farmer,
I want each cycle to clearly identify what is being grown,
So that future enterprises can manage crops, animals, flocks, or batches consistently.

**Business objective:** Add the subject abstraction without hard-coding all production to crops.

**Story classification:** technical enabler, local-only

**Requirements covered:** FR-018, FR-019, FR-020, FR-021; NFR-001, NFR-002.

**Affected existing components:** Crop library, crop cycles, field forms, cycle labels.

**New components:** Production subject types and repository methods.

**Database changes:** Add `production_subjects` with subject type, name, variety/breed/group info where relevant, individual/group flag, enterprise link, cycle link where appropriate, and timestamps.

**API changes:** Local repository can create/read crop production subjects for cycles.

**Migration requirements:** Seed crop subjects from existing crop/variety values; do not alter crop guidance tables.

**Compatibility concerns:** ABE Chilli guidance remains advisory and separate from core recordkeeping.

**Acceptance Criteria:**

**Given** an existing crop cycle with crop and variety
**When** subjects are seeded
**Then** the cycle has a crop production subject
**And** the current crop library and practice guidance still behave as before.

**Given** a future non-crop enterprise
**When** subject types are extended later
**Then** the crop subject model does not force animal/flock/pond data into crop fields.

**Test requirements:** Migration tests, crop guidance regression test, typecheck.

**Dependencies:** Story 3.3.

**Explicit exclusions:** No livestock/poultry/aquaculture UI in this story.

**Rollback considerations:** Subject table can be unused while cycle labels continue from crop cycle fields.

### Story 3.5: Redesign Fields Into Production With Plain UI Language

As a farmer,
I want one place to manage fields, active cycles, and past cycles,
So that I can understand where production is happening without learning complicated terms.

**Business objective:** Evolve the UI to the platform model gradually.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-006, FR-009, FR-010, FR-013; UX-DR1, UX-DR2, UX-DR14, UX-DR22, UX-DR27, UX-DR29.

**Affected existing components:** Bottom tabs, `FieldsScreen`, `FieldRow`, `CropCycleRow`, field detail modal, empty states.

**New components:** `ProductionScreen`, unit row, cycle row/history list, farm/enterprise filters where available.

**Database changes:** None beyond reading platform tables.

**API changes:** UI uses production read models while preserving compatibility with field/cycle data.

**Migration requirements:** Uses stories 3.1-3.4 mappings.

**Compatibility concerns:** User-facing text should prefer plain terms such as Field, Plot, Cycle, Current crop, Past cycles; avoid forcing technical labels too early.

**Acceptance Criteria:**

**Given** the app has migrated farm, enterprise, unit, and cycle data
**When** the farmer opens the old Fields tab or new Production tab
**Then** they can see current fields/units, active cycles, and cycle history
**And** empty states guide them to add a field or start a cycle.

**Given** a small Android phone
**When** the Production screen renders
**Then** key labels do not truncate critical field, cycle, status, or money information.

**Test requirements:** Manual mobile layout checks, accessibility label checks, typecheck.

**Dependencies:** Stories 3.1-3.4.

**Explicit exclusions:** No role permissions, no sync, no non-crop enterprise screens.

**Rollback considerations:** Keep old Fields tab available behind a flag during rollout.

### Story 3.6: Add Planned Versus Actual Cycle Performance Reports

As a farmer,
I want to compare what I planned with what happened in a cycle,
So that I can improve the next season.

**Business objective:** Turn production cycles into learning units, not just active labels.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-006, FR-009, FR-017, FR-044; UX-DR19.

**Affected existing components:** Reports screen, cycle detail, report services, exports.

**New components:** Cycle performance calculator, planned/actual report section, export section.

**Database changes:** Use production cycle planned/actual fields and structured records; no new tables unless missing fields are required.

**API changes:** Local report service adds cycle performance read model.

**Migration requirements:** Existing cycles may have unknown planned targets; unknowns must be shown plainly.

**Compatibility concerns:** Do not show cost per plant unless plant population exists; do not claim precision where data is missing.

**Acceptance Criteria:**

**Given** a cycle has planned dates, expected output, actual dates, costs, harvests, and sales
**When** the farmer views cycle performance
**Then** the app shows planned versus actual dates, outputs, total spent, total earned, and net profit where data supports it.

**Given** planned data is missing
**When** the report renders
**Then** missing items are explained in plain English
**And** the report remains usable as an estimate.

**Test requirements:** Report tests for complete and incomplete cycle data; export tests.

**Dependencies:** Stories 2.5 and 3.5.

**Explicit exclusions:** No accounting-grade inventory valuation, no predictive forecasting.

**Rollback considerations:** Hide planned/actual section while retaining basic cycle report.

## Epic 4: Suppliers, Inventory, Workers, Buyers, And Financial Integrity

Farmers can reuse suppliers, buyers, workers, products, and inventory movements so stock, input use, labour cost, sales, payments, and profit reports become more reliable.

### Story 4.1: Add Reusable Suppliers, Buyers, Workers, And Teams

As a farmer,
I want to reuse shops, buyers, workers, and teams instead of typing them every time,
So that records are faster to enter and easier to summarize later.

**Business objective:** Create reusable party data that improves entry speed and reporting.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-035, FR-038, FR-042, FR-043; UX-DR6, UX-DR21.

**Affected existing components:** Structured forms from Epic 2, Manage/More screen, Work Log rows, repository.

**New components:** Suppliers, Buyers, Workers, Teams management surfaces; saved-value pickers.

**Database changes:** Add `suppliers`, `buyers`, `workers`, and `teams` tables with local IDs, names, contact/location notes where useful, active status, timestamps, and legacy-source metadata.

**API changes:** Local repository methods for CRUD and list/search for reusable parties.

**Migration requirements:** Backfill candidates only from exact structured fields created in Epic 2; do not parse old free text into official parties without farmer review.

**Compatibility concerns:** Existing records with typed supplier/buyer/worker text remain readable if no official party is linked.

**Acceptance Criteria:**

**Given** a farmer enters a new supplier while saving fertilizer
**When** they save the record
**Then** the supplier can be reused in future input and expense forms.

**Given** legacy records include supplier-like free text
**When** party tables are created
**Then** the app does not auto-create official suppliers from unsafe text
**And** old records remain visible.

**Test requirements:** Repository tests for party CRUD, picker tests/manual checks, migration candidate tests.

**Dependencies:** Stories 2.1, 2.2, and 2.3.

**Explicit exclusions:** No authentication, no supplier invoices, no customer credit limits.

**Rollback considerations:** Hide management surfaces and continue allowing free-text values in forms.

### Story 4.2: Add Products And Input Inventory Receipts

As a farmer,
I want to record products I buy and stock received,
So that I can know what inputs are available and what they cost.

**Business objective:** Introduce input stock accountability.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-033, FR-034, FR-035; UX-DR21.

**Affected existing components:** Manage/More, fertilizer/chemical/expense forms, report services.

**New components:** Inventory product list, stock receipt form, product picker.

**Database changes:** Add `products`, `input_products` if separated by type, `inventory_batches`, and `stock_receipts` with unit, quantity, unit cost, supplier, batch number, expiry date, receipt photo link, and scope.

**API changes:** Local repository methods for product CRUD and stock receipt create/read.

**Migration requirements:** Structured fertilizer/chemical/expense records may suggest products for farmer review; no unsafe auto-conversion.

**Compatibility concerns:** Input application forms can still accept free-text product names before inventory is complete.

**Acceptance Criteria:**

**Given** a farmer buys fertilizer
**When** they record a stock receipt
**Then** product, quantity, unit, supplier, unit cost, and optional receipt photo are saved
**And** stock on hand updates for that product/batch.

**Given** a product has no batch or expiry
**When** it is saved
**Then** the app allows it if not required for that product type
**And** shows missing optional details plainly.

**Test requirements:** Inventory repository tests, stock-on-hand calculation tests, manual receipt flow.

**Dependencies:** Story 4.1.

**Explicit exclusions:** No stock issue cost allocation yet, no valuation reports beyond stock on hand.

**Rollback considerations:** Keep inventory feature flag; receipts remain dormant without altering structured crop records.

### Story 4.3: Issue Inventory To Production Cycles And Create Production Costs

As a farmer,
I want stock used on a crop cycle to reduce inventory and count as a production cost,
So that input use and profit are connected.

**Business objective:** Connect stock movement to crop-cycle cost.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-034, FR-036, FR-044.

**Affected existing components:** Fertilizer/chemical forms, expense records, inventory screens, report services.

**New components:** Stock issue form, stock movement service, cost allocation helper.

**Database changes:** Add `stock_issues` and `cost_allocations` with product/batch, quantity, unit cost, production cycle/unit/farm scope, linked structured record, and timestamps.

**API changes:** Local repository methods for issuing stock and reading cost allocations.

**Migration requirements:** Existing structured fertilizer/chemical records remain as direct cost records unless farmer links them to inventory.

**Compatibility concerns:** Do not double-count a purchase receipt and stock issue; report rules must distinguish stock purchase from production use.

**Acceptance Criteria:**

**Given** fertilizer stock exists
**When** a farmer records a fertilizer application using inventory
**Then** stock on hand decreases
**And** a cost allocation is created for the selected crop cycle.

**Given** the farmer enters a direct purchase price instead of using inventory
**When** the record is saved
**Then** the app treats it as a direct estimate-grade cost
**And** does not create a stock issue.

**Test requirements:** Stock issue tests, double-count prevention tests, report tests for inventory-issued cost.

**Dependencies:** Story 4.2.

**Explicit exclusions:** No transfer/adjustment/reconciliation yet.

**Rollback considerations:** Disable inventory issue path and keep direct-cost structured forms working.

### Story 4.4: Add Stock Transfers, Adjustments, Expiry, And Reconciliation

As a farmer,
I want to correct stock, move it, and track damaged or expired inputs,
So that inventory stays close to reality.

**Business objective:** Improve inventory reliability beyond simple receipts and issues.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-034; NFR-007.

**Affected existing components:** Inventory screen, product detail, stock-on-hand service.

**New components:** Stock transfer form, adjustment form, reconciliation summary, expiry/damaged stock indicators.

**Database changes:** Add `stock_transfers`, `stock_adjustments`, damaged/expired stock fields or movement reasons, reconciliation metadata.

**API changes:** Local repository methods for transfers, adjustments, and stock history.

**Migration requirements:** None beyond existing inventory tables.

**Compatibility concerns:** Adjustments should not create production costs unless explicitly issued to production.

**Acceptance Criteria:**

**Given** stock is moved between storage locations or farms/units where supported
**When** a transfer is saved
**Then** source and destination stock balances update
**And** stock history shows the transfer.

**Given** stock is damaged, expired, or counted differently
**When** an adjustment is saved
**Then** inventory balance updates
**And** the reason is preserved for later review.

**Test requirements:** Movement balance tests, adjustment reason tests, manual stock history test.

**Dependencies:** Story 4.3.

**Explicit exclusions:** No barcode scanning, no supplier returns, no accounting ledger.

**Rollback considerations:** Hide advanced movement actions while keeping receipts/issues readable.

### Story 4.5: Add Labour And Equipment Cost Allocation

As a farmer,
I want worker, team, and equipment costs tied to farm work,
So that labour and equipment spending appears in the right crop-cycle or farm report.

**Business objective:** Make labour and equipment costs reusable and allocatable.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-038, FR-039, FR-043, FR-044.

**Affected existing components:** Labour form, expense form, Reports, Manage/More.

**New components:** Equipment records, equipment usage form, labour rate helpers, allocation service.

**Database changes:** Add `equipment`, `equipment_usage_records`, labour allocation fields/tables as needed for worker/team, hours/days, piece-work quantity, rate, amount paid, and production scope.

**API changes:** Local repository methods for equipment CRUD, usage records, and labour/equipment cost allocation.

**Migration requirements:** Existing structured labour records can link to workers/teams when farmer selects them; old generic labour remains legacy.

**Compatibility concerns:** Labour amounts from Epic 2 remain estimate-grade until linked allocation is available.

**Acceptance Criteria:**

**Given** a worker or team has a saved rate
**When** a labour record is entered
**Then** the app can calculate or store amount paid
**And** allocate it to the selected crop cycle, unit, farm, or general operation.

**Given** equipment is used for a task
**When** usage is recorded
**Then** fuel/maintenance/usage cost can be allocated to the selected scope.

**Test requirements:** Labour calculation tests, equipment usage repository tests, report allocation tests.

**Dependencies:** Stories 2.2 and 4.1.

**Explicit exclusions:** No payroll, no HR attendance approvals, no depreciation accounting.

**Rollback considerations:** Keep free-text labour records available and hide equipment cost allocation if incomplete.

### Story 4.6: Upgrade Profit Reports To Finance-Integrity Grade Where Data Supports It

As a farmer,
I want reports to use inventory issues, payments, labour, and allocations when available,
So that I can trust profit numbers more than simple estimates.

**Business objective:** Separate operational estimates from stronger finance-integrity reporting.

**Story classification:** farmer-facing, local-only

**Requirements covered:** FR-042, FR-043, FR-044; UX-DR18, UX-DR19, UX-DR20.

**Affected existing components:** Report service, Reports screen, exports, cycle/farm detail summaries.

**New components:** Finance-integrity report calculator, report confidence labels, missing-data diagnostics.

**Database changes:** Use cost/revenue/payment allocation tables from prior stories; add report metadata only if needed.

**API changes:** Local report service returns report grade, included sources, missing data, and totals by scope.

**Migration requirements:** Legacy/generic records stay estimate-grade; structured allocated records can contribute finance-integrity values.

**Compatibility concerns:** Old reports remain available as estimates; changed totals require plain recalculation notes.

**Acceptance Criteria:**

**Given** a crop cycle has inventory-issued inputs, allocated labour, structured sales, and payments
**When** the farmer views the report
**Then** report values use allocated costs and received/outstanding money correctly
**And** the report states its grade clearly.

**Given** a report mixes legacy and allocated records
**When** totals are shown
**Then** the report is labeled Estimate
**And** missing or legacy sources are listed in plain English.

**Test requirements:** Report tests for allocated-only, mixed, unpaid, part-paid, and legacy data; export tests.

**Dependencies:** Stories 4.1-4.5.

**Explicit exclusions:** No tax accounting, no formal general ledger, no external accounting integration.

**Rollback considerations:** Feature flag finance-integrity reports and keep Epic 2 estimate reports.

## Epic 5: Shared Farm Access, Privacy, Audit, And Sync

Farm teams can safely work across users and devices with authentication, memberships, permissions, audit trails, sync queues, conflict review, and no loss of locally entered records.

### Decision 5.A: Decide Backend, Auth, Tenancy, And Sync Architecture

**Type:** Decision / ADR prerequisite
**Implementation readiness:** Not a development story
**Must complete before:** Stories 5.1, 5.2, 5.3, and 5.4

Masona Farms must choose the backend stack, authentication approach, tenant model, sync strategy, and local-to-cloud migration direction before shared-farm implementation begins.

This artifact does not ship runtime functionality. It exists to unblock implementation stories that will later deliver authentication, membership access, sync, conflict review, and audit behavior.

**Business objective:** Remove major platform uncertainty before coding multi-user access.

**Story classification:** decision prerequisite

**Requirements covered:** FR-045, FR-046, FR-048, FR-050, FR-051, FR-052, FR-053, FR-062; NFR-004, NFR-005, NFR-007.

**Affected existing components:** None at runtime; planning docs and architecture docs.

**New components:** Backend/auth/sync architecture decision records, API ownership map, data boundary diagram.

**Database changes:** None.

**API changes:** Define future API style and contract boundaries, but do not implement endpoints.

**Migration requirements:** Define local-to-cloud migration approach and backup expectations.

**Compatibility concerns:** Current local-only app must remain supported while platform architecture is decided.

**Acceptance Criteria:**

**Given** Decision 5.A is complete
**When** implementation planning continues
**Then** the team has documented the chosen backend stack, auth approach, tenant model, sync strategy, and data migration direction
**And** the document explicitly states what remains local-only during transition.

**Given** multiple backend options exist
**When** the decision is recorded
**Then** trade-offs include offline support, tenant isolation, audit logging, cost, deployment complexity, and Android mobile constraints.

**Test requirements:** Architecture review; no runtime tests.

**Dependencies:** Stories 1.1, 2.5, 3.6, and 4.6.

**Explicit exclusions:** No backend code, no login screen, no sync worker.

**Rollback considerations:** Decision can be superseded by a new ADR before implementation begins.

### Specification 5.B: Define Shared-Farm API Contracts, Role Matrix, And Audit Policy

**Type:** Specification prerequisite
**Implementation readiness:** Not a development story
**Must complete before:** shared-farm backend, auth, sync, and audit implementation stories

Define the API contracts, role matrix, permission rules, audit event catalogue, tenant boundaries, and local-to-cloud identity mapping required for shared-farm implementation.

This artifact does not ship runtime functionality. It gives later implementation stories the contract they need for server-enforced access, audit logging, sync behavior, and safe migration.

**Business objective:** Specify server-enforced access and audit rules before UI or mobile code depends on them.

**Story classification:** specification prerequisite

**Requirements covered:** FR-045, FR-046, FR-047, FR-048; NFR-004, NFR-005, NFR-006.

**Affected existing components:** Planning docs, future repository/API client boundaries.

**New components:** API contract document, role and permission matrix, audit event catalogue.

**Database changes:** Define future backend entities: users, organisations, memberships, roles, permissions, audit events, sync metadata; no local runtime migration yet unless sync prep requires metadata.

**API changes:** Specify endpoint contracts for `GET /me`, organisations/farms, memberships, production data, structured records, sync batch push/pull, media attachments, audit-visible actions.

**Migration requirements:** Define how local IDs map to server IDs and how existing local farm owner becomes an organisation/farm member.

**Compatibility concerns:** Permissions must be server-enforced in platform release, not only frontend conditionals.

**Acceptance Criteria:**

**Given** the contracts are complete
**When** a developer starts backend work
**Then** they can see required request/response shapes, identity boundaries, role checks, and audit requirements.

**Given** a privileged action affects finance, inventory, health, permissions, exports, or sync conflict resolution
**When** it is specified
**Then** the audit policy defines actor, timestamp, scope, before/after or summary, and retention expectation.

**Test requirements:** Contract review; future contract tests identified.

**Dependencies:** Decision 5.A.

**Explicit exclusions:** No implemented backend endpoints.

**Rollback considerations:** Contracts can be versioned before implementation; breaking changes must be documented.

### Story 5.1: Add Local Sync Metadata And Queue Without Sending Data

As a farmer,
I want records saved on my phone to be ready for future sync,
So that offline entry remains safe when cloud sync is added.

**Business objective:** Prepare local data for sync while preserving local-first trust.

**Story classification:** technical enabler, local-only

**Requirements covered:** FR-049, FR-050, FR-051, FR-053; NFR-007.

**Affected existing components:** Repository tables from Epics 1-4, local write methods, backup/export messaging.

**New components:** Sync metadata helpers, local sync queue repository, sync status read model.

**Database changes:** Add `sync_queue`, local/server ID fields where missing, sync status fields, idempotency keys, retry metadata, and changed-at timestamps for syncable records.

**API changes:** None to backend; local repository write methods enqueue changes.

**Migration requirements:** Existing local rows receive local IDs and unsynced/legacy status without changing visible data.

**Compatibility concerns:** App still works offline; no network required; no farmer data leaves the device.

**Acceptance Criteria:**

**Given** the app is offline/local-only
**When** a farmer creates or edits a syncable record
**Then** the record is saved locally
**And** a sync queue entry is created without attempting network upload.

**Given** existing local records
**When** sync metadata migration runs
**Then** local IDs remain stable
**And** records remain visible in current screens.

**Test requirements:** Migration tests, queue creation tests, idempotency key tests, no-network runtime check.

**Dependencies:** Decision 5.A and Specification 5.B.

**Explicit exclusions:** No server sync, no login, no conflict resolution UI yet.

**Rollback considerations:** Queue can remain dormant; local writes continue even if queue creation is disabled.

### Story 5.2: Add Authentication And Membership Foundation

As a farm owner,
I want only approved people to access shared farm records,
So that private financial and production data stays protected.

**Business objective:** Establish identity and membership trust boundary.

**Story classification:** farmer-facing, backend-required

**Requirements covered:** FR-045, FR-046, FR-048; NFR-004, NFR-005.

**Affected existing components:** Profile setup, app boot, farm header, future API client, local owner bootstrap.

**New components:** Auth client, session store, login/onboarding screens, membership read model, access guard.

**Database changes:** Local session/user cache if needed; server-side user, organisation, farm membership, role tables per contract.

**API changes:** Implement auth/session endpoints or provider integration, `GET /me`, membership retrieval.

**Migration requirements:** Existing local profile maps to an owner bootstrap or account-claim flow based on Decision 5.A.

**Compatibility concerns:** Local-only data entry must not be broken before migration/backup is available.

**Acceptance Criteria:**

**Given** a farmer has an account
**When** they sign in
**Then** they see only organisations/farms where they have membership
**And** local profile data remains available for migration/claim flow.

**Given** a user lacks farm membership
**When** they try to access that farm by link or stale local state
**Then** access is denied with plain copy and no farm data is shown.

**Test requirements:** Auth/session tests, membership access tests, manual login/logout flows.

**Dependencies:** Decision 5.A, Specification 5.B, and Story 1.5.

**Explicit exclusions:** No full sync implementation, no advanced role customization beyond minimum matrix.

**Rollback considerations:** Feature flag cloud login; preserve local-only mode until migration is safe.

### Story 5.3: Implement Sync Push/Pull With Safe Conflict Review

As a farm team member,
I want records saved offline to sync later without overwriting important changes,
So that field work continues even with poor connectivity.

**Business objective:** Turn local-only offline into sync-capable offline.

**Story classification:** farmer-facing, backend-required

**Requirements covered:** FR-049, FR-050, FR-051, FR-052, FR-053; UX-DR25, UX-DR26.

**Affected existing components:** Local repository, sync queue, farm header, Manage sync review, Work Log, structured records, inventory/finance records.

**New components:** Sync worker, API client, conflict detector, Sync Review screen, sync status badges.

**Database changes:** Use `sync_queue`, `sync_conflicts`, server IDs, retry metadata, conflict status, last synced timestamps.

**API changes:** Implement sync batch push/pull endpoints according to contracts.

**Migration requirements:** Existing queued local records upload only after account/farm mapping and backup checks pass.

**Compatibility concerns:** Local saves must never be blocked by sync; money, inventory, health, and safety conflicts require human review.

**Acceptance Criteria:**

**Given** a farmer creates records offline
**When** connectivity returns and they are signed in
**Then** records are pushed with idempotency
**And** successful sync updates server IDs without changing local IDs.

**Given** the same financial record changed on two devices
**When** sync detects a conflict
**Then** Sync Review shows plain choices and does not auto-overwrite either version.

**Test requirements:** Sync queue tests, push/pull contract tests, retry tests, conflict tests, manual offline/online test.

**Dependencies:** Stories 5.1 and 5.2.

**Explicit exclusions:** No automatic conflict resolution for money/inventory/health/safety records.

**Rollback considerations:** Disable sync worker remotely/locally while preserving queued entries and local-first writes.

### Story 5.4: Add Audit Trail For Privileged Shared-Farm Actions

As a farm owner,
I want important changes to be traceable,
So that finance, inventory, health, exports, and permissions are accountable.

**Business objective:** Make shared-farm operations trustworthy and reviewable.

**Story classification:** farmer-facing, backend-required

**Requirements covered:** FR-047; NFR-005, NFR-006.

**Affected existing components:** Finance/inventory/record mutation paths, role/access actions, export actions, sync conflict resolution.

**New components:** Audit event writer, audit repository/API endpoints, audit review surface for authorized users.

**Database changes:** Add local audit event cache if needed; backend `audit_events` per policy.

**API changes:** Audit event write/read endpoints or server-side audit hooks for privileged actions.

**Migration requirements:** Existing local-only history remains legacy; audit begins for supported shared-farm actions after feature rollout.

**Compatibility concerns:** Do not log sensitive details unnecessarily; audit must include useful summary without exposing secrets.

**Acceptance Criteria:**

**Given** a privileged user changes payment, inventory, permission, export, or conflict resolution data
**When** the action completes
**Then** an audit event records actor, scope, action, timestamp, and safe summary.

**Given** an unauthorized user tries to view audit history
**When** they access the audit surface
**Then** access is denied.

**Test requirements:** Audit event tests, authorization tests, privacy review.

**Dependencies:** Specification 5.B, Story 5.2, and Story 5.3.

**Explicit exclusions:** No full compliance export, no immutable ledger guarantee unless chosen in architecture.

**Rollback considerations:** Server-side hooks should fail closed for privileged shared actions; local data entry remains available where no cross-user data can leak.

## Epic 6: Multi-Enterprise Farm Modules

Farmers can extend Masona Farms beyond crops into livestock, poultry, aquaculture, beekeeping, and future enterprise types using the shared production, finance, inventory, and reporting model.

### Decision 6.A: Choose First Non-Crop Enterprise And Define Extension Pattern

**Type:** Product / architecture decision prerequisite
**Implementation readiness:** Not a development story
**Must complete before:** any committed Epic 6 implementation story

Masona Farms must choose the first non-crop enterprise module and document the extension pattern before Epic 6 implementation begins.

The decision must compare livestock, poultry, aquaculture, beekeeping/configurable enterprises, and inventory-led expansion using farmer value, data readiness, implementation effort, financial reporting impact, and fit with the shared production model.

Until this decision is approved, livestock, poultry, aquaculture, and configurable enterprise stories remain candidate backlog, not committed implementation sequence.

**Business objective:** Avoid building several shallow modules or isolated generic record piles.

**Story classification:** decision prerequisite

**Requirements covered:** FR-031, FR-032; NFR-001, NFR-003.

**Affected existing components:** Planning docs, enterprise model from Epic 3, reports from Epic 4/5.

**New components:** Enterprise prioritization decision, module extension pattern, shared metric contract.

**Database changes:** None at runtime.

**API changes:** Define extension expectations for future APIs if backend exists.

**Migration requirements:** None.

**Compatibility concerns:** Crop workflows remain unchanged; non-crop terms should not leak into crop-only farms.

**Acceptance Criteria:**

**Given** multiple enterprise candidates exist
**When** prioritization is complete
**Then** the first non-crop enterprise is chosen or explicitly marked as an unresolved dependency
**And** the decision explains why using farmer value, data readiness, implementation effort, and reporting impact.

**Given** the extension pattern is documented
**When** a new module is created
**Then** it must reuse enterprises, production units, production subjects, production cycles, inventory, finance, sync, and reports where applicable.

**Test requirements:** Product/architecture review; no runtime tests.

**Dependencies:** Stories 3.6 and 4.6.

**Explicit exclusions:** No enterprise module implementation in this story.

**Rollback considerations:** Decision can be revised before implementation.

### Story 6.1: Add Livestock Enterprise Registry And Health Events

As a livestock farmer,
I want to track animals or groups, health events, medicines, and costs,
So that livestock production history and treatment costs are not lost in notes.

**Business objective:** Deliver the first livestock slice using shared production and finance foundations.

**Story classification:** candidate, farmer-facing

**Requirements covered:** FR-026, FR-027; NFR-003.

**Affected existing components:** Production screen, Work Log, inventory products, supplier/worker records, reports, sync/audit if enabled.

**New components:** Livestock subject registry, animal/group profile screens, livestock health event form.

**Database changes:** Add livestock extension tables for species, breed, production purpose, animal/group identity, movements if needed for this slice, health incidents, treatments, medicine usage, dosage, withdrawal period, recovery status, and follow-up.

**API changes:** If backend exists, add livestock registry and health endpoints following Epic 5 contracts; otherwise local repository methods.

**Migration requirements:** None from crop data; new livestock data uses shared enterprise/cycle/subject IDs.

**Compatibility concerns:** Medicines should reuse inventory products where available; treatment costs should use finance allocation patterns.

**Acceptance Criteria:**

**Given** a livestock enterprise exists
**When** a farmer registers an animal or group
**Then** the subject is linked to the enterprise, unit, and cycle where applicable.

**Given** a health treatment is recorded
**When** medicine, dosage, cost, withdrawal period, and follow-up are saved
**Then** the event appears in Work Log
**And** costs appear in relevant livestock reports.

**Test requirements:** Registry tests, health event repository tests, report cost tests, manual livestock flow.

**Dependencies:** Decision 6.A, Stories 3.6 and 4.6.

**Explicit exclusions:** Full breeding, milk production, advanced movement, and veterinary workflows unless chosen as the first slice.

**Rollback considerations:** Hide livestock surfaces; shared platform data remains unaffected.

### Story 6.2: Add Livestock Breeding And Mortality Events

As a livestock farmer,
I want breeding, births, weaning, mortality, and disposal tracked,
So that herd history and losses are visible.

**Business objective:** Extend livestock beyond health into lifecycle management.

**Story classification:** candidate, farmer-facing

**Requirements covered:** FR-026, FR-028.

**Affected existing components:** Livestock registry, Work Log, reports, production subjects.

**New components:** Breeding event form, birth/weaning event form, mortality/disposal form, lineage read model.

**Database changes:** Add breeding records for mating/insemination, pregnancy checks, expected birth dates, births, parent-child links, weaning, mortality, sales/disposal where supported.

**API changes:** Local/backend livestock event endpoints/repositories.

**Migration requirements:** None.

**Compatibility concerns:** Mortality and disposal may affect inventory/valuation/reporting but should not break existing subjects.

**Acceptance Criteria:**

**Given** an animal or group exists
**When** a breeding or birth event is saved
**Then** parent-child or group-count history is preserved.

**Given** mortality is recorded
**When** reports are viewed
**Then** losses are visible in livestock summaries
**And** financial impact is shown only where cost/revenue data supports it.

**Test requirements:** Lifecycle event tests, lineage/group-count tests, report tests.

**Dependencies:** Decision 6.A, Story 6.1, Stories 3.6 and 4.6.

**Explicit exclusions:** Genetic analytics, veterinary compliance exports, full sales invoicing.

**Rollback considerations:** Hide breeding/mortality forms while retaining registered animals/groups.

### Story 6.3: Add Poultry Flock Management

As a poultry farmer,
I want to track flocks, placement, daily counts, feed, mortality, vaccinations, weights, and closure,
So that I can understand flock performance and costs.

**Business objective:** Deliver poultry as a group-based enterprise module.

**Story classification:** candidate, farmer-facing

**Requirements covered:** FR-029; NFR-003.

**Affected existing components:** Production units, production subjects, inventory/feed products, Work Log, Reports.

**New components:** Flock setup, poultry-house allocation, daily flock record form, flock closure summary.

**Database changes:** Add poultry extension tables for flock identity, placement, opening quantity, feed/water consumption, mortality, culls, vaccinations, weights, egg production where applicable, grading, feed conversion, closure.

**API changes:** Local/backend poultry endpoints/repositories if platform backend exists.

**Migration requirements:** None.

**Compatibility concerns:** Feed and vaccine use should reuse inventory and cost allocation where available.

**Acceptance Criteria:**

**Given** a poultry enterprise and house/unit exist
**When** a flock is created
**Then** opening quantity, placement date, purpose, and unit allocation are saved.

**Given** daily records are entered
**When** feed, mortality, weight, or egg production is saved
**Then** flock performance and costs update
**And** closure summary calculates supported metrics.

**Test requirements:** Flock record tests, feed conversion tests, report tests, manual flock flow.

**Dependencies:** Decision 6.A, Stories 3.6 and 4.6.

**Explicit exclusions:** Hatchery management unless prioritized separately.

**Rollback considerations:** Disable poultry surfaces without affecting shared production tables.

### Story 6.4: Add Aquaculture Pond, Batch, And Water-Quality Management

As an aquaculture farmer,
I want to track ponds or cages, fish batches, feeding, water quality, mortality, sampling, and harvests,
So that fish production and feed efficiency are measurable.

**Business objective:** Deliver aquaculture using the same production-cycle and inventory patterns.

**Story classification:** candidate, farmer-facing

**Requirements covered:** FR-030; NFR-003.

**Affected existing components:** Production units, production cycles, inventory/feed products, Work Log, Reports.

**New components:** Pond/cage unit form extensions, fish batch setup, water-quality form, sampling form.

**Database changes:** Add aquaculture extension tables for pond/cage details, fish batch, stocking, fingerling source, feed schedules, feed consumption, water-quality measurements, mortality, sampling, average weight, biomass estimation, feed conversion, partial/final harvest.

**API changes:** Local/backend aquaculture endpoints/repositories if backend exists.

**Migration requirements:** None.

**Compatibility concerns:** Feed use and harvest sales should reuse inventory and finance/reporting primitives.

**Acceptance Criteria:**

**Given** a pond or cage production unit exists
**When** a fish batch is stocked
**Then** stocking date, source, quantity, and cycle are saved.

**Given** feed, water quality, mortality, sampling, and harvest data are entered
**When** reports are viewed
**Then** biomass, feed conversion, harvest quantity, costs, and revenue appear where data supports them.

**Test requirements:** Aquaculture repository tests, metric calculation tests, report tests.

**Dependencies:** Decision 6.A, Stories 3.6 and 4.6.

**Explicit exclusions:** IoT water sensors, digital scales, buyer integrations.

**Rollback considerations:** Hide aquaculture module and keep shared records unaffected.

### Story 6.5: Add Configurable Enterprise Type Framework

As a farm owner,
I want Masona Farms to support future enterprises like beekeeping, mushrooms, or other farm activities,
So that the app can grow without rewriting the core model.

**Business objective:** Enable future enterprise types through configuration and modular extensions.

**Story classification:** candidate, technical enabler

**Requirements covered:** FR-031, FR-032; NFR-001, NFR-003.

**Affected existing components:** Enterprise model, Production screen, Work Log, Reports, Manage.

**New components:** Enterprise type configuration model, common activity/input/output definitions, metric definitions, module registration pattern.

**Database changes:** Add `enterprise_type_configs`, configurable unit definitions, subject definitions, activity definitions, input/output definitions, metric definitions.

**API changes:** Local/backend configuration endpoints/repositories if backend exists.

**Migration requirements:** Existing crop/livestock/poultry/aquaculture modules may register default configs; no farmer data should be rewritten.

**Compatibility concerns:** Configurable modules must not replace specialized modules where safety, health, or finance requires structured fields.

**Acceptance Criteria:**

**Given** a configured enterprise type exists
**When** a farmer enables it
**Then** the app can create its units, subjects, common activities, inputs, outputs, and basic reports using shared primitives.

**Given** a specialized module exists
**When** configuration overlaps with it
**Then** the specialized structured workflow remains the source of truth for safety, health, finance, and reporting.

**Test requirements:** Config model tests, module registration tests, basic report tests.

**Dependencies:** Decision 6.A, Stories 3.6 and 4.6.

**Explicit exclusions:** No marketplace for custom modules, no arbitrary scripting, no unsafe dynamic schema changes.

**Rollback considerations:** Disable configurable enterprise types while preserving existing specialized module data.
