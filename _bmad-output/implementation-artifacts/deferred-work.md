## Deferred from: code review of 1-2-add-repository-and-report-regression-tests-for-current-behavior.md (2026-06-18)

- App startup catch block covers profile/data refresh as well as database open [App.tsx:78]. Deferred because this appears pre-existing to the Story 1.2 review scope and should be handled as a focused startup-error handling cleanup.
- CSV export does not guard against spreadsheet formula injection [src/reports/currentReportRules.ts:168]. Deferred because Story 1.2 intentionally preserves current export behavior; handle as future export hardening.
