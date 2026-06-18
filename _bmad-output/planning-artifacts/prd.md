# Product Requirements Document

## Masona Farms Platform PRD - Normalized Against Current Codebase

**Document version:** 1.1  
**Status:** Draft  
**Source baseline:** `_bmad-output/planning-artifacts/prd-original.md`  
**Current implementation baseline:** Expo React Native Android app with local SQLite storage  
**Product type:** Farm Management System  
**Initial market:** Zambia  
**Future market:** Southern and Central Africa  
**Updated:** 2026-06-17

---

# 1. Product Position

Masona Farms is intended to become a comprehensive farm-management platform for crop, livestock, poultry, aquaculture, beekeeping, and mixed-farming businesses.

The current codebase is an offline-first crop recordkeeping mobile app. That implementation is not the end goal; it is the first working wedge. This PRD therefore keeps the ambition of `prd-original.md`, but normalizes it into an executable transformation plan from the current app toward the full platform.

The product goal remains:

> Help farms operate as measurable businesses by tracking production, resources, inventory, costs, outputs, sales, and profitability across every farm enterprise.

---

# 2. Current Codebase Reality

The repository currently implements:

* Expo React Native Android app.
* Local SQLite database named `masona-farms.db`.
* One local farmer profile, not a login identity.
* Fields and active crop cycles.
* Crop library and ABE Chilli guidance.
* Generic farm records using `type`, `field`, `crop_cycle_id`, `detail`, `quantity`, `date`, and `amount`.
* Record types including activity, planting, fertilizer, chemical, irrigation, expense, labor, harvest, sale, payment, restocking, and problem.
* Local photos, receipt links, reminders, notifications, calendar, PDF export, CSV export, and simple profit reports.
* Soft archive of records through `deleted_at`.

The repository does not currently implement:

* Backend API.
* Cloud database.
* Authentication or authorization.
* Multi-user roles.
* Tenant isolation.
* Versioned migrations.
* Organisation, farm, enterprise, supplier, inventory, customer, invoice, payment, animal, flock, pond, equipment, or audit-log tables.
* Automated tests beyond TypeScript type checking.

Challenge: the original PRD is a platform PRD, while the codebase is a local mobile prototype. The correct response is not to reduce the product vision. The correct response is to make the platform transition explicit, sequenced, and testable.

---

# 3. Normalization Rules

These rules govern how the original PRD should be interpreted against the current implementation.

* NR-001: The full platform vision from `prd-original.md` remains the target.
* NR-002: Existing local crop-recordkeeping functionality should be treated as a seed, not a boundary.
* NR-003: Platform requirements that assume multiple users, multiple farms, or shared data require backend, identity, tenancy, and authorization work before they can be claimed complete.
* NR-004: Existing local SQLite data must be migrated or preserved. The platform pivot must not casually strand early farmer records.
* NR-005: Generic records are acceptable only as an interim capture model. Platform reporting requires structured domain records.
* NR-006: Crop, livestock, poultry, aquaculture, and beekeeping must share a generalized production model instead of forcing all enterprises into crop-specific fields.
* NR-007: Offline-first remains a product requirement, but offline-first must become sync-capable, not device-local only.
* NR-008: Financial reports must only claim precision when the underlying records are structured enough to support that calculation.
* NR-009: Every platform module must define both its domain data and its financial impact.
* NR-010: Outgrower OS remains outside Masona Farms ownership; integration is a boundary, not a merge.

---

# 4. Product Vision

Masona Farms shall provide one reliable system for managing production, resources, inventory, finances, and performance across farm enterprises.

The platform shall help farm owners answer:

1. What are we producing?
2. Where is production taking place?
3. Which production cycle is active?
4. What inputs, feed, medicines, labour, equipment, and other resources were consumed?
5. What did each enterprise, unit, and cycle cost?
6. What outputs were produced?
7. What stock is available?
8. What was sold, to whom, and what remains unpaid?
9. Which farm, enterprise, unit, or cycle is profitable?
10. Where are losses occurring?

