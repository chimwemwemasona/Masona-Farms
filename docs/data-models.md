# Data Models And Local Database

Generated: 2026-06-17

## Persistence Overview

The app stores all farm data locally in SQLite through `expo-sqlite`. The database name is `masona-farms.db`. Schema creation happens in `initializeDatabase()` in `src/data/farmRepository.ts`.

There is no remote database, ORM, migration folder, or schema version table. Schema evolution is handled by creating tables if missing and adding missing columns with `ensureColumn()`.

## Tables

### `app_meta`

Tracks local setup metadata.

| Column | Type | Notes |
| --- | --- | --- |
| `key` | `TEXT PRIMARY KEY NOT NULL` | Metadata key. |
| `value` | `TEXT NOT NULL` | Metadata value. |

Current use: `seeded = true` prevents repeat initialization logic.

### `fields`

Stores current field/plot facts.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `TEXT PRIMARY KEY NOT NULL` | Locally generated ID. |
| `crop` | `TEXT NOT NULL` | Crop name from local library or fallback. |
| `field` | `TEXT NOT NULL` | Field or plot name. |
| `area` | `TEXT NOT NULL` | Free-text area such as `1.0 ha`. |
| `variety` | `TEXT` | Crop variety. |
| `planting_date` | `TEXT` | Date string, expected format `YYYY-MM-DD`. |
| `expected_harvest` | `TEXT` | Date string, expected format `YYYY-MM-DD`. |
| `stage` | `TEXT NOT NULL` | Current crop stage. |
| `progress` | `INTEGER NOT NULL` | Percent progress. |
| `status` | `TEXT NOT NULL` | `Healthy`, `Good`, or `Watch`. |
| `accent` | `TEXT NOT NULL` | UI color. |
| `created_at` | `TEXT NOT NULL` | ISO timestamp. |

### `crop_cycles`

Stores active crop cycles created from fields.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `TEXT PRIMARY KEY NOT NULL` | Locally generated ID. |
| `field_id` | `TEXT NOT NULL` | Field ID, not enforced as a foreign key. |
| `field` | `TEXT NOT NULL` | Duplicated field name for display. |
| `crop` | `TEXT NOT NULL` | Crop name. |
| `variety` | `TEXT NOT NULL` | Variety or `Not set`. |
| `planting_date` | `TEXT NOT NULL` | Date string. |
| `expected_harvest` | `TEXT NOT NULL` | Date string. |
| `stage` | `TEXT NOT NULL` | Current stage. |
| `status` | `TEXT NOT NULL` | Currently active cycles are returned. |
| `created_at` | `TEXT NOT NULL` | ISO timestamp. |

Only active crop cycles are returned by `getCropCycles()`. There is no implemented flow to complete a crop cycle and preserve inactive cycle views.

### `records`

Stores generic farm records for activities, costs, harvests, sales, payments, and problems.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `TEXT PRIMARY KEY NOT NULL` | Locally generated ID. |
| `type` | `TEXT NOT NULL` | Flexible type label, for example `Fertilizer`, `Chemical`, `Sale`. |
| `field` | `TEXT NOT NULL` | Field name. |
| `crop_cycle_id` | `TEXT` | Linked crop cycle ID. |
| `crop_cycle_name` | `TEXT` | Display label such as `ABE Chilli - Field 1`. |
| `detail` | `TEXT NOT NULL` | Free-text description. |
| `quantity` | `TEXT` | Free-text quantity or dosage. |
| `date` | `TEXT NOT NULL` | Date string. |
| `amount` | `REAL NOT NULL` | Cost or revenue amount. |
| `icon` | `TEXT NOT NULL` | UI icon name. |
| `tone` | `TEXT NOT NULL` | UI color tone. |
| `deleted_at` | `TEXT` | Soft archive marker. |
| `created_at` | `TEXT NOT NULL` | ISO timestamp. |

Financial reporting treats `Sale` as revenue, ignores `Harvest`, and treats all other record types as expenses.

### `photos`

Stores photo references, not image binaries.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `TEXT PRIMARY KEY NOT NULL` | Locally generated ID. |
| `field` | `TEXT NOT NULL` | Field name. |
| `category` | `TEXT` | `Progress`, `Problem`, `Receipt`, or `General`. |
| `record_id` | `TEXT` | Optional linked record ID. |
| `record_label` | `TEXT` | Optional display label. |
| `uri` | `TEXT NOT NULL` | Local image URI from image picker. |
| `caption` | `TEXT NOT NULL` | User caption. |
| `created_at` | `TEXT NOT NULL` | ISO timestamp. |

### `reminders`

Stores local reminder display data and notification IDs.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `TEXT PRIMARY KEY NOT NULL` | Locally generated ID. |
| `title` | `TEXT NOT NULL` | Reminder title. |
| `detail` | `TEXT NOT NULL` | Reminder detail. |
| `field` | `TEXT NOT NULL` | Field or crop-cycle display name. |
| `due_at` | `TEXT NOT NULL` | ISO timestamp. |
| `tone` | `TEXT NOT NULL` | `red` or `amber`. |
| `icon` | `TEXT NOT NULL` | `sprinkler`, `calendar`, or `water`. |
| `notification_id` | `TEXT` | Expo local notification ID. |
| `created_at` | `TEXT NOT NULL` | ISO timestamp. |

### `user_profiles`

Stores one local farmer profile.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `TEXT PRIMARY KEY NOT NULL` | Current value is `local-profile`. |
| `farmer_name` | `TEXT NOT NULL` | Farmer name. |
| `farm_name` | `TEXT NOT NULL` | Farm name. |
| `location` | `TEXT NOT NULL` | Location text. |
| `created_at` | `TEXT NOT NULL` | ISO timestamp. |
| `onboarding_completed` | `INTEGER NOT NULL` | Boolean stored as `1` or `0`. |

## Relationships

Relationships are logical rather than database-enforced:

- `crop_cycles.field_id` refers to `fields.id`.
- `records.crop_cycle_id` refers to `crop_cycles.id`.
- `photos.record_id` can refer to `records.id`.
- Many display fields duplicate field/crop-cycle text to simplify local rendering.

No foreign keys are declared.

## Migration Strategy

Implemented migration behavior:

- `CREATE TABLE IF NOT EXISTS` for base tables.
- `ensureColumn()` checks `PRAGMA table_info(table)` and runs `ALTER TABLE ... ADD COLUMN` when needed.
- Existing fields can be backfilled into crop cycles.
- Existing records can be linked to active crop cycles by field-name matching.

Limitations:

- No schema version number.
- No rollback path.
- No migration history.
- `ensureColumn()` builds SQL from table/column strings and is safe only because callers are hard-coded.
- Data type changes, table splits, and data transformations would need manual code.

## PRD Data Model Gaps

The current generic record model does not separately store several PRD fields:

- Supplier/shop name for fertilizer and chemical purchases.
- Purchase source separate from detail text.
- Purchase price separate from amount semantics.
- Dosage per plant vs dosage per area.
- Target pest/disease/condition.
- Safety notes and withholding notes as structured fields.
- Observed results after application as structured follow-up records.
- Worker/team name separate from task detail.
- Buyer, selling price, quantity harvested, quantity sold, total revenue, and payment status as separate fields.
- Farm-level vs field-level vs crop-cycle-level expense allocation beyond the current crop-cycle link.

