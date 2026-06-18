# Sprint Change Proposal

**Project:** Masona Farms  
**Date:** 2026-06-18  
**Change trigger:** Implementation readiness assessment found backlog classification and sequencing issues  
**Source evidence:** `_bmad-output/planning-artifacts/implementation-readiness-report-2026-06-17.md`  
**Recommended path:** Direct Adjustment  
**Change scope:** Moderate backlog reorganization
**Approval status:** Approved by user on 2026-06-18

## 1. Issue Summary

The implementation readiness assessment found that the PRD, architecture, UX, and epics are strongly aligned and that all 62 PRD functional requirements are represented in the epic plan. The project does not need a product pivot or MVP reduction.

The problem is backlog readiness: several items currently written as implementation stories are actually decision artifacts, specification artifacts, technical enablers, tests, or refactors. This makes the plan look more implementation-ready than it is, especially for shared-farm access, backend sync, audit, and multi-enterprise expansion.

Concrete evidence:

- Story 5.1 decides backend/auth/tenancy/sync architecture but explicitly excludes backend code, login screen, and sync worker.
- Story 5.2 defines API contracts, role matrix, and audit policy but explicitly excludes implemented backend endpoints.
- Story 6.1 chooses the first non-crop enterprise and extension pattern but explicitly excludes enterprise module implementation.
- Stories 1.2, 1.3, and 1.4 are valuable technical enablers, but they do not independently ship new farmer-facing behavior.
- Several dependency fields use broad phrases such as "Epic 1 migrations and tests" instead of exact prerequisite story IDs or artifacts.

## 2. Impact Analysis

### Epic Impact

**Epic 1: Protect Existing Farm Records And Prepare The App To Evolve**

Epic 1 remains valid and should stay first. It can support implementation, but Stories 1.2, 1.3, and 1.4 should be labeled as technical enablers so sprint planning does not confuse internal safety work with farmer-facing releases.

**Epic 2: Structured Crop Records And Clear Cycle Profit**

Epic 2 remains implementation-ready after Epic 1 prerequisites. It is the strongest farmer-facing next phase because it improves fertilizer, chemical, watering, labour, expense, harvest, sale, payment, and estimate-grade reporting workflows.

**Epic 3: Farm, Enterprise, Unit, And Cycle Management**

Epic 3 remains valid. Some stories are technical foundation work, but the sequence is appropriate after structured crop records and migration safety.

**Epic 4: Suppliers, Inventory, Workers, Buyers, And Financial Integrity**

Epic 4 remains valid. It should depend on exact Epic 2 and Epic 3 story outputs rather than broad epic-level phrases.

**Epic 5: Shared Farm Access, Privacy, Audit, And Sync**

Epic 5 needs the biggest correction. Its first two current stories should become prerequisite artifacts:

- Decision 5.A: backend/auth/tenancy/sync architecture decision.
- Specification 5.B: API contracts, role matrix, and audit policy.

The runtime stories should then be renumbered and depend on those artifacts.

**Epic 6: Multi-Enterprise Farm Modules**

Epic 6 should remain future scope, but its first item should become a product/architecture decision prerequisite. Livestock, poultry, aquaculture, and configurable enterprise stories should be marked as candidate backlog until the first non-crop module is explicitly chosen.

### Story Impact

Stories requiring reclassification:

- Story 1.2: technical enabler, local-only.
- Story 1.3: technical enabler, local-only.
- Story 1.4: technical enabler, local-only.
- Story 5.1: convert to Decision 5.A.
- Story 5.2: convert to Specification 5.B.
- Story 6.1: convert to Decision 6.A.

Stories requiring renumbering:

- Current Story 5.3 becomes Story 5.1.
- Current Story 5.4 becomes Story 5.2.
- Current Story 5.5 becomes Story 5.3.
- Current Story 5.6 becomes Story 5.4.
- Current Story 6.2 through 6.6 become candidate stories under Epic 6 after Decision 6.A.

### Artifact Conflicts

**PRD**

No PRD scope change is required. The PRD already identifies the backend, sync, role, and first-enterprise decisions as open blockers.

**Architecture**

