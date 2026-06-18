---
name: Masona Farms
status: final
sources:
  - ../../prd.md
  - ../../../../docs/index.md
  - ../../../../docs/project-overview.md
  - ../../../../docs/architecture.md
  - ../../../../docs/component-inventory.md
  - ../../../../docs/data-models.md
  - ../../../../docs/technical-debt-and-prd-conflicts.md
  - ../../../../App.tsx
updated: 2026-06-17
---

# Masona Farms - Experience Spine

`DESIGN.md` is the visual identity reference. This spine owns screens, behavior, states, interactions, accessibility, and the staged UX path from the current offline crop app to the approved Masona Farms platform requirements. Spines win on conflict with future mockups or generated screens.

## Foundation

Single-surface mobile app, optimized for low-cost Android devices and poor connectivity. Expo React Native is the current implementation baseline. No third-party navigation system is currently present; the app uses local state and a custom bottom tab bar.

The existing UX should be treated as a working seed, not discarded. Preserve these useful patterns:

| Existing pattern | Preserve because |
|---|---|
| Farm header with location and offline state | Farmers always need to know which farm they are recording against and whether data is local |
| Bottom tabs | Fast, understandable navigation for mobile users |
| Floating add record action | Supports quick field entry |
| Bottom sheet forms | Good mobile pattern for short, focused entry |
| Type chips and status chips | Reduce typing and work well on touch screens |
| Calendar month view and backfill chips | Supports late entry of work done in the field |
| Expandable record rows | Keeps lists scannable while preserving detail |
| Photo and receipt linking | Helps diagnose problems and support costs |
| PDF/CSV/share exports | Important where cloud sync or office systems are not yet available |
| Plain-English metrics | Matches the product goal of making farming measurable |

Primary UX risk: the current generic record form is fast, but too weak for supplier history, dosage, safety, buyer, payment, labour, and profit questions. The future UX must keep quick capture while introducing structured detail at the right moments.

## Information Architecture

### Current Screen Classification

| Current surface | Future treatment | Notes |
|---|---|---|
| Home | Extend | Keep dashboard, insights, quick actions, reminders, recent records. Add scoped alerts and incomplete-data nudges. |
| Fields | Redesign into Production | Current fields and crop cycles become production units and production cycles. Preserve field rows and progress. |
| Records | Redesign into Work Log | Replace generic-only list with filtered structured records across work, inputs, labour, harvest, sales, and payments. |
| Calendar | Extend | Keep month view, date jump, selected-day list, upcoming work, and backfill chips. Add schedule and cycle filters. |
| Reports | Redesign progressively | Keep simple cards and export. Add scoped reports by crop cycle, field/unit, farm, enterprise, supplier, labour, harvest, and sales. |
| More | Extend into Manage | Current placeholder rows become real management surfaces for inventory, suppliers, buyers, workers, sync, profile, and settings. |
| Field detail modal | Extend into Unit/Cycle detail | Keep summary, records, photos, spent, earned. Add cycle history and close-cycle flow. |
| Add record modal | Redesign | Type-specific entry sheets with minimum required fields and optional detail groups. |
| Photo form | Extend | Keep category and linking. Add receipt-first linking from expenses and input purchases. |
| Profile setup | Redesign for platform phases | Local profile remains for v1. Later onboarding creates organisation, farm, and first enterprise. |

### Target Mobile IA

| Surface | Reached from | Purpose |
|---|---|---|
| Home | App open / bottom tab | Farm snapshot, urgent work, quick entry, recent activity |
| Production | Bottom tab | Farms, enterprises, production units, active cycles, cycle history |
| Work Log | Bottom tab / add action / calendar | All records with type-specific details and filters |
| Calendar | Bottom tab | Planned work, backfill, withholding checks, reminders |
| Reports | Bottom tab | Money, production, labour, input, supplier, harvest, and sales summaries |
| Manage | Bottom tab | Inventory, suppliers, buyers, workers, photos, sync, profile, settings |
| Add Entry | Floating add action | Choose record type and save quickly |
| Farm Switcher | Header farm name | Change farm or add farm when platform supports multiple farms |
| Production Unit Detail | Production row | Field/house/pond/apiary details, current cycle, history, records, photos, money |
| Production Cycle Detail | Cycle row/detail | Cycle timeline, costs, outputs, sales, close/cancel/archive |
| Inventory | Manage | Products, stock, receipts, issues, adjustments, reorder warnings |
| Suppliers | Manage / input forms | Shops, contacts, purchases, prices, receipts |
| Buyers | Manage / sale forms | Buyers, sales, payment status, money owed |
| Workers & Teams | Manage / labour forms | Worker/team list, task history, amount paid |
| Sync Review | Header badge / Manage | Waiting changes, failed sync, conflicts, backup/export |
| Roles & Access | Manage | Future organisation membership and permissions |

