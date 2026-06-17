# Masona Farms

React Native Android app for crop-neutral farm management.

## Run On Android

```powershell
npm run start:offline
```

Open Expo Go on Android and scan the QR code.

## Production Implementation Checklist

### Stage 0: Onboarding And Profile

- [x] First-run onboarding walkthrough
- [x] Local farmer profile
- [x] Farm name and location shown in the app header
- [x] More tab profile card with edit action
- [x] Blank-slate setup clears starter/demo records on this phone
- [x] New installs no longer seed demo farm data automatically

### Stage 1: Offline Field Management

- [x] Expo React Native Android scaffold
- [x] Premium Android-first dashboard UI
- [x] Crop-neutral sample data model
- [x] Local SQLite dependency added
- [x] Local database schema for fields and records
- [x] Start new local databases without demo records
- [x] Load dashboard fields from persisted local data
- [x] Add Field form
- [x] Save new fields offline
- [x] Dashboard active fields update after saving
- [x] Create active crop cycle when a field is added
- [x] Show active crop cycles in Fields tab
- [x] Field rows open expandable detail sheet
- [x] TypeScript validation passes

### Stage 2: Activity And Record Logging

- [x] Add Record form
- [x] Save fertilizer, chemical, irrigation, expense, labor, harvest, sale, and problem records
- [x] Link every record to a field
- [x] Link every record to a crop cycle
- [x] Persist records in SQLite
- [x] Filter records by type
- [x] Show live record counts in filters
- [x] Update dashboard recent records from SQLite
- [x] Record rows expand to show linked details
- [x] Archive records with confirmation using soft delete
- [ ] Dedicated supplier and inventory record forms

### Stage 3: Financial Dashboard

- [x] Calculate total revenue from sale records
- [x] Calculate total expenses from input/labor/transport records
- [x] Calculate net profit
- [x] Make dashboard metric cards fully data-driven
- [x] Show live farm activity and weekly record count
- [x] Calculate cost per field
- [x] Calculate profit by crop
- [x] Calculate cost per hectare
- [ ] Show outstanding buyer payments

### Stage 3B: Crop Calendar And Benchmark Guidance

Plan: Masona Farms should stop treating crop progress as a typed percentage. The farmer should enter the crop-cycle facts, and the app should calculate progress, dates, expected stage, upcoming work, overdue work, and benchmark checks.

Farmer-entered crop-cycle data:

- [x] Crop
- [x] Variety, if known
- [x] Planting or transplanting date
- [x] Expected harvest date
- [ ] Separate nursery or sowing date
- [ ] Separate transplanting date
- [ ] Expected transplanting window
- [ ] Expected maturity or harvest duration as an editable field
- [x] Crop stage
- [x] Farmer can still type/override the crop stage when reality differs from the expected calendar

Automatic calculations:

- [x] Current crop age from planting/transplanting date
- [x] Expected crop stage from the local crop-practice timeline
- [x] Progress percentage from planting/transplanting date to expected harvest date
- [x] Planned upcoming crop tasks from the practice database
- [ ] Days since transplanting separate from days since sowing
- [ ] Overdue task detection
- [ ] Clear explanation text such as "Transplanted 42 days ago. Expected crop cycle is 120 days. Progress is 35%. Current expected stage: flowering."

Calendar:

- [x] Interactive Calendar tab
- [x] Selectable date cards
- [x] Month calendar view with previous and next month controls
- [x] Today and selected-day highlighting
- [x] Event dots/counts on calendar days
- [x] Jump to a specific date for backfilling
- [x] Add records directly from the selected calendar date
- [x] Backfill planting, fertilizer, chemical, irrigation, treatment, labour, harvest, and sale records
- [x] Planting/start date events
- [ ] Nursery date events
- [ ] Transplanting window events
- [x] Fertilizer practice-window events
- [x] Chemical/crop health practice-window events
- [ ] Recurring watering schedule events
- [x] Harvest planning and expected harvest events
- [x] Saved farm records shown beside planned work
- [x] Backfilled records appear on the selected calendar day
- [ ] Buyer/payment follow-up events
- [ ] Chemical withholding-period events
- [ ] Overdue activity section
- [x] Future-dated calendar activities create local reminders as the date gets closer

