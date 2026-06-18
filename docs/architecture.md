# Architecture

Generated: 2026-06-17

## Architecture Summary

Masona Farms is a single-device Expo React Native application. The architecture is local-first and app-contained:

- UI and orchestration live mostly in `App.tsx`.
- Persistence is centralized in `src/data/farmRepository.ts`.
- Domain shapes are declared in `src/data/types.ts`.
- Crop guidance and calendar rules live in `src/data/cropLibrary.ts` and `src/data/cropPractices.ts`.
- Notifications are isolated in `src/services/notifications.ts`.
- Design tokens are in `src/theme.ts`.

There is no backend layer, API client layer, server-side domain model, or shared package boundary.

## Application Flow

1. `App.tsx` exports the default `App` component wrapped in `SafeAreaProvider`.
2. `MasonaApp` initializes local SQLite with `initializeDatabase()`.
3. The app reads profile, fields, crop cycles, records, photos, and reminders from the repository.
4. User actions call repository functions such as `addField`, `updateField`, `addRecord`, `addPhoto`, `addReminder`, and `deleteRecord`.
5. After writes, `refreshFarmData()` reloads data from SQLite into React state.
6. Derived values such as dashboard metrics, calendar events, and practice insights are calculated in memory with `useMemo`.

## Frontend Architecture

The frontend is component-based but not file-modular. `App.tsx` contains the app shell, screens, modals, UI rows, report builders, helper functions, and styles. This makes discovery easy in a small app but creates a large single-file maintenance burden.

Important UI components in `App.tsx`:

- `MasonaApp`
- `HomeScreen`
- `FieldsScreen`
- `RecordsScreen`
- `CalendarScreen`
- `ReportsScreen`
- `MoreScreen`
- `FieldFormModal`
- `RecordFormModal`
- `PhotoFormModal`
- `ProfileSetupModal`
- `FieldDetailModal`
- `RecordRow`, `FieldRow`, `ReminderRow`, `InsightRow`, `CalendarEventRow`

## Backend Architecture

No backend is implemented. There are no server files, routes, controllers, cloud functions, API handlers, or API client modules. The app has no remote persistence or server-side enforcement of privacy rules.

## State Management

State is managed with React hooks inside `MasonaApp`:

- `useState` stores active tab, lists, modal state, selected field, edit state, filters, and profile state.
- `useEffect` initializes the database and loads local data.
- `useMemo` derives totals, dashboard metrics, calendar events, and insights.

There is no Redux, Zustand, React Query, Context-based domain store, or offline sync queue.

## Data Architecture

All app records are stored in a local SQLite database named `masona-farms.db`. The repository uses synchronous Expo SQLite APIs:

- `SQLite.openDatabaseSync`
- `db.execSync`
- `db.runSync`
- `db.getAllSync`
- `db.getFirstSync`
- `db.withTransactionSync`

The schema is created imperatively in `initializeDatabase()`. There is no versioned migration folder. Backward-compatible changes are handled through `ensureColumn()`.

## Auth And Authorization

No authentication or authorization exists. The `user_profiles` table stores one local profile, but it is not a login identity and is not protected by passwords, sessions, tokens, or roles.

Implication: security/privacy rules from the new PRD cannot be satisfied in the current architecture without adding an identity and data-access layer.

## Integrations

Implemented device integrations:

- Device photo library through `expo-image-picker`.
- Local notifications through `expo-notifications`.
- Native share sheet through `Share` and `expo-sharing`.
- PDF generation through `expo-print`.
- CSV file writing through `expo-file-system/legacy`.

No external web APIs, payment APIs, weather APIs, mapping APIs, cloud storage APIs, or analytics integrations are present.

## Error Handling

The UI uses `Alert.alert` for common validation and failure cases. Most repository calls are synchronous and do not expose structured error handling to the UI. Export/share operations catch failures and show simple alerts.

## Architectural Strengths

- Simple offline-first mental model.
- Crop-cycle linkage exists for records.
- Record soft-delete exists.
- Core farm data can be entered without internet.
- Crop library and practice rules are separated from generic record storage.

## Architectural Weaknesses

- `App.tsx` is too large and mixes UI, business logic, reporting, validation, and export generation.
- The database schema is not migration-versioned.
- Records use a generic `type/detail/quantity/amount` model, which is flexible but weak for reporting and PRD-specific fields.
- No backend, authentication, authorization, or multi-farmer isolation.
- No automated tests.
- No cloud sync or backup strategy.