---

# 5. Product Goals

Masona Farms shall:

* Digitise farm operations across crops, livestock, poultry, aquaculture, beekeeping, and mixed farming.
* Support one organisation managing multiple farms.
* Support each farm managing multiple enterprises.
* Track production by enterprise, production unit, production subject, and production cycle.
* Track inputs, feed, medicines, labour, equipment, inventory, outputs, losses, sales, and payments.
* Calculate cost of production and profitability.
* Preserve farm audit trails.
* Support offline and low-connectivity data entry.
* Support future enterprise types without redesigning the core model.

---

# 6. Strategic Challenges

## 6.1 Platform Architecture Gap

The original PRD assumes a platform. The codebase is a single-device app.

Requirement: before implementing multi-user platform modules, Masona Farms must define backend architecture, identity, tenant boundaries, API contracts, sync behavior, and migration strategy.

## 6.2 Domain Model Gap

The original PRD’s domain model includes Organisation, Farm, Enterprise, ProductionUnit, ProductionCycle, ProductionSubject, Input, Output, Inventory, Sales, and AuditLog.

The codebase currently has fields, crop cycles, generic records, photos, reminders, and a local profile.

Requirement: the platform model must be introduced deliberately, with compatibility mappings from current local data.

## 6.3 Generic Record Gap

The current `records` table is flexible but weak. It cannot reliably answer supplier, dosage basis, withholding period, buyer, selling price, payment status, animal ID, flock mortality, feed conversion, water quality, inventory stock, or audit questions.

Requirement: platform modules must use structured records while preserving old generic records as legacy history.

## 6.4 Offline Gap

The app is offline because it is local-only. The PRD needs offline-capable collaboration, not isolated device storage.

Requirement: offline platform work must include local queueing, server sync, conflict handling, duplicate prevention, and farmer-facing conflict messages.

## 6.5 Security Gap

The app has no login. The original PRD requires private farm financial data, role-based access, tenant isolation, and audit trails.

Requirement: roles and permissions cannot be treated as UI labels. They require identity, membership, authorization checks, audit logging, and export controls.

---

# 7. Target Product Model

## 7.1 Organisation

Represents the farm business, company, cooperative, estate, school farm, or production facility using Masona Farms.

Functional requirements:

* FR-001: Users with permission shall create and manage organisations.
* FR-002: An organisation shall contain one or more farms.
* FR-003: Organisation settings shall include default currency, unit preferences, enabled modules, and user membership.

Current gap: no organisation table exists. The current local profile is not an organisation.

## 7.2 Farm

Represents a farm location or operating property.

Functional requirements:

* FR-004: An organisation shall manage multiple farms.
* FR-005: Each farm shall have a name, location, optional GPS details, active status, and assigned users.
* FR-006: Farm-level expenses and reports shall be supported.

Current gap: current `farm_name` is stored in `user_profiles`, not a farm entity.

## 7.3 Enterprise

Represents a distinct agricultural business within a farm, such as soybean production, broiler production, dairy production, pig fattening, tilapia production, honey production, or mushroom production.

Functional requirements:

* FR-007: A farm shall support multiple enterprises.
* FR-008: Each enterprise shall have an enterprise type, production purpose, active status, expected outputs, standard activities, and default units.
* FR-009: Reports shall compare enterprise performance.

Current gap: current app has crop fields but no enterprise abstraction.

## 7.4 Production Unit

Represents where production happens.

Examples: field, crop block, greenhouse, poultry house, pig pen, barn, paddock, dairy unit, pond, cage, apiary, hatchery.

Functional requirements:

* FR-010: Users shall create production units under farms and enterprises.
* FR-011: Production units shall support type-specific size or capacity fields.
* FR-012: Production units shall support parent-child relationships.
* FR-013: Production units shall retain production history across cycles.

Current reuse: current fields can migrate into production units of type `Field`.