Benchmark/practice database:

- [x] Starter local practice database for chilli, tomato, maize, onion, soybean, and a general crop fallback
- [x] Crop timelines used to infer stage and progress
- [x] Benchmark tasks used to create calendar events
- [x] Dashboard insights compare actual records against expected crop timelines
- [x] Reports show the same benchmark checks
- [ ] Fertilizer timing comparison, for example "You applied fertilizer 28 days after transplanting. Common top dressing window is 21-30 days."
- [ ] Watering gap comparison, for example "No watering record for 4 days during flowering."
- [x] Chemical follow-up reminder after chemical application
- [x] Chemical follow-up reminder follows the chemical application date
- [ ] Withholding-period warning after chemical application
- [ ] Harvest timing comparison against expected harvest window
- [ ] Labour-cost benchmark against field size and crop cycle
- [ ] Make benchmark rules editable per farm, region, variety, and advisor recommendation

UX and data quality:

- [ ] Add a true native date picker control
- [x] Add edit flow for crop-cycle dates after a field is created
- [x] Update active crop cycle when field crop, variety, dates, or stage change
- [x] Recalculate calendar progress, tasks, and insights after field edits
- [x] Store quantity or dosage separately from cost/revenue records
- [ ] Let farmers mark benchmark advice as done, skipped, or not relevant
- [ ] Let farmers add custom farm practices to the benchmark database

### Stage 3C: Crop Library And ABE Chilli Knowledge

Plan: crop selection should come from a local crop library instead of a free-text field. Crop-specific guidance should then be applied when the selected crop and variety match known practice data, starting with ABE Chilli from the Mucha Greenfields guide.

- [x] Confirm protected ABE Chilli guide can be opened with the supplied password
- [x] Extract the ABE Chilli guide into structured local knowledge
- [x] Create a local crop library seed file
- [x] Replace free-text crop entry with crop selection from the library
- [x] Add variety selection where known, including ABE Chilli
- [x] Attach crop-specific stages, maturity windows, transplanting windows, input windows, and harvest windows
- [x] Apply ABE Chilli guidance only when the farmer selects ABE Chilli
- [x] Show ABE Chilli calendar tasks from the guide
- [x] Show ABE Chilli benchmark checks against actual farmer records
- [x] Keep generic crop fallback for crops not yet in the library

### Stage 4: Photos And Receipts

- [x] Add image picker dependency
- [x] Attach photos to fields
- [x] Attach photos to crop problems
- [x] Attach receipt photos to purchases and expenses
- [x] Store image URI references offline
- [x] Categorize photos as progress, problem, receipt, or general
- [x] Link problem and receipt photos to matching records where available
- [x] Show recent saved photos in the app

### Stage 5: Reminders And Notifications

- [x] Add local notification dependency
- [x] Persist reminders in SQLite
- [x] Load dashboard reminders from local database
- [x] Create chemical follow-up reminders from record form
- [x] Schedule local notification for chemical follow-up
- [x] Reminder rows show details when tapped
- [x] Notify for watering, harvest, payment collection, and restocking
- [x] Pre-harvest interval warning after chemical application

### Stage 6: Reports And Sharing

- [x] Agronomist field report
- [x] WhatsApp share summary
- [x] PDF export
- [x] Excel export
- [x] Profit and loss report

### Stage 7: Production Hardening

- [x] Masona Farms logo mark
- [x] Subtle dashboard and list entrance animations
- [ ] Input validation rules
- [x] Empty states for missing dashboard and record data
- [ ] Error states
- [x] Soft delete/archive record flow
- [ ] Edit record flow
- [ ] Backup/export strategy
- [ ] Cloud sync strategy
- [ ] User roles and permissions
- [ ] Android production build