### Bottom Navigation

Use six tabs while the app remains compact:

| Tab | Label | Replaces / includes |
|---|---|---|
| Home | Home | Current Home |
| Production | Production | Current Fields + active crop cycles |
| Log | Log | Current Records |
| Calendar | Calendar | Current Calendar |
| Reports | Reports | Current Reports |
| Manage | Manage | Current More |

If six tabs become crowded on small Android screens, `Calendar` may move into Home/Production and `Manage` may hold secondary surfaces. Do not hide record entry.

## Voice and Tone

Microcopy should sound like a helpful farm assistant, not an enterprise system.

| Do | Don't |
|---|---|
| "Saved on this phone." | "Local mutation persisted." |
| "Waiting to sync." | "Pending upload queue." |
| "This sale is not paid yet." | "Payment status incomplete." |
| "Add a field first." | "Foreign key required." |
| "Money still owed" | "Accounts receivable" |
| "Cost of fertilizer" | "Aggregated input expenditure" |
| "No supplier saved yet." | "Supplier entity unavailable." |
| "Review before harvest." | "Withholding compliance event." |

Use direct validation copy:

- "Field name and crop are required."
- "Use a date like 2026-06-09."
- "Add the buyer or choose 'Not recorded yet'."
- "This amount will count as money spent."
- "This amount will count as money earned."

## Component Patterns

| Component | Use | Behavioral rules |
|---|---|---|
| Farm header | Global | Shows farm name, location, sync/offline state, notifications. Tap farm name opens Farm Switcher when multi-farm exists. |
| Quick add action | Global | Opens Add Entry. Default choices are Record work, Fertilizer, Chemical, Watering, Labour, Expense, Harvest, Sale, Photo. |
| Add Entry picker | Global | Shows recent/common actions first. If opened from a date or cycle, prefill that context. |
| Bottom sheet form | Entry/edit | One task per sheet. Group fields as Required, Money, Notes, Photos, Follow-up. Save button stays at bottom. |
| Type chip group | Forms | Use when choices are finite and common. Selected state must be obvious and accessible. |
| Saved previous values | Forms | Supplier, buyer, worker/team, product, unit, method, and crop-cycle choices should reuse prior entries. |
| Record row | Work Log/Home/Detail | Collapsed row shows type, unit/cycle, detail, date, amount. Expanded row shows structured fields and links. |
| Record archive action | Record row/detail | Keep soft archive. Confirmation copy: "This keeps the history but hides it from normal lists and reports." |
| Unit row | Production | Shows unit name, enterprise/crop, active cycle, stage, status, and progress where relevant. |
| Cycle row | Production/detail | Shows subject, start date, expected end/harvest, status, and key money/output summary. |
| Metric card | Home/Reports/detail | Label, value, short hint. Must state when value is an estimate or incomplete. |
| Alert/reminder row | Home/Calendar | Tap opens detail. For chemical withholding and overdue work, include why it matters. |
| Photo link | Forms/detail | Photos can be added while saving a record or after. Receipts default to expenses, purchases, sales, and payments. |
| Export action | Reports | Keep Share, PDF, CSV. Future exports should show scope before generating. |

## Structured Entry Patterns

All record forms must keep required fields minimal, but structured fields drive reports and traceability. Use progressive disclosure and saved values.

### Fertilizer

Required: crop cycle, fertilizer name, date applied, quantity used or dosage, amount spent when known.

Optional but encouraged: dosage basis, supplier/shop, purchase price, notes, observed result, receipt photo.

Behavior:

- If supplier is new, allow saving supplier from the same sheet.
- If amount is entered, count it under "Cost of fertilizer".
- Offer "Check result later" follow-up reminder.

### Chemical

Required: crop cycle, chemical name, date applied, dosage, target problem.

Optional but encouraged: quantity used, supplier/shop, purchase price, safety notes, withholding notes, observed result, receipt/photo.

Behavior:

- Show a safety section by default, not hidden behind advanced settings.
- Withholding date must be user-editable; do not hard-code one rule for all chemicals.
- Offer result follow-up and harvest safety reminder.

### Watering

Required: crop cycle, watering date, method.