No architecture scope change is required. The architecture already states that Phase 1 can proceed without backend selection and that Phase 2 requires backend/auth/sync decisions before implementation.

**UX**

No UX scope change is required. UX already treats sync, permissions, and first non-crop module as open questions.

**Epics**

`epics.md` requires direct updates to story classification, prerequisite artifacts, dependency wording, and implementation coverage notes.

**Sprint status**

No `sprint-status.yaml` was found. Sprint status updates are not applicable until sprint planning creates that artifact.

## 3. Recommended Approach

Use **Direct Adjustment**.

This issue can be fixed by reorganizing the backlog and clarifying story types. No rollback is needed because no implementation work caused the issue. No MVP reduction is needed because the PRD and architecture already sequence the full platform vision safely.

Effort estimate: Medium  
Risk level: Low to Medium  
Timeline impact: Low before sprint planning; higher if ignored until implementation begins.

Rationale:

- Keeps product scope intact.
- Preserves the strong PRD, architecture, and UX alignment.
- Improves implementation safety before sprint planning.
- Prevents decision/specification work from being mistaken for shipped runtime capability.
- Makes the first implementation path clearer: migrations, tests, report/export extraction, and structured crop records.

## 4. Detailed Change Proposals

### Proposal 1: Convert Story 5.1 To Decision 5.A

Artifact: `epics.md`  
Section: `Story 5.1: Decide Backend, Auth, Tenancy, And Sync Architecture`

OLD:

```md
### Story 5.1: Decide Backend, Auth, Tenancy, And Sync Architecture

As a farm owner,
I want Masona Farms to choose a safe shared-farm architecture before shared data is built,
So that my private farm records are not exposed or lost.
```

NEW:

```md
### Decision 5.A: Decide Backend, Auth, Tenancy, And Sync Architecture

**Type:** Decision / ADR prerequisite
**Implementation readiness:** Not a development story
**Must complete before:** Stories 5.1, 5.2, 5.3, 5.4, and 5.5

Masona Farms must choose the backend stack, authentication approach, tenant model, sync strategy, and local-to-cloud migration direction before shared-farm implementation begins.

This artifact does not ship runtime functionality. It exists to unblock implementation stories that will later deliver authentication, membership access, sync, conflict review, and audit behavior.
```

Rationale: The current item counts as implementation coverage for auth/sync/security requirements, but it explicitly excludes backend code, login, and sync worker.

### Proposal 2: Convert Story 5.2 To Specification 5.B

Artifact: `epics.md`  
Section: `Story 5.2: Define Shared-Farm API Contracts, Role Matrix, And Audit Policy`

OLD:

```md
### Story 5.2: Define Shared-Farm API Contracts, Role Matrix, And Audit Policy

As a farm owner,
I want clear contracts for who can access and change farm records,
So that shared farm work is private, traceable, and controlled.
```

NEW:

```md
### Specification 5.B: Define Shared-Farm API Contracts, Role Matrix, And Audit Policy

**Type:** Specification prerequisite
**Implementation readiness:** Not a development story
**Must complete before:** shared-farm backend, auth, sync, and audit implementation stories

Define the API contracts, role matrix, permission rules, audit event catalogue, tenant boundaries, and local-to-cloud identity mapping required for shared-farm implementation.

This artifact does not ship runtime functionality. It gives later implementation stories the contract they need for server-enforced access, audit logging, sync behavior, and safe migration.
```

Follow-on renumbering:

- Current Story 5.3 becomes Story 5.1: Add Local Sync Metadata And Queue Without Sending Data.
- Current Story 5.4 becomes Story 5.2: Add Authentication And Membership Foundation.
- Current Story 5.5 becomes Story 5.3: Implement Sync Push/Pull With Safe Conflict Review.
- Current Story 5.6 becomes Story 5.4: Add Audit Trail For Privileged Shared-Farm Actions.

Rationale: Contracts and policy are necessary, but they are not implementation. Renumbering keeps Epic 5's actual development stories separate from prerequisite planning artifacts.

### Proposal 3: Convert Story 6.1 To Decision 6.A

Artifact: `epics.md`  
Section: `Story 6.1: Choose First Non-Crop Enterprise And Define Extension Pattern`

OLD:

