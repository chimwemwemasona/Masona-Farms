# Source Tree Analysis

Generated: 2026-06-17

## Annotated Tree

```text
Masona Farms/
|-- App.tsx
|   Main React Native application. Contains app shell, screens, forms, modals,
|   reporting helpers, dashboard calculations, calendar UI, photo flow, and styles.
|-- app.json
|   Expo application metadata, Android package name, permissions, and plugins.
|-- package.json
|   Expo scripts and dependencies.
|-- package-lock.json
|   NPM lockfile.
|-- tsconfig.json
|   TypeScript config extending Expo base config with strict mode.
|-- README.md
|   Current run instructions and production implementation checklist.
|-- APP_PLAN.md
|   Earlier product plan; partially stale.
|-- AGENTS.md
|   Project instructions and product rules for future work.
|-- src/
|   |-- theme.ts
|   |   Shared colors, radii, and spacing tokens.
|   |-- data/
|   |   |-- types.ts
|   |   |   TypeScript domain types used by the app.
|   |   |-- farmRepository.ts
|   |   |   Local SQLite schema, query, and write functions.
|   |   |-- farmData.ts
|   |   |   Legacy/static sample metrics, fields, reminders, records, and quick actions.
|   |   |-- cropLibrary.ts
|   |   |   Crop catalog and crop-specific practice data, including ABE Chilli.
|   |   |-- cropPractices.ts
|   |       Calendar generation, timeline calculations, and benchmark insights.
|   |-- services/
|       |-- notifications.ts
|           Expo notification permission, channel, and scheduling helper.
|-- docs/
|   Generated project knowledge directory.
|-- _bmad/
|   BMAD workflow/configuration tooling, not application runtime code.
|-- _bmad-output/
|   BMAD generated planning artifacts.
|-- .agents/
|   Local skill definitions and tooling.
|-- .expo/
|   Local Expo state.
|-- node_modules/
|   Installed dependencies.
```

## Critical Runtime Files

- `App.tsx`: all screen composition and most behavior.
- `src/data/farmRepository.ts`: source of truth for local schema and persistence.
- `src/data/cropPractices.ts`: crop calendar and insight business logic.
- `src/data/cropLibrary.ts`: crop-specific knowledge.
- `src/services/notifications.ts`: reminder scheduling.

## Non-Runtime Tooling And Context

The repository contains a large amount of BMAD/WDS tooling under `_bmad/`, `_bmad-output/`, and `.agents/`. These folders are important for project process but do not participate in the mobile app build.

## Missing Expected Folders

These folders do not exist in the current implementation:

- `server/`, `backend/`, `api/`, or `controllers/`
- `migrations/`, `prisma/`, or `schema/`
- `tests/`, `__tests__/`, or test specs
- `.github/workflows/`
- `android/` and `ios/` native build folders
- `src/components/`, `src/screens/`, `src/navigation/`, `src/hooks/`, or `src/repositories/` beyond the current compact layout