Optional: daily/scheduled, rainfall notes, skipped watering, irrigation issues.

Behavior:

- Calendar backfill should open Watering with selected date prefilled.
- Repeated watering can offer "Use same method next time".

### Labour

Required: date, task, worker/team or "Not recorded", amount paid when known.

Optional: hours/days, piece-work quantity, crop cycle/unit, notes.

Behavior:

- Amount counts as labour cost.
- Worker/team entries become reusable values.

### Expense

Required: date, expense type/category, amount, scope.

Scope choices: farm, enterprise, production unit, production cycle, general farm operation.

Optional: supplier, receipt photo, notes, recurrence.

Behavior:

- Clarify whether the amount affects a specific cycle's profit or only farm-level cost.

### Harvest

Required: date, production cycle, quantity harvested, unit.

Optional: quality/grade, rejects, storage destination, internal use, notes, photo.

Behavior:

- Harvest quantity does not count as revenue until sold.
- If harvested and sold at once, offer "Record sale too".

### Sale And Payment

Sale required: date, buyer, quantity sold, unit, selling price or total revenue, payment status.

Payment required: buyer or sale, date, amount received, payment method/status.

Behavior:

- Paid, part paid, and unpaid states must be visible on sale rows.
- Outstanding amounts appear as "Money still owed".
- If no buyer is known, allow "Buyer not recorded yet" and surface it as incomplete.

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| First run | Profile/Onboarding | Ask for farmer name, farm name, location. Then route to Add first field/unit. |
| No fields/units | Home/Production | "Add your first field or plot to start tracking work, costs, harvests, and sales." |
| No active cycle | Production | Show unit history and primary action "Start a new cycle". |
| No records | Work Log | Show common entry actions instead of an empty blank list. |
| Offline local-only | Header | "Offline" and "Saved on this phone" after saves. |
| Waiting to sync | Header/Sync Review | "Waiting to sync" with count. Never block entry. |
| Sync conflict | Sync Review | "Needs review" with side-by-side plain-English choices. Do not auto-overwrite financial, inventory, health, or safety records. |
| Incomplete structured record | Record row/detail | Show "Missing buyer", "No supplier", or "No payment status" as a small attention chip. |
| Report estimate | Reports | Label the report as "Estimate" and explain missing data in one sentence. |
| Permission denied | Future platform | Hide unavailable actions where possible. If reached by link, say "You do not have access to this farm record." |
| Archive/delete | Records | Soft archive by default. Avoid permanent delete for production and finance records. |
| Export/share | Reports | Show scope, date range, and included data before export when platform reports become larger. |

## Interaction Primitives

- Tap rows to open detail or expand.
- Tap chips to select finite choices.
- Use bottom sheets for add/edit flows.
- Use one modal or sheet level at a time.
- Keep back/cancel safe: unsaved form changes should prompt before closing once meaningful data is entered.
- Date entry should use date pickers where available, with manual `YYYY-MM-DD` fallback.
- Numeric money fields should open numeric keyboards and format after blur.
- Use saved previous values for supplier, buyer, worker, product, unit, method, and cycle to reduce typing.
- Calendar backfill should always prefill selected date.
- Long-press is reserved for platform text selection and future row shortcuts, not required core behavior.
- Pull-to-refresh is only useful after sync exists; local-only screens should not imply cloud refresh.

Banned in core farm-entry flows:

- Required multi-step wizards for simple records.
- Hidden required fields below long optional sections.
- Hover-only affordances.
- Decorative animations before a farmer can save.
- Technical sync or schema vocabulary in user-facing text.

## Accessibility Floor

Behavioral accessibility. Visual contrast and tokens live in `DESIGN.md`.

- Touch targets: at least 48dp on Android and 44pt on iOS.
- Every icon-only action has an accessible label.
- Bottom tabs expose selected state.
- Form fields have persistent labels, not placeholder-only labels.
- Error messages identify the field and the fix.
- Record amounts, dates, and statuses must be screen-reader readable in a logical order.
- The calendar must not rely on dots alone; selected-day list is the accessible source of event detail.
- Dynamic text must not truncate critical labels such as record type, amount, payment status, or safety warning.
- Reduce Motion disables nonessential fade/slide list animations.
- Color is never the only signal for safety, paid/unpaid, sync, or status.

## Responsive & Platform

Primary target: mobile portrait, low-cost Android. iOS parity should follow platform conventions but does not drive the initial interaction model.