```md
### Story 6.1: Choose First Non-Crop Enterprise And Define Extension Pattern

As a farm owner,
I want Masona Farms to expand beyond crops in a deliberate order,
So that the next enterprise module solves real farm needs without fragmenting the app.
```

NEW:

```md
### Decision 6.A: Choose First Non-Crop Enterprise And Define Extension Pattern

**Type:** Product / architecture decision prerequisite
**Implementation readiness:** Not a development story
**Must complete before:** any committed Epic 6 implementation story

Masona Farms must choose the first non-crop enterprise module and document the extension pattern before Epic 6 implementation begins.

The decision must compare livestock, poultry, aquaculture, beekeeping/configurable enterprises, and inventory-led expansion using farmer value, data readiness, implementation effort, financial reporting impact, and fit with the shared production model.

Until this decision is approved, livestock, poultry, aquaculture, and configurable enterprise stories remain candidate backlog, not committed implementation sequence.
```

Follow-on change:

- Mark current Stories 6.2 through 6.6 as Candidate Stories until Decision 6.A is approved.
- Remove the assumption that livestock is automatically first unless Decision 6.A explicitly chooses livestock.

Rationale: The current story does not ship functionality, and the current next story assumes livestock is first while the decision is still unresolved.

### Proposal 4: Add Story Classification Metadata

Artifact: `epics.md`  
Scope: Story metadata across all epics

Add this metadata field after each story title or business objective:

```md
**Story classification:** [farmer-facing | technical enabler | decision prerequisite | specification prerequisite | local-only | backend-required | candidate]
```

Initial classifications:

```md
Decision 5.A: decision prerequisite
Specification 5.B: specification prerequisite
Decision 6.A: decision prerequisite

Story 1.1: technical enabler, local-only
Story 1.2: technical enabler, local-only
Story 1.3: technical enabler, local-only
Story 1.4: technical enabler, local-only
Story 1.5: farmer-facing, local-only

Story 2.1: farmer-facing, local-only
Story 2.2: farmer-facing, local-only
Story 2.3: farmer-facing, local-only
Story 2.4: farmer-facing, local-only
Story 2.5: farmer-facing, local-only

Story 3.1: technical enabler, local-only
Story 3.2: technical enabler, local-only
Story 3.3: farmer-facing, local-only
Story 3.4: technical enabler, local-only
Story 3.5: farmer-facing, local-only
Story 3.6: farmer-facing, local-only

Story 4.1: farmer-facing, local-only
Story 4.2: farmer-facing, local-only
Story 4.3: farmer-facing, local-only
Story 4.4: farmer-facing, local-only
Story 4.5: farmer-facing, local-only
Story 4.6: farmer-facing, local-only

Renumbered Epic 5 runtime stories:
Story 5.1: technical enabler, local-only
Story 5.2: farmer-facing, backend-required
Story 5.3: farmer-facing, backend-required
Story 5.4: farmer-facing, backend-required

Epic 6 candidate stories:
Story 6.1: candidate, farmer-facing
Story 6.2: candidate, farmer-facing
Story 6.3: candidate, farmer-facing
Story 6.4: candidate, farmer-facing
Story 6.5: candidate, technical enabler
```

Rationale: This makes sprint planning honest about which items are shippable farmer-facing slices and which are enabling or prerequisite work.

### Proposal 5: Replace Broad Dependencies With Exact Dependencies

Artifact: `epics.md`  
Scope: Dependency fields

Proposed dependency replacements:

