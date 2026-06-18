# Masona Farms Project Overview

Generated: 2026-06-17

## Executive Summary

Masona Farms is currently an Expo React Native Android application for offline-first farm record keeping. The implemented app lets a farmer set up a local profile, add crop fields, create active crop cycles, add general farm records, view a crop calendar, attach photos, schedule local reminders, and export/share simple reports.

The repository does not contain a backend service, hosted database, API server, authentication system, role system, cloud sync, CI pipeline, or migration framework. All production data is stored locally on the phone through `expo-sqlite`.

## Current Implementation Scope

Implemented in the app:

- First-run profile setup with a local farmer profile.
- Offline field creation and editing.
- Automatic active crop-cycle creation when a field is added.
- Crop selection from a local crop library.
- ABE Chilli guidance plus generic crop fallback.
- Record logging for activity, planting, treatment, fertilizer, chemical, irrigation, expense, labor, harvest, sale, payment, restocking, and problem.
- Local SQLite persistence for fields, records, crop cycles, photos, reminders, and profile data.
- Soft archive for records through a `deleted_at` column.
- Dashboard totals for revenue, expenses, net profit, farm activity, cost per field, cost per hectare, and best crop.
- Calendar events from crop practice tasks, planting dates, expected harvest dates, records, and chemical withholding checks.
- Local reminders and Expo notifications.
- Photo attachment using the device media picker.
- Report sharing through native share, PDF export, and CSV export.

Not implemented as separate production modules:

- Dedicated supplier forms and supplier records.
- Dedicated inventory/input stock module.
- Dedicated field-specific fertilizer and chemical forms with structured supplier, dosage, target pest, safety, and observed-result fields.
- Revenue model with buyer, selling price, quantity sold, total revenue, and payment status as separate data fields.
- Backend API and cloud database.
- Authentication, authorization, multi-user roles, and tenant isolation.
- Cloud sync, backup, conflict handling, and restore.
- Automated test suite.
- Android production build configuration beyond the Expo config.

## Technology Stack

| Category | Technology | Version | Evidence |
| --- | --- | --- | --- |
| Mobile runtime | Expo | `~54.0.0` | `package.json` |
| UI framework | React Native | `0.81.4` | `package.json` |
| React | React | `19.1.0` | `package.json` |
| Language | TypeScript | `~5.9.2` | `package.json`, `tsconfig.json` |
| Local database | `expo-sqlite` | `~16.0.10` | `package.json`, `src/data/farmRepository.ts` |
| Notifications | `expo-notifications` | `^0.32.17` | `package.json`, `src/services/notifications.ts` |
| Media picker | `expo-image-picker` | `~17.0.11` | `package.json`, `App.tsx` |
| PDF export | `expo-print` | `^56.0.3` | `package.json`, `App.tsx` |
| File export | `expo-file-system` | `^56.0.7` | `package.json`, `App.tsx` |
| Sharing | `expo-sharing`, React Native `Share` | `^56.0.16` | `package.json`, `App.tsx` |
| Icons | `@expo/vector-icons` | `^15.0.2` | `package.json`, `App.tsx` |

## Repository Classification

This is a single-part mobile app. The app has supporting BMAD and WDS project tooling folders, but there are no independent application packages such as `client/`, `server/`, `api/`, or `packages/`.

## Current User-Facing Navigation

The app uses a custom bottom tab model in `App.tsx`:

- Home
- Fields
- Records
- Calendar
- Reports
- More

There is no React Navigation dependency. Navigation state is local React state.

## Key Product Reality

The app is already crop-neutral in its data model and UI labels in many places. It is not hard-coded only for chilli. However, ABE Chilli has special guidance in `cropLibrary.ts` and additional benchmark insights in `cropPractices.ts`.

The current product is best understood as a strong local/offline prototype or early production mobile app. It is not yet a multi-user farm management platform.