| Context | Behavior |
|---|---|
| Small Android phones | Single-column, compact cards, no horizontal dependence except short chip strips that can scroll |
| Larger phones | Same IA, more breathing room, no tablet-only complexity |
| Tablets/foldables | Optional two-pane detail for Production and Reports, but not required for v1 |
| Offline | All add/edit flows for core records remain available |
| Poor connectivity | Saving stays local and sync retries quietly with clear review states |

## Screen Specifications

### Home - Extend

Purpose: daily farm snapshot and fastest route to entry.

Keep:

- Metric strip.
- Farm Insights.
- Active fields/cycles preview.
- Urgent reminders.
- Quick actions.
- Recent records.

Add:

- "Needs review" group for incomplete records, unpaid sales, sync conflicts, and safety follow-ups.
- Scoped quick actions based on recent work.
- Clear saved/sync feedback after adding a record.

### Production - Redesign From Fields

Purpose: where production happens and what cycle is active.

Structure:

- Farm/enterprise filter when platform entities exist.
- Production units list: fields first, later houses, ponds, pens, apiaries.
- Active cycles list.
- Cycle history.

Behavior:

- Current fields migrate into production units of type Field.
- Current crop cycles migrate into production cycles.
- Tapping a unit opens Unit Detail.
- Tapping a cycle opens Cycle Detail.
- Add unit and Start cycle are separate actions once the platform model exists.

### Unit Detail - Extend From Field Detail

Purpose: one place to understand a field/house/pond/apiary across cycles.

Keep:

- Summary facts.
- Spent and earned.
- Recent records.
- Photos.

Add:

- Current cycle card.
- Past cycles.
- Linked inventory issues.
- Labour and supplier summaries.
- Close/cancel/archive cycle actions.

### Work Log - Redesign From Records

Purpose: retrieve every farm record and add structured detail where needed.

Structure:

- Search.
- Filters by type, farm, enterprise, unit, cycle, date, money effect, incomplete.
- List rows grouped by recent date by default.

Behavior:

- Generic legacy records remain visible.
- Structured records show their key fields in expanded detail.
- Users can archive, edit, attach photo, or add follow-up.

### Calendar - Extend

Purpose: plan and backfill farm work.

Keep:

- Date jump.
- Month grid.
- Selected-day list.
- Upcoming work.
- Backfill chips.

Add:

- Filters by cycle/unit.
- Watering schedule view.
- Withholding/safety reminders with editable due dates.
- Overdue and skipped work states.

### Reports - Redesign Progressively

Purpose: answer practical business questions with the best available data.

Top-level report cards:

- Total spent.
- Total earned.
- Net profit.
- Cost of fertilizer.
- Cost of chemicals.
- Labour cost.
- Harvest quantity.
- Sales income.
- Money still owed.

Report scopes:

- Farm.
- Enterprise.
- Production unit.
- Production cycle.
- Supplier.
- Worker/team.
- Buyer/customer.
- Date range.

Behavior:

- If data is generic or incomplete, show "Estimate" and what is missing.
- Keep PDF/CSV/share, but require scope confirmation when reports become multi-farm.
- Do not show cost per plant until plant population exists.

### Manage - Extend From More

Purpose: durable farm setup and reusable lists.

Sections:

- Farm profile.
- Inventory.
- Suppliers.
- Buyers.
- Workers and teams.
- Photo records.
- Offline sync and backup.
- Settings.
- Roles and access when platform identity exists.

Behavior:

- Current placeholder rows become real surfaces.
- Recent photos remain available here and on linked record/unit details.

### Add Entry - Redesign

Purpose: fastest path to capture useful data.

Behavior:

- Opens from FAB, quick actions, calendar, unit detail, or cycle detail.
- Context pre-fills date, cycle, unit, and type when known.
- Shows common/recent entry types first.
- Type-specific forms replace one generic form.
- Legacy "General note" remains available for unusual cases, but must not replace structured financial/input records.

## Key Flows

### Flow 1 - Start a chilli field (Mason, Chisamba, first week of planting)

1. Mason opens Masona Farms after setup.
2. Home shows no fields and a primary action to add the first field.
3. He taps Add field.
4. The sheet asks for field name, crop, variety, area, planting date, expected harvest, stage, and status.
5. ABE Chilli defaults help him move quickly, but he can choose another crop.
6. He saves.
7. **Climax:** Production shows the new field and active crop cycle, while Home now has an active field card and calendar guidance.

Failure: date format is wrong. The sheet stays open and says, "Use a date like 2026-06-09."

### Flow 2 - Record fertilizer and keep the cost useful (Mason, midday in the field)

