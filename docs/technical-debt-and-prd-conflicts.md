# Technical Debt And PRD Conflicts

Generated: 2026-06-17

## Highest-Impact Technical Debt

1. `App.tsx` is doing too much.
   It contains navigation, state orchestration, screens, forms, reporting, validation, exports, helpers, and styles. This will slow down future work and make testing hard.

2. The record model is too generic for the full PRD.
   A single `detail`, `quantity`, and `amount` field supports fast entry, but it cannot accurately answer supplier, dosage, target pest, buyer, selling price, payment status, or observed-result questions without parsing text.

3. Database migrations are informal.
   `ensureColumn()` handles additive columns, but there is no schema version, migration table, migration history, rollback path, or repeatable data migration process.

4. No automated tests exist.
   The only automated verification script is TypeScript type checking.

5. No authentication or tenant boundary exists.
   The app stores one local profile and has no user identity, sessions, tokens, roles, or authorization checks.

6. No sync or backup strategy exists.
   The app is offline-first but device-local. Losing the device or app data loses the farm history unless the user exports manually.

7. Reports depend on broad type rules.
   Sales are revenue, harvest is ignored, and every other non-sale amount is treated as expense. Payment, restocking, and problem records may distort financial summaries if amounts are entered inconsistently.

## Conflicts With The New PRD

### Farms And Fields

PRD expects farm, field, crop-cycle, plant population, current crop stage, and expected harvest window. Current implementation supports profile farm name, fields, crop cycles, field area, crop, variety, planting date, expected harvest date, stage, status, and progress.

Conflict/gap:

- No plant population field.
- No separate farm table.
- Crop cycle completion/history exists only partially; active cycles are returned, and there is no UI for completed crop cycles.

### Fertilizer Records

PRD expects fertilizer name, date, dosage per plant or area, quantity used, purchase source/shop, purchase price, notes, and observed results.

Current implementation stores fertilizer as a generic record type with `detail`, `quantity`, `date`, and `amount`.

Conflict/gap:

- No structured fertilizer name.
- No structured dosage unit or basis.
- No supplier/shop field.
- No observed-result follow-up field.
- No distinction between purchase price and application cost.

### Chemical Records

PRD expects chemical name, date, dosage, target pest/disease/condition, quantity, source/shop, purchase price, safety/withholding notes, and observed results.

Current implementation stores chemical as a generic record and creates follow-up and withholding reminders.

Conflict/gap:

- Withholding reminder exists, but withholding period is hard-coded around 7 days from application in calendar/reminder behavior.
- No structured target pest/disease.
- No structured safety notes.
- No supplier/shop field.
- No observed-result field.

### Watering Records

PRD expects watering date, method, daily or scheduled flag, rainfall/irrigation issue notes, and skipped watering notes.

Current implementation stores irrigation as a generic record.

Conflict/gap:

- No daily/scheduled flag.
- No rainfall or skipped-watering fields.
- No recurring watering schedule.

### Labour Records

PRD expects date, worker/team name, task, crop cycle, amount paid, and notes.

Current implementation stores labor as a generic record.

Conflict/gap:

- No worker/team field.
- Task and notes are folded into `detail`.

### Expense Records

PRD expects all expenses linked to farm, field, crop cycle, or general farm operation.

Current implementation links records to crop cycles and fields, but there is no general farm operation model.

Conflict/gap:

- No explicit expense categories except record type/detail.
- No structured operation-level expense.
- No supplier/inventory linkage.

### Revenue Records

PRD expects harvest date, quantity harvested, quantity sold, buyer, selling price, total revenue, payment status, and notes.

Current implementation supports `Harvest`, `Sale`, and `Payment` record types generically.

Conflict/gap:

- No buyer field.
- No selling price field.
- No quantity sold vs quantity harvested distinction beyond text.
- No payment status field.
- Outstanding buyer payments are listed as incomplete in README.

### Reports And Analytics

PRD expects total expenses/revenue/net profit per crop cycle, cost per field, cost per plant, input usage history, supplier history, labour cost summary, and harvest/sales summary.

Current implementation provides global totals, cost per field, cost per hectare, best crop, share/PDF/CSV exports, and benchmark insights.

Conflict/gap:

- Reports are not explicitly per crop cycle.
- No cost per plant because plant population is not stored.
- No supplier/shop history.
- Limited input usage history because inputs are generic records.
- Labour and harvest summaries are not structured views.

### Offline And Connectivity

PRD asks not to lose locally entered records and to make sync conflicts clear and safe.

Current implementation supports local offline entry but has no sync, conflict resolution, backup, or restore.

Conflict/gap:

- Offline works locally, but resilience depends on device storage.
- No queue for sync.
- No conflict model.

### Security And Privacy

PRD requires private farm financial data, no cross-user data exposure, proper authentication and authorization, and careful exports.

Current implementation has no backend and no multi-user access, so cross-user exposure through the app is not currently possible. However, there is also no authentication, device-level encryption strategy, role model, or export access control.

Conflict/gap:

- No login.
- No authorization.
- No role-based permissions.
- No server-side privacy boundary.
- Exports can be shared through the device share sheet without app-level controls.

## Recommended Refactoring Direction

1. Split `App.tsx` into `src/screens`, `src/components`, `src/forms`, `src/reports`, and `src/utils`.
2. Introduce typed domain services for fields, crop cycles, records, reports, and reminders.
3. Add versioned SQLite migrations before further schema expansion.
4. Add dedicated tables or structured columns for suppliers, inventory, fertilizer applications, chemical applications, labor, harvests, sales, and payments.
5. Add tests around repository logic and report calculations before changing finance behavior.
6. Decide whether Masona Farms remains local-only or becomes cloud-backed. Authentication, authorization, multi-user roles, and sync depend on that decision.

