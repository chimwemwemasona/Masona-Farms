# AGENTS.md

## Project overview

Masona Farms is a farm management application focused on helping farmers keep accurate production, input, labour, expense, and revenue records.

The first major use case is chilli farming, but the system should be designed in a way that can later support other crops.

The app should help farmers answer practical business questions such as:

* What variety was planted?
* When was it planted?
* What inputs were applied?
* What dosage was used?
* Where were the inputs bought?
* How much did production cost?
* What results followed after fertilizer or chemical application?
* What revenue was earned?
* What is the true net profit?

The product goal is not just record keeping. The goal is to help farming become a trackable business rather than a hobby.

## Product principles

* Keep the app simple enough for real farmers to use in the field.
* Prefer clear wording over technical terms.
* Prioritize fast data entry.
* Design for poor or unstable internet connectivity where possible.
* Make important farming records easy to retrieve later.
* Every cost and revenue entry should contribute to profit tracking.
* The app should help diagnose farm problems by preserving historical records.

## Core modules

The app should support these main areas:

### Farms and fields

Track:

* Farm name
* Field or plot name
* Field size
* Crop grown
* Planting date
* Variety name
* Plant population
* Expected harvest window
* Current crop stage

### Fertilizer records

Track:

* Field or crop cycle
* Fertilizer name
* Date applied
* Dosage per plant or per area
* Quantity used
* Purchase source or shop name
* Purchase price
* Application notes
* Observed results after application

### Chemical records

Track:

* Field or crop cycle
* Chemical name
* Date applied
* Dosage
* Target pest, disease, or condition
* Quantity used
* Purchase source or shop name
* Purchase price
* Safety or withholding notes where applicable
* Observed results after application

### Watering records

Track:

* Field or crop cycle
* Watering date
* Watering method
* Whether watering is daily or scheduled
* Notes about rainfall, irrigation issues, or skipped watering

### Labour records

Track:

* Date
* Worker or team name
* Task performed
* Field or crop cycle
* Amount paid
* Notes

### Expense records

Track all farm expenses, including:

* Inputs
* Labour
* Transport
* Equipment
* Irrigation
* Packaging
* Other costs

Every expense should be linked to a farm, field, crop cycle, or general farm operation where possible.

### Revenue records

Track:

* Harvest date
* Quantity harvested
* Quantity sold
* Buyer
* Selling price
* Total revenue
* Payment status
* Notes

### Reports and analytics

The app should provide:

* Total expenses per crop cycle
* Total revenue per crop cycle
* Net profit
* Cost per field
* Cost per plant where possible
* Input usage history
* Supplier/shop history
* Labour cost summary
* Harvest and sales summary

## UX rules

* Use plain English.
* Avoid agricultural jargon unless necessary.
* Avoid software jargon entirely in user-facing text.
* Use forms that are short and grouped logically.
* Do not overwhelm the user with too many required fields.
* Required fields should be limited to what is necessary.
* Use helpful empty states and examples.
* Make record entry easy on mobile.
* Use large touch targets.
* Use dates, dropdowns, and saved previous values to reduce typing.

## Data design rules

* Design around crop cycles. A field may be reused across different seasons or crops.
* Do not attach all records only to a field; attach them to the relevant crop cycle where possible.
* Keep historical records even after a crop cycle ends.
* Avoid deleting important production or financial records. Prefer soft deletes if supported.
* Store money values carefully and consistently.
* Store units clearly, for example kg, ml, litres, grams, bags, or dosage per plant.
* Do not assume all farms use the same units.
* Allow future support for multiple crops, not only chilli.

## Offline and connectivity considerations

Where possible:

* Design the app so users can enter records with limited connectivity.
* Avoid flows that require constant internet access for simple record entry.
* Make sync conflicts clear and safe.
* Do not lose locally entered farm records.

## Code style

* Follow the existing project structure and naming conventions.
* Prefer readable, maintainable code over clever code.
* Keep business logic out of UI components where possible.
* Use services, repositories, actions, or equivalent patterns where appropriate.
* Keep forms modular and reusable.
* Validate data both on the client and server where applicable.
* Use clear names that match the farming domain.

## Architecture rules

* Keep the app modular.
* Separate farm records, financial records, inventory/input records, and reports.
* Do not hard-code chilli-specific logic in places that should support other crops later.
* Keep crop-specific recommendations separate from general record keeping.
* Make it easy to add new crop types, input types, and report types in future.

## Security and privacy

* Treat farm financial data as private.
* Do not expose one farmer's records to another user.
* Use proper authentication and authorization.
* Do not log sensitive user information unnecessarily.
* Be careful with exports, reports, and shared links.

## Testing and verification

When making changes, verify the affected flows.

Important flows include:

* Creating a farm
* Creating a field
* Starting a crop cycle
* Adding fertilizer records
* Adding chemical records
* Adding watering records
* Adding labour costs
* Adding expenses
* Adding revenue
* Viewing profit reports
* Editing existing records
* Handling missing or incomplete data

If automated tests exist, run the relevant tests after changes.

If tests cannot be run, explain what should be manually tested.

## Reporting rules

Reports should be practical and easy to understand.

Prefer labels such as:

* Total spent
* Total earned
* Net profit
* Cost of fertilizer
* Cost of chemicals
* Labour cost
* Harvest quantity
* Sales income

Avoid labels such as:

* Aggregated input expenditure
* Revenue analytics
* Production performance metric

## Definition of done

A task is complete only when:

* The requested feature works.
* The user flow is simple and clear.
* Relevant records are saved correctly.
* Financial values are included in profit tracking where applicable.
* Existing app patterns are followed.
* Any assumptions or limitations are clearly stated.
* Tests or manual verification steps are provided.