1. Mason taps the floating add action.
2. He chooses Fertilizer.
3. The sheet preselects the most recent crop cycle.
4. He enters fertilizer name, date, dosage or quantity, supplier, and amount spent.
5. He attaches a receipt photo or skips it.
6. He saves offline.
7. **Climax:** The record appears in Work Log, the cycle detail shows fertilizer cost, and Reports updates "Cost of fertilizer" and "Total spent."

Failure: no supplier is entered. The record still saves, but detail shows "No supplier" as an attention chip so he can complete it later.

### Flow 3 - Spray chemical and protect harvest timing (Mason, after seeing pests)

1. Mason opens Add Entry from a crop cycle.
2. He chooses Chemical.
3. The form asks for chemical name, target problem, dosage, date, and safety/withholding notes.
4. Mason sets a withholding date based on the label.
5. He saves.
6. **Climax:** Calendar shows a follow-up check and a harvest safety reminder, both linked to the chemical record.

Failure: he does not know withholding notes. He can save with "Not recorded yet", and the record appears under Needs review.

### Flow 4 - Record sale and track unpaid money (Mason, at market)

1. Mason taps Add Entry and chooses Sale.
2. He selects the crop cycle, buyer, quantity sold, selling price, and payment status.
3. He marks the sale as part paid.
4. The app asks for amount received and saves the unpaid balance.
5. **Climax:** Reports shows Sales income, Money still owed, and Net profit without treating unpaid money as fully received unless the finance rule allows it.

Failure: buyer is not known. Mason chooses "Buyer not recorded yet"; the sale saves and appears in Needs review.

### Flow 5 - Review profit for a crop cycle (Mason, after harvest)

1. Mason opens Reports.
2. He changes scope from Farm to a specific crop cycle.
3. The report shows Total spent, Total earned, Net profit, fertilizer cost, chemicals cost, labour cost, harvest quantity, and sales income.
4. Missing supplier or payment data appears as a short note.
5. Mason exports PDF.
6. **Climax:** He can explain whether the crop made money using a report tied to real records, not memory.

Failure: some records are legacy generic records. The report says "Estimate" and lists the missing structured data.

### Flow 6 - Resolve a future sync conflict (Chipo, farm manager, shared farm release)

1. Chipo opens Masona Farms after being offline.
2. The header shows "Needs review".
3. Sync Review lists one fertilizer purchase changed on two phones.
4. The app shows plain choices: keep this phone's amount, use synced amount, or keep both as separate purchases.
5. Chipo chooses keep both because two receipts exist.
6. **Climax:** The conflict leaves Needs review, both purchases remain traceable, and reports recalculate without losing local work.

Failure: Chipo lacks permission for finance changes. The app says, "You can view this record, but you need a manager to change the amount."

## Offline, Sync, And Migration UX

Current app is local-only. Do not pretend this is cloud sync.

V1 local-only language:

- "Saved on this phone."
- "Offline."
- "Export a backup before changing phones."

Future sync language:

- "Waiting to sync."
- "Synced."
- "Needs review."
- "Could not sync. Your record is still on this phone."

Migration UX requirements:

- Before local-to-cloud migration, offer backup/export.
- Explain that old records are preserved as history.
- Mark migrated generic records as "Legacy record" when structured fields cannot be safely inferred.
- Do not recalculate reports silently when finance rules change. Show "Report rules changed" with a short explanation.

## Product-Specific Constraints

- Design around production cycles, not only fields.
- Records should attach to the most precise useful scope: cycle first, then unit, enterprise, farm, or general operation.
- Crop-specific guidance must not hard-code the core product to chilli.
- Every money record should clearly say whether it counts as spent, earned, owed, or ignored for profit.
- Important production and financial records are archived, not permanently deleted, unless future admin policy explicitly allows deletion.
- Reports should be useful with imperfect data, but honest about missing structure.

## Open Questions

- Which module should receive full UX detail next: inventory, poultry, livestock, aquaculture, or multi-user roles?
- Will the first platform release include cloud sync, or should the UX continue to optimize for local-only with export/backup?
- Which reports must be accounting-grade at launch?
- What minimum permissions are needed for the first shared-farm release?

## Handoff Notes

- No UI implementation has been performed.
- No key-screen mockups were generated for this run.
- Build future implementation stories from the screen classification above: extend existing screens first where the current interaction pattern is sound, redesign Work Log/Add Entry/Reports where structured data is required, and add Manage surfaces as the underlying models become available.