## 7.5 Production Cycle

Represents a defined production period: crop season, broiler batch, layer cycle, pig-fattening cycle, breeding cycle, lactation cycle, fish grow-out cycle, or honey season.

Functional requirements:

* FR-014: Users shall create production cycles linked to enterprise and production unit.
* FR-015: Each cycle shall track planned start, actual start, expected end, actual end, status, targets, planned inputs, and expected outputs.
* FR-016: Users shall close, cancel, or archive cycles while preserving historical records.
* FR-017: Reports shall calculate planned versus actual performance by cycle.

Current reuse: current `crop_cycles` can seed crop production cycles, but status/history needs migration.

## 7.6 Production Subject

Represents what is being managed.

Examples: crop, individual animal, herd, flock, fish batch, bee colony.

Functional requirements:

* FR-018: Each production cycle shall identify its production subject.
* FR-019: Production subjects shall support both individual and group-based management.
* FR-020: Subject-specific modules shall extend the common production model without breaking shared reporting.

Current gap: no production subject model exists beyond crop/crop-cycle text.

---

# 8. Core Functional Requirements

## 8.1 Crop Production

Masona Farms shall support field crops, horticulture, orchards, greenhouses, herbs, spices, and seed production.

Functional requirements:

* FR-021: Crop enterprises shall support crop and variety catalogues.
* FR-022: Crop cycles shall support planting, transplanting, expected harvest, plant population, crop stage, crop inspections, input applications, irrigation, pest and disease observations, corrective actions, harvest forecasts, harvest records, and yield calculations.
* FR-023: Fertilizer applications shall capture fertilizer name, application date, dosage value, dosage unit, dosage basis, quantity used, supplier, purchase price, application notes, and observed result.
* FR-024: Chemical applications shall capture chemical name, date, dosage, target pest/disease/condition, quantity used, supplier, purchase price, safety notes, withholding notes, and observed result.
* FR-025: Irrigation records shall capture date, method, schedule type, rainfall notes, skipped watering, and irrigation issues.

Current status: crop fields, crop cycles, crop library, generic fertilizer/chemical/irrigation records, calendar, reminders, and reports exist. Structured input fields do not.

Migration implication: existing crop fields become production units; active crop cycles become production cycles; generic input records become legacy records or are migrated into structured crop records when safe.

## 8.2 Livestock Production

Masona Farms shall support individual and group-based livestock management.

Functional requirements:

* FR-026: Livestock enterprises shall support species, breed, production purpose, individual animal records, animal groups, herds, movements, weights, breeding, births, health incidents, treatments, vaccinations, mortality, sales, and disposal.
* FR-027: Animal health records shall capture treatment cost, medicine usage, dosage, withdrawal period, authorised recorder, recovery status, and follow-up.
* FR-028: Breeding records shall support natural mating, artificial insemination, pregnancy checks, expected birth dates, births, parent-child relationships, and weaning.

Current gap: no livestock model exists. This is new platform scope.

Challenge: livestock must not be built as a pile of generic records. It needs subject identity, event history, health constraints, and cost linkage.

## 8.3 Poultry Production

Functional requirements:

* FR-029: Poultry enterprises shall support flock creation, poultry-house allocation, placement, daily opening quantity, feed consumption, water consumption, mortality, culls, vaccinations, average weight, uniformity, egg production, egg grading, hatchability, feed conversion ratio, and flock closure.

Current gap: no flock or poultry-house model exists. This is new platform scope.

## 8.4 Aquaculture

Functional requirements:

* FR-030: Aquaculture enterprises shall support ponds, cages, fish batches, stocking, fingerling source, feed schedules, feed consumption, water-quality measurements, mortality, sampling, average weight, biomass estimation, feed conversion ratio, partial harvest, final harvest, and cycle closure.

Current gap: no pond, cage, fish batch, or water-quality model exists. This is new platform scope.

## 8.5 Beekeeping And Other Enterprises

