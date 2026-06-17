# Masona Farms React Native Android App Plan

## Product Direction

Masona Farms is a crop-neutral farm management app for farmers who need simple, reliable records on an Android phone. The app must support any crop, including maize, tomato, chilli, soybean, onion, cabbage, and future custom crops. Chilli-specific fields such as variety, fertilizer, chemicals, harvests, and pest history become generic crop-management fields.

## Android-First Priorities

1. Build with React Native through Expo for a real Android app workflow.
2. Keep the first screen sleek and operational, not a web page or landing page.
3. Use native-feeling navigation, icon buttons, bottom tabs, floating actions, forms, reminders, camera/photo entry, and notifications.
4. Make the app offline-first, starting with local state and moving to SQLite in the next phase.
5. Keep all crop names, varieties, and stages as data so the app is not limited to chilli.

## Core Modules

### Dashboard

- Active fields
- Total expenses
- Total revenue
- Net profit
- Upcoming reminders
- Quick record actions
- Recent field status

### Fields

- Field name
- Crop
- Variety
- Size
- Location
- Planting date
- Expected harvest date
- Plant population
- Spacing
- Current crop stage
- Notes

### Records

- Planting
- Fertilizer application
- Chemical or pesticide application
- Irrigation
- Expense
- Labor
- Harvest
- Sale
- Crop problem
- Supplier purchase
- Inventory usage

### Reports

- Profit and loss
- Expense categories
- Revenue by field
- Harvest summary
- Input usage
- Problem history
- Agronomist share summary

### Reminders

- Watering
- Fertilizer application
- Chemical follow-up
- Harvest date
- Buyer payment collection
- Input restocking
- Pre-harvest interval warning

## Data Model

The first implementation uses typed in-app sample data to establish the interface and module boundaries. Phase 2 should persist the same model in `expo-sqlite`, with media saved through `expo-file-system` and photos captured through `expo-camera` or `expo-image-picker`.

Core objects:

- `fields`
- `activities`
- `expenses`
- `sales`
- `harvests`
- `inventory`
- `suppliers`
- `reminders`
- `problems`

## Phased Roadmap

### Phase 1: React Native Interface Foundation

- Expo React Native Android scaffold
- Premium native mobile dashboard
- Crop-neutral sample data
- Bottom tab navigation
- Field, record, report, and settings screens
- Dashboard calculations
- Quick action buttons
- Floating add button
- Sleek, dense, thumb-friendly visual system

### Phase 2: Offline Persistence

- `expo-sqlite` database
- Form validation
- Dedicated forms for fertilizer, chemical, irrigation, labor, harvest, sales, expenses, inventory, suppliers, and crop problems
- Edit and delete records
- Filters by field, crop, date, and category
- Receipt/photo attachments saved locally with `expo-file-system`

### Phase 3: Sharing and Exports

- WhatsApp text summaries
- PDF reports
- Excel exports
- Agronomist report package
- Payment collection reminders

### Phase 4: Multi-User and Sync

- Owner, manager, worker, agronomist, and accountant roles
- Cloud sync when internet returns
- Conflict handling
- Farm team permissions

## Current Build

This repository now contains the Phase 1 Expo React Native foundation:

- `package.json`
- `app.json`
- `App.tsx`
- `src/data/farmData.ts`
- `src/theme.ts`

Run it with Expo and open it on Android:

```bash
npm install
npm run android
```