```md
Story 2.1
OLD: Epic 1 migrations and tests.
NEW: Stories 1.1 and 1.2.

Story 3.1
OLD: Epic 1 migration runner.
NEW: Story 1.1.

Story 3.6
OLD: Story 3.5 and Epic 2 structured reports.
NEW: Stories 2.5 and 3.5.

Story 4.1
OLD: Epic 2 structured forms.
NEW: Stories 2.1, 2.2, and 2.3.

Story 4.5
OLD: Story 4.1 and Epic 2 labour records.
NEW: Stories 2.2 and 4.1.

Decision 5.A
OLD: Epic 1-4 local model clarity.
NEW: Stories 1.1, 2.5, 3.6, and 4.6.

Specification 5.B
OLD: Story 5.1.
NEW: Decision 5.A.

Renumbered Story 5.1
OLD: Stories 5.1 and 5.2 for sync metadata shape.
NEW: Decision 5.A and Specification 5.B.

Renumbered Story 5.2
OLD: Stories 5.1-5.2, backup/migration readiness.
NEW: Decision 5.A, Specification 5.B, and Story 1.5.

Renumbered Story 5.4
OLD: Stories 5.2, 5.4, 5.5.
NEW: Specification 5.B, Story 5.2, and Story 5.3.

Decision 6.A
OLD: Epic 3 and Epic 4 shared primitives.
NEW: Stories 3.6 and 4.6.

Epic 6 candidate stories
OLD examples: Story 6.1, Epic 3, Epic 4.
NEW: Decision 6.A plus the specific shared foundation stories required by that module, usually Stories 3.6 and 4.6.
```

Rationale: Exact dependencies make the sprint plan buildable and keep decision/specification artifacts visible as prerequisites.

### Proposal 6: Add Implementation Coverage Notes

Artifact: `epics.md`  
Section: after `### FR Coverage Map` or near `### Story Creation Warnings`

NEW:

```md
### Implementation Coverage Notes

The FR Coverage Map shows where each PRD requirement is represented in the epic plan. It does not mean the requirement is already implemented or ready for immediate development.

Use these readiness meanings during sprint planning:

- **Implemented:** Already exists in the current app.
- **Local implementation story:** Can be built in the current local SQLite app without backend decisions.
- **Technical enabler:** Required engineering work that protects or prepares product behavior, but does not itself ship a farmer-facing capability.
- **Decision prerequisite:** Product or architecture decision required before implementation stories can be finalized.
- **Specification prerequisite:** Contract, policy, or design artifact required before implementation.
- **Backend-required:** Cannot be claimed complete until backend identity, authorization, tenancy, sync, or audit support exists.
- **Candidate backlog:** Valid future scope, but not committed to implementation sequence until a prioritization decision is approved.

Sprint planning must use both the FR Coverage Map and these readiness meanings.
```

Rationale: The readiness report found that FR coverage was 100%, but some coverage came from decisions/specifications rather than shippable stories.

## 5. Implementation Handoff

### Scope Classification

Moderate.

The change does not alter the PRD, architecture, or UX scope, but it requires backlog reorganization before sprint planning. This is not a direct code task yet.

### Handoff Recipients

**Product Owner / Developer agents**

Responsibilities:

- Apply approved changes to `epics.md`.
- Keep PRD, architecture, and UX unchanged unless new contradictions appear during editing.
- Preserve all FR coverage while changing story classification and sequencing.
- Rerun implementation readiness after the edits.

**Developer agent**

Responsibilities after backlog correction:

- Begin only with stories marked ready for implementation.
- Start with the Phase 1 brownfield path: versioned SQLite migrations, current behavior tests, report/export extraction, and structured fertilizer/chemical records.

### Success Criteria

- `epics.md` clearly distinguishes decision/specification artifacts from implementation stories.
- Runtime Epic 5 stories no longer depend on fake implementation coverage from decision artifacts.
- Epic 6 candidate stories are not treated as committed implementation sequence until Decision 6.A is complete.
- Story dependencies use exact story IDs or named prerequisite artifacts.
- Implementation readiness can be rerun without the same critical story-classification findings.

## 6. Checklist Completion Summary

- Section 1: Trigger and Context - Done.
- Section 2: Epic Impact Assessment - Done.
- Section 3: Artifact Conflict and Impact Analysis - Done.
- Section 4: Path Forward Evaluation - Done. Direct Adjustment selected.
- Section 5: Sprint Change Proposal Components - Done.
- Section 6: Final Review and Handoff - Done. Proposal approved by user.

## 7. Approval And Routing

**Approval:** Approved by user on 2026-06-18.

**Scope classification:** Moderate.

**Routed to:** Product Owner / Developer agents.

**Handoff responsibilities:**