Functional requirements:

* FR-031: The platform shall support configurable enterprise types such as beekeeping, mushroom production, snail farming, insect farming, and future agricultural enterprises.
* FR-032: Configurable enterprise types shall define production units, production subjects, common activities, inputs, outputs, and report metrics.

Current gap: no enterprise configuration model exists.

---

# 9. Inventory, Inputs, And Suppliers

The original PRD requires inventory. The current app only has expense/restocking records and receipt photos.

Functional requirements:

* FR-033: The system shall manage input products, feed, medicines, vaccines, seed, fertilizer, chemicals, fuel, packaging, spare parts, and finished outputs.
* FR-034: Inventory shall support stock receipts, issues, transfers, adjustments, damaged stock, expired stock, batch numbers, expiry dates, unit costs, stock valuation, reorder levels, and reconciliation.
* FR-035: Supplier records shall be reusable across purchases, stock receipts, fertilizer records, chemical records, medicines, feed, equipment, and expenses.
* FR-036: Issuing stock to a production cycle shall create both inventory movement and production cost records.

Current gap: no inventory or supplier tables exist.

Challenge: inventory must be introduced before claiming input accountability, stock valuation, supplier history, or feed/medicine traceability.

---

# 10. Labour, Activities, And Equipment

Functional requirements:

* FR-037: Activities shall support planned dates, completion dates, assigned users or teams, labour used, equipment used, inputs consumed, costs, photos, notes, and status.
* FR-038: Labour shall support worker profiles, permanent and casual workers, teams, attendance, task assignments, labour hours, daily rates, piece-work rates, and labour cost allocation.
* FR-039: Equipment shall support registration, category, ownership status, operator assignment, usage records, fuel usage, maintenance schedules, repairs, downtime, operating cost, and assignment to activities.

Current status: generic activity and labor records exist; worker, equipment, attendance, and assignment models do not.

Challenge: labour costs currently live in `records.amount`. Platform labour needs worker identity and cost allocation.

---

# 11. Outputs, Sales, Payments, And Finance

Functional requirements:

* FR-040: Outputs shall be defined by enterprise and production cycle.
* FR-041: Output records shall capture quantity, unit, quality or grade, rejects, batch, storage destination, internal use, processing, and sale eligibility.
* FR-042: Sales shall support customer registration, quotations, sales orders, delivery notes, invoices, payments received, outstanding balances, product batches, sales by enterprise, sales by production cycle, and customer history.
* FR-043: Expenses shall support categories, supplier records, purchase records, receipt attachments, recurring expenses, approval workflows, and allocation to farm, enterprise, unit, cycle, or general operation.
* FR-044: Profitability shall calculate cost per hectare, production unit, animal, bird, pond, kilogram, litre, farm, enterprise, production unit, and production cycle where the underlying data supports it.

Current status: sales, payments, expenses, harvests, and profit reports exist only as generic records and simple calculations.

Challenge: the current report rule treats `Sale` as revenue, ignores `Harvest`, and treats other amounts as expenses. That is not strong enough for platform finance.

---

# 12. Roles And Permissions

Functional requirements:

* FR-045: The system shall support organisation administrators, farm owners, farm managers, agronomists, livestock officers, veterinarians, poultry managers, aquaculture managers, storekeepers, finance officers, supervisors, workers, and auditors.
* FR-046: Permissions shall be configurable by organisation, farm, enterprise, production unit, module, and action.
* FR-047: Privileged finance, inventory, health, and user-management actions shall be audited.
* FR-048: Users shall only access organisations and farms where they have membership.

Current gap: no authentication, users, memberships, roles, or permissions exist.

Challenge: role-based permissions cannot be implemented as frontend conditionals only. They require backend enforcement or an equivalent trusted access layer.

---

# 13. Offline, Sync, And Data Ownership

Functional requirements:

