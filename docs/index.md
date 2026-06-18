# Masona Farms Project Documentation Index

Generated: 2026-06-17

## Project Overview

- **Type:** Single-part mobile application
- **Primary language:** TypeScript
- **Runtime:** Expo React Native Android app
- **Architecture:** Single-file React Native UI shell with local repository and data helpers
- **Persistence:** Local `expo-sqlite` database on device
- **Backend:** None implemented
- **Authentication:** None implemented

## Quick Reference

- **Entry point:** `App.tsx`, exported through Expo's `node_modules/expo/AppEntry.js`
- **Main UI:** `App.tsx`
- **Local database:** `src/data/farmRepository.ts`
- **Domain types:** `src/data/types.ts`
- **Crop calendar and insights:** `src/data/cropPractices.ts`
- **Crop library:** `src/data/cropLibrary.ts`
- **Notifications:** `src/services/notifications.ts`
- **Theme tokens:** `src/theme.ts`
- **Run command:** `npm run start:offline` or `npm run android`
- **Verification command:** `npm run typecheck`

## Generated Documentation

- [Project Overview](./project-overview.md)
- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory.md)
- [Data Models And Local Database](./data-models.md)
- [API Contracts And Integrations](./api-contracts.md)
- [Development And Deployment Guide](./development-guide.md)
- [Technical Debt And PRD Conflicts](./technical-debt-and-prd-conflicts.md)

## Existing Documentation

- [Repository README](../README.md) - Current implementation checklist and run instructions.
- [App Plan](../APP_PLAN.md) - Earlier product plan; some statements are stale compared with the current implementation.
- [Original PRD Artifact](../_bmad-output/planning-artifacts/prd-original.md) - Planning artifact available in BMAD output.
- [Project Instructions](../AGENTS.md) - Product, UX, data, architecture, security, and testing guardrails for Masona Farms.

## Brownfield Planning Guidance

Use this index as the entry point for future PRD and implementation work. For features touching records, finance, crop cycles, reports, or offline storage, read [Architecture](./architecture.md), [Data Models And Local Database](./data-models.md), and [Technical Debt And PRD Conflicts](./technical-debt-and-prd-conflicts.md) together.

The most important planning constraint is that the current app is local-only. Any new PRD that assumes user accounts, backend APIs, cloud sync, role-based access, or server-side authorization conflicts with the implementation as it exists today.

