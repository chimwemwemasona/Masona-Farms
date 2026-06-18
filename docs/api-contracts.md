# API Contracts And Integrations

Generated: 2026-06-17

## Server API Status

No server API is implemented in this repository.

There are no REST routes, GraphQL schemas, controllers, handlers, cloud functions, API clients, OpenAPI files, or Swagger files. The app does not send farm data over the network.

## Local Repository API

The closest equivalent to an API contract is the local repository module in `src/data/farmRepository.ts`.

| Function | Purpose |
| --- | --- |
| `initializeDatabase()` | Creates local SQLite schema and applies column additions. |
| `getFields()` | Reads current fields ordered by newest first. |
| `getCropCycles()` | Reads active crop cycles. |
| `getRecords()` | Reads non-archived records. |
| `getPhotos()` | Reads photo references ordered newest first. |
| `getReminders()` | Reads reminders ordered by due date. |
| `getUserProfile()` | Reads the local profile. |
| `saveUserProfile(input)` | Inserts or updates the local profile. |
| `resetFarmData()` | Deletes fields, records, photos, reminders, and crop cycles. |
| `addField(input)` | Inserts a field and active crop cycle. |
| `updateField(fieldId, input)` | Updates field and active crop-cycle display data. |
| `addRecord(input)` | Inserts a generic farm record. |
| `deleteRecord(recordId)` | Soft archives a record by setting `deleted_at`. |
| `addPhoto(input)` | Inserts a photo reference. |
| `addReminder(input)` | Inserts a reminder record. |

## Device Integrations

| Integration | Code location | Behavior |
| --- | --- | --- |
| SQLite | `src/data/farmRepository.ts` | Local database storage. |
| Notifications | `src/services/notifications.ts` | Requests permissions, creates Android channel, schedules date-based reminders. |
| Image picker | `App.tsx` | Requests media permissions and stores selected image URI. |
| Native share | `App.tsx` | Shares text reports or CSV content. |
| PDF export | `App.tsx` | Builds HTML and creates a local PDF file with Expo Print. |
| CSV export | `App.tsx` | Writes CSV to cache and shares it. |

## Authentication Requirements

No endpoint or integration currently requires authentication. No tokens, sessions, credentials, or role claims are produced or consumed.

## Future API Implications

If the new PRD requires cloud sync, multi-user access, or farmer data isolation, a future backend should define contracts for at least:

- Farmer account and farm membership.
- Farm, field, and crop-cycle CRUD.
- Farm record CRUD with soft deletes and audit metadata.
- Supplier and inventory management.
- Revenue, buyer, and payment tracking.
- Report generation and exports.
- Sync conflict resolution.
- Media upload and receipt/photo linking.