* FR-049: Selected mobile workflows shall support offline data entry.
* FR-050: Offline-created records shall queue for sync when connectivity returns.
* FR-051: Sync shall handle retries, duplicate prevention, server IDs, local IDs, and conflict detection.
* FR-052: Conflict messages shall be clear and safe, especially for financial, inventory, and health records.
* FR-053: Locally entered records shall not be lost during sync, migration, or app upgrades.

Current status: app works offline because all data is local. No sync exists.

Challenge: local-only is not the same as offline-capable platform architecture.

---

# 14. Non-Functional Requirements

## 14.1 Extensibility

* NFR-001: New enterprise types shall be added through configuration and modular domain extensions.
* NFR-002: Crop-specific recommendations shall remain separate from general recordkeeping.
* NFR-003: Shared reporting shall use common enterprise, unit, cycle, input, output, cost, and revenue abstractions.

## 14.2 Security And Privacy

* NFR-004: Farm financial data shall be private by default.
* NFR-005: Cloud-backed versions shall provide authentication, authorization, tenant isolation, audit trails, secure password handling, rate limiting, session management, and export controls.
* NFR-006: Sensitive farm data shall not be logged unnecessarily.

## 14.3 Reliability

* NFR-007: The platform shall support backup, restore, retry queues, duplicate prevention, disaster recovery, and idempotent financial transactions.
* NFR-008: Schema migrations shall be versioned, repeatable, and tested.

## 14.4 Performance

* NFR-009: Common screens shall load within three seconds under normal conditions.
* NFR-010: Large reports shall be paginated, filtered, or processed asynchronously.
* NFR-011: The platform shall handle large animal, flock, inventory, activity, and financial datasets.

## 14.5 Usability

* NFR-012: User-facing text shall use plain English.
* NFR-013: Mobile data entry shall prioritize short forms, saved previous values, date pickers, dropdowns, and large touch targets.
* NFR-014: Required fields shall be limited to the minimum needed to preserve useful records.
* NFR-015: The product shall support low-cost Android devices and poor connectivity.

---

# 15. Migration And Backward Compatibility

The platform pivot must preserve current local users where feasible.

Functional requirements:

* FR-054: Introduce a versioned migration framework before replacing or splitting the current SQLite schema.
* FR-055: Map current `user_profiles` to a future local owner profile or organisation bootstrap flow.
* FR-056: Map current `fields` to production units of type `Field`.
* FR-057: Map current `crop_cycles` to production cycles linked to crop enterprises.
* FR-058: Preserve current generic records as legacy records even when structured records are introduced.
* FR-059: Migrate structured fields only where values can be safely inferred; otherwise leave fields blank or marked unknown.
* FR-060: Preserve soft-archived records.
* FR-061: Preserve report totals or explicitly explain any recalculation rule changes.
* FR-062: Provide manual export or backup before major local-to-cloud migration.

Backward-compatibility risks:

* Current IDs are local timestamp/random strings and may conflict with future server IDs.
* Current records duplicate display names and lack enforced foreign keys.
* Current `amount` semantics are ambiguous across record types.
* Current photos store local URI references that may not survive cloud migration.
* Current reports may change when structured financial rules replace generic type rules.

---

# 16. Delivery Sequence

## Phase 1 - Stabilize The Existing Wedge

Goal: make the current crop app safe to evolve.

Requirements:

* Add versioned local migrations.
* Add automated tests for repository and report calculations.
* Separate large `App.tsx` responsibilities into screens, forms, reports, services, and domain helpers.
* Add structured crop input, labour, expense, harvest, sale, and payment fields.
* Add crop-cycle completion/history.

## Phase 2 - Introduce Platform Foundation

Goal: create the shared model needed by the original PRD.

Requirements:

* Add Organisation, Farm, Enterprise, ProductionUnit, ProductionCycle, ProductionSubject, Input, Output, Supplier, Customer, AuditLog concepts.
* Decide backend and sync architecture.
* Add authentication, membership, tenant isolation, and roles.
* Define API contracts.
* Define local-to-cloud migration path.

