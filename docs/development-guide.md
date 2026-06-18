# Development And Deployment Guide

Generated: 2026-06-17

## Prerequisites

- Node.js and npm.
- Expo-compatible Android development setup or Expo Go on Android.
- Dependencies installed with `npm install`.

The repository includes `node_modules/` in the current workspace, but new environments should install dependencies from `package-lock.json`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run start` | Start Expo. |
| `npm run start:offline` | Start Expo offline and clear cache. |
| `npm run android` | Start Expo for Android. |
| `npm run android:offline` | Start Expo for Android offline and clear cache. |
| `npm run typecheck` | Run TypeScript type checking with no emit. |

## Local Development Flow

1. Install dependencies with `npm install`.
2. Start the app with `npm run start:offline`.
3. Open Expo Go on Android and scan the QR code.
4. For type safety, run `npm run typecheck`.

## Environment Configuration

No `.env` file is used by the current app. Relevant configuration is in:

- `app.json` for Expo app metadata, permissions, and plugins.
- `package.json` for scripts and dependency versions.
- `tsconfig.json` for TypeScript strict mode.

## Deployment Configuration

Current deployment configuration is minimal:

- Expo app name: `Masona Farms`
- Expo slug: `masona-farms`
- Android package: `com.masonafarms.app`
- Orientation: portrait
- Android permissions: `READ_MEDIA_IMAGES`, `READ_EXTERNAL_STORAGE`
- Expo plugins: `expo-image-picker`, `expo-notifications`

Not present:

- EAS build config.
- Native `android/` project.
- Native `ios/` project.
- CI/CD workflow.
- Store signing configuration.
- Release channels or update strategy.

## Testing Setup

No automated test framework is configured. There are no discovered test files, Jest/Vitest config files, Playwright/Cypress config files, or test scripts in `package.json`.

Current verification option:

- `npm run typecheck`

Recommended manual verification after changes:

- First-run profile setup.
- Add field.
- Edit field dates and crop details.
- Add fertilizer, chemical, irrigation, labor, expense, harvest, sale, payment, restocking, and problem records.
- Archive a record and verify reports no longer count it.
- Attach a progress photo and receipt photo.
- Create future-dated records and verify reminders.
- Review calendar selected-day and upcoming work sections.
- Export PDF and CSV reports.
- Share the report text.

## Contribution And Code Style

No standalone contribution guide exists. Follow the project instructions in `AGENTS.md` and current code conventions:

- TypeScript strict mode.
- Plain-English UI text.
- Offline-first behavior for farm records.
- Keep crop-specific recommendations separate from generic record keeping.
- Preserve crop-cycle linkage for production and financial records.