- Apply the approved edits to `_bmad-output/planning-artifacts/epics.md`.
- Keep PRD, architecture, and UX artifacts unchanged unless the epics edit reveals a new contradiction.
- Preserve all PRD FR coverage while reclassifying decision/specification artifacts and technical enablers.
- Rerun implementation readiness after the epics cleanup.
- Once readiness passes, proceed to sprint planning.

**No sprint-status update performed:** no `sprint-status.yaml` file exists yet. Sprint status should be created during sprint planning after `epics.md` is corrected.

---

## 8. Readiness Addendum - 2026-06-18

**Change trigger:** `implementation-readiness-report-2026-06-18.md` found remaining readiness issues after the earlier backlog reclassification.

**Recommended path:** Direct Adjustment.

**Change scope:** Minor artifact cleanup.

**Approval status:** Applied as a continuation of the approved Correct Course cleanup.

### Issue Summary

The latest implementation readiness assessment found that the major backlog classification work had already been completed: Epic 5 contains Decision 5.A and Specification 5.B, Epic 6 is gated by Decision 6.A, and stories include classification metadata.

The remaining issue was narrower: the top-level FR coverage map and epic summary sections disagreed with story-level ownership for FR-021, FR-055, FR-056, and FR-057. The assessment also asked Epic 1 technical-enabler stories to carry explicit farmer-flow verification checks.

### Impact Analysis

**PRD impact:** None. No requirements were changed.

**Architecture impact:** None. The architecture already supports the corrected ownership: profile, fields, and crop cycles map into the platform model in Epic 3.

**UX impact:** None. UX already supports the same Production and cycle-transition model.

**Epic impact:**

- Epic 1 no longer claims FR-055, FR-056, or FR-057 in its summary because those are implemented in Epic 3 stories.
- Epic 2 no longer claims FR-021 in its summary because crop catalogue/variety support is implemented in Epic 3 Story 3.4.
- Epic 3 now explicitly claims FR-021, FR-055, FR-056, and FR-057 in its summary.
- Epic 1 stories now include manual verification requirements for existing farmer flows.

### Detailed Change Proposals Applied

#### Proposal A: Align FR Coverage Map

Artifact: `_bmad-output/planning-artifacts/epics.md`

OLD:

```md
FR-021: Epic 2 - Crop catalogues and variety support.
FR-055: Epic 1 - Profile to owner/organisation bootstrap mapping.
FR-056: Epic 1 - Field to production unit mapping.
FR-057: Epic 1 - Crop cycle to production cycle mapping.
```

NEW:

```md
FR-021: Epic 3 - Crop catalogues and variety support.
FR-055: Epic 3 - Profile to owner/organisation bootstrap mapping.
FR-056: Epic 3 - Field to production unit mapping.
FR-057: Epic 3 - Crop cycle to production cycle mapping.
```

Rationale: These requirements are implemented by Epic 3 story-level coverage, not Epic 1 or Epic 2.

#### Proposal B: Align Epic Summary FR Lists

Artifact: `_bmad-output/planning-artifacts/epics.md`

Applied changes:

- Removed FR-055, FR-056, and FR-057 from Epic 1 summary.
- Removed FR-021 from Epic 2 summary.
- Added FR-021, FR-055, FR-056, and FR-057 to Epic 3 summary.

Rationale: Top-level summaries now match the story-level implementation paths.

#### Proposal C: Add Farmer-Flow Verification To Epic 1

Artifact: `_bmad-output/planning-artifacts/epics.md`

Applied changes:

- Strengthened the Epic 1 boundary note.
- Added manual verification requirements to Stories 1.1 through 1.5.

Rationale: Epic 1 contains technical-enabler stories. They are valid only if they prove current farmer workflows still work after migration, testing, extraction, refactor, and backup-message changes.

### Checklist Completion Summary

- Section 1: Trigger and Context - Done.
- Section 2: Epic Impact Assessment - Done.
- Section 3: Artifact Conflict and Impact Analysis - Done.
- Section 4: Path Forward Evaluation - Done. Direct Adjustment selected.
- Section 5: Sprint Change Proposal Components - Done.
- Section 6: Final Review and Handoff - Done for the applied cleanup. No `sprint-status.yaml` exists yet.

### Handoff

Rerun implementation readiness against the corrected `epics.md`. If it passes, proceed to sprint planning.