## Phase 3 - Inventory And Financial Integrity

Goal: make cost and revenue tracking reliable.

Requirements:

* Add inventory products, stock receipts, stock issues, transfers, adjustments, batch numbers, expiry dates, and stock valuation.
* Add supplier records and purchase records.
* Add customer records, sales, payments, balances, and invoices or invoice-ready records.
* Add expense allocation and profitability reports by farm, enterprise, unit, and cycle.

## Phase 4 - Expand Enterprise Modules

Goal: deliver original PRD enterprise coverage.

Requirements:

* Add livestock registry, health, breeding, movement, mortality, sales.
* Add poultry flock management.
* Add aquaculture pond/cage/batch management.
* Add dairy, pig, goat, sheep, beekeeping, and configurable enterprise modules as prioritized.

## Phase 5 - Integrations And Advanced Operations

Goal: connect Masona Farms to the broader agricultural business ecosystem.

Requirements:

* Integrate with Outgrower OS only through the boundary defined in the original PRD.
* Evaluate mobile money, accounting, weather, SMS, mapping, digital scales, IoT, milk meters, feed systems, and buyer platforms.
* Add advanced dashboards, forecasting, audit exports, and enterprise benchmarking.

---

# 17. Acceptance Criteria For Platform Readiness

Masona Farms shall be considered aligned with the original PRD when:

1. An organisation can manage multiple farms.
2. A farm can operate multiple enterprises.
3. Enterprises contain production units, production subjects, and production cycles.
4. Crop, livestock, poultry, and aquaculture workflows are supported by structured records, not generic notes only.
5. Inputs, feed, medicines, labour, equipment, inventory, expenses, outputs, sales, and payments are linked to production.
6. Expenses and revenue can be allocated to farm, enterprise, unit, and cycle.
7. Profitability can be calculated by farm, enterprise, production unit, and production cycle.
8. Users have authenticated access and role-based permissions.
9. Actions affecting inventory, health, finance, sales, and permissions are audited.
10. Selected mobile workflows work offline and sync safely.
11. Existing local crop records are preserved or intentionally migrated.
12. Reports use plain labels such as total spent, total earned, net profit, labour cost, harvest quantity, and sales income.

---

# 18. Open Decisions

These decisions block clean architecture and story creation:

* OD-001: Is Masona Farms cloud-backed, local-first with sync, or local-only plus export?
* OD-002: What backend stack owns identity, tenancy, sync, and APIs?
* OD-003: Which enterprise module follows crops first: poultry, livestock, aquaculture, or inventory?
* OD-004: Should generic records remain as a universal activity log beside structured module records?
* OD-005: How much of the current local data must migrate into the future platform?
* OD-006: What is the minimum viable role model for the first multi-user release?
* OD-007: Which financial reports must be accounting-grade versus operational estimates?

---

# 19. Scope Challenge Register

The following original PRD requirements are valid goals but unsafe to implement directly on the current architecture:

* Multi-organisation tenancy without backend identity.
* Configurable permissions without authorization enforcement.
* Inventory stock valuation without structured stock movement records.
* Profitability by animal, bird, pond, kilogram, litre, enterprise, and cycle without structured cost/revenue allocation.
* Sync conflict handling without a sync architecture.
* Audit trails without authenticated actors.
* Outgrower OS integration before Masona Farms has stable platform APIs.
* Large enterprise datasets while all logic remains in a single `App.tsx` file.

These are not reasons to remove the requirements. They are reasons to sequence the platform foundation first.

---

# 20. Product Principle

Masona Farms manages everything required to operate, measure, and improve production within a farm business.

It must support specialised farms and mixed farms without forcing livestock, poultry, aquaculture, or other enterprises into crop-based workflows.

The current crop app is the starting wedge. The normalized PRD goal is the platform described in `prd-original.md`, delivered through a deliberate migration from today’s codebase.
