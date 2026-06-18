# PRD Quality Review - Masona Farms Original PRD

## Overall Verdict

The original PRD is a strong long-term vision document but a weak brownfield build contract for the current Masona Farms implementation. It needs scope separation, migration requirements, role/auth sequencing, and testable acceptance criteria before it can safely guide engineering work.

## Decision-Readiness - thin

The original PRD states a broad platform ambition across crops, livestock, poultry, aquaculture, inventory, sales, and integrations, but it does not surface the central brownfield decision: whether Masona Farms remains local-only or becomes a cloud-backed multi-user platform. That decision affects authentication, permissions, sync, data model shape, and migration strategy.

### Findings

* **high** Platform direction is undecided (sections 1, 11, 14, 15, 16) - The PRD requires multi-enterprise and multi-user platform behavior while the app has no backend, auth, or sync. *Fix:* Add a clear local-first next-release scope and defer platform expansion behind an architecture decision.
* **high** Migration work is missing (sections 11, 13, 20) - The PRD adds many entities and structured fields without saying how current SQLite records are preserved. *Fix:* Add explicit migration and backward-compatibility requirements.

## Substance Over Theater - thin

The PRD has useful domain coverage, but many sections read like a platform catalog rather than requirements earned by the current product stage. Livestock, poultry, aquaculture, dairy, beekeeping, inventory, sales orders, invoices, and equipment are listed at similar weight to already-built crop recordkeeping.

### Findings

* **medium** Future modules are presented as current scope (sections 9, 11.7-11.23, 12.3-12.6) - The app currently supports crop records only. *Fix:* Move non-crop modules into a deferred scope register.
* **medium** NFRs are broad but not implementation-specific (section 15) - Security, reliability, and offline capability are described generically. *Fix:* Add local-only privacy, export risk, migration safety, and device data-loss requirements.

## Strategic Coherence - adequate

The strategic thesis is coherent: make farm operations trackable and profitable. The conflict is sequencing. The original PRD jumps from a crop-focused app reality to a full agricultural ERP without an explicit intermediate milestone.

### Findings

* **medium** MVP path is not defined (sections 4, 18, 20) - The product packaging section suggests modular commercialization, but acceptance criteria define a large platform. *Fix:* Define the next release as crop recordkeeping and retain platform modules as later packages.

## Done-Ness Clarity - broken

Many functional requirements are lists of capabilities without testable consequences. Acceptance criteria exist, but they describe full platform completion rather than verifiable next-release behavior against the current implementation.

### Findings

* **critical** Acceptance criteria are too broad for the implementation (section 20) - Criteria require crop, livestock, poultry, aquaculture, inventory, roles, and offline workflows while none are sequenced. *Fix:* Replace with next-release acceptance criteria grounded in field, crop-cycle, structured record, reporting, export, and migration flows.
* **high** Structured record requirements lack data semantics (sections 11.6, 11.24, 11.25) - Fertilizer, chemical, labour, expenses, revenue, and payments do not specify how values affect reports or migrate from generic records. *Fix:* Define structured fields and financial rules per record type.

## Scope Honesty - broken

The Non-Goals section is helpful, but the PRD does not distinguish current, next, and future scope. That makes deferred features appear required immediately.

### Findings

* **critical** Greenfield scope conflicts with brownfield reality (sections 8-18) - The app has local fields, crop cycles, generic records, photos, reminders, and reports, while the PRD assumes an enterprise domain model. *Fix:* Add current implementation baseline and deferred scope register.
* **high** Role and permission scope is incomplete (section 14) - Roles are listed, but there is no current user model and no permission acceptance criteria. *Fix:* Define current single-local-profile behavior and defer configurable RBAC until auth exists.

## Downstream Usability - thin

The PRD uses many domain terms but lacks stable requirement IDs and does not identify which requirements already exist versus require migration. This makes it hard to create implementation stories safely.

### Findings

* **medium** Requirements are not numbered as stable FRs (section 11) - Bullets are easy to read but hard to trace into stories and tests. *Fix:* Add FR/NFR IDs for the updated scope.
* **medium** Current implementation evidence is absent - The PRD does not cite the local SQLite schema, generic record model, or missing backend/auth. *Fix:* Add a brownfield implementation baseline.

## Shape Fit - thin

The original PRD fits a future platform, not the current single-device mobile app. For brownfield planning, it needs a narrower executable shape and a clear deferred platform register.

### Findings

* **high** Product shape is over-expanded for next build (whole document) - The document mixes immediate crop recordkeeping with multi-enterprise agricultural ERP. *Fix:* Use a brownfield PRD focused on the next crop-recording milestone, with future modules deferred.

## Mechanical Notes

* `Labour` and `Labor` differ between product language and current implementation.
* `Fertiliser` and `Fertilizer` differ between original PRD and current app labels.
* Requirements were bullets rather than stable FR IDs.
* User journeys are generic process flows rather than named-protagonist journeys.
* No assumptions index exists.
