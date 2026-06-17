# Product Requirements Document

## Masona Farms

**Document version:** 1.0
**Status:** Draft
**Product type:** Farm Management System
**Initial market:** Zambia
**Future market:** Southern and Central Africa

---

# 1. Product Summary

Masona Farms is a comprehensive farm-management platform designed for crop, livestock, poultry, aquaculture, and mixed-farming businesses.

The product enables farm owners and managers to plan production, manage farm resources, monitor agricultural activities, control costs, record outputs, manage inventory and sales, and measure profitability.

Masona Farms must support specialised farms as well as mixed farms operating multiple agricultural enterprises from the same organisation.

Examples include:

* Crop farms
* Cattle farms
* Dairy farms
* Poultry farms
* Pig farms
* Goat and sheep farms
* Fish farms
* Apiaries
* Mixed farms
* Other configurable agricultural enterprises

Masona Farms manages activities occurring within the operational and financial boundaries of a farm business.

---

# 2. Product Vision

To provide farmers and agricultural businesses with one reliable system for managing production, resources, inventory, finances, and performance across all farm enterprises.

Masona Farms should enable a farm owner to answer:

1. What are we producing?
2. Where is production taking place?
3. What stage is each production cycle in?
4. Which inputs and resources are being consumed?
5. What does each enterprise cost to operate?
6. What outputs are being produced?
7. What inventory is available?
8. What has been sold?
9. Which enterprise, production unit, or cycle is profitable?
10. Where are losses occurring?

---

# 3. Problem Statement

Many farms manage operations using notebooks, paper forms, spreadsheets, phone calls, and WhatsApp messages.

These fragmented processes result in:

* Incomplete production records
* Poor input accountability
* Unclear labour costs
* Weak animal identification
* Missing breeding and treatment records
* Poor feed management
* Unrecorded mortality and production losses
* Inaccurate inventory
* Weak output forecasting
* Difficulty calculating cost of production
* Inability to compare different farm enterprises
* Poor visibility into profitability
* Repeated manual reporting
* Loss of institutional knowledge when staff leave

Masona Farms shall replace these fragmented records with structured, traceable, and accessible farm-management workflows.

---

# 4. Product Goals

Masona Farms shall:

1. Digitise internal farm operations.
2. Support crop, livestock, poultry, aquaculture, and mixed farming.
3. Allow one organisation to manage multiple farms.
4. Allow each farm to manage multiple agricultural enterprises.
5. Track production by enterprise, production unit, and production cycle.
6. Track inputs, feed, medicines, labour, and equipment.
7. Record farm outputs and production losses.
8. Manage farm inventory and sales.
9. calculate cost of production and profitability.
10. Improve operational planning and accountability.
11. Maintain complete farm audit trails.
12. Support offline and low-connectivity environments.
13. Allow future agricultural enterprise types to be added without redesigning the entire system.

---

# 5. Non-Goals

Masona Farms shall not initially:

* Manage independent outgrower networks
* Manage producer contracts
* Calculate outgrower deductions
* Settle payments to external producer networks
* Replace full accounting software
* Replace full payroll software
* Diagnose diseases without professional input
* Prescribe veterinary treatment
* Provide agricultural loans
* Underwrite insurance
* Operate as a public produce marketplace
* Manufacture agricultural hardware
* Operate transport fleets
* Replace government agricultural systems

External producer-network functions shall be handled by Outgrower OS.

---

# 6. Target Customers

Masona Farms may be used by:

* Commercial farms
* Emerging farmers
* Family farms
* Farm estates
* Poultry businesses
* Livestock businesses
* Dairy farms
* Fish farms
* Agricultural cooperatives managing their own production
* Educational or demonstration farms
* Agribusinesses operating internal production facilities

---

# 7. Target Users

## 7.1 Farm owner

Needs to:

* View overall farm performance
* Compare enterprises
* Review expenses and income
* Monitor inventory
* Review production forecasts
* Measure profitability
* Identify losses and risks

## 7.2 Farm manager

Needs to:

* Create production plans
* Schedule activities
* Assign workers
* Manage production units
* Monitor daily operations
* Approve input usage
* Record operational incidents

## 7.3 Agronomist

Needs to:

* Manage crop-production plans
* Conduct inspections
* Monitor crop development
* Record treatments
* Create corrective actions
* Review input applications

## 7.4 Livestock officer or veterinarian

Needs to:

* Review animal-health records
* Record treatments
* Manage vaccination schedules
* Monitor breeding
* Review mortality
* Track medicine-withdrawal periods

## 7.5 Poultry manager

Needs to:

* Manage flocks and poultry houses
* Record feed, mortality, and weights
* Monitor egg production
* Track vaccination schedules
* Measure flock performance

## 7.6 Aquaculture manager

Needs to:

* Manage ponds and cages
* Record stocking
* Monitor feed and water quality
* Record sample weights and mortality
* Forecast harvests

## 7.7 Storekeeper

Needs to:

* Receive stock
* Issue stock
* Track batch numbers and expiries
* Monitor reorder levels
* Reconcile inventory

## 7.8 Finance officer

Needs to:

* Record expenses
* Review sales
* Track customer balances
* Allocate shared costs
* Produce profitability reports

## 7.9 Farm worker or supervisor

Needs to:

* View assigned tasks
* Record completed work
* Record resources consumed
* Report incidents
* Upload photographs and notes

---

# 8. Product Model

## 8.1 Organisation

Represents the farm business or company using the system.

An organisation may own or manage multiple farms.

## 8.2 Farm

Represents a farm location or operating property.

A farm may contain multiple enterprises and production units.

## 8.3 Enterprise

Represents a distinct agricultural business within a farm.

Examples:

* Soybean production
* Broiler production
* Layer production
* Pig breeding
* Pig fattening
* Dairy production
* Beef production
* Tilapia production
* Honey production

## 8.4 Production unit

Represents where production occurs.

Examples:

* Field
* Crop block
* Greenhouse
* Poultry house
* Pig pen
* Barn
* Paddock
* Dairy unit
* Pond
* Fish cage
* Hatchery
* Apiary

## 8.5 Production cycle

Represents a defined production period.

Examples:

* Crop season
* Broiler batch
* Layer cycle
* Pig-fattening cycle
* Breeding cycle
* Lactation cycle
* Fish grow-out cycle
* Honey-production season

## 8.6 Production subject

Represents what is being managed.

Examples:

* Crop
* Individual animal
* Herd
* Flock
* Fish batch
* Bee colony

## 8.7 Input

Represents a resource consumed during production.

Examples:

* Seed
* Fertiliser
* Chemicals
* Feed
* Medicines
* Vaccines
* Supplements
* Fuel
* Bedding
* Water
* Packaging

## 8.8 Output

Represents something produced by the farm.

Examples:

* Crops
* Eggs
* Milk
* Live animals
* Fish
* Fingerlings
* Honey
* Manure
* Breeding stock
* Processed farm products

---

# 9. Supported Agricultural Enterprises

## 9.1 Crop production

The system shall support:

* Field crops
* Horticulture
* Orchards
* Greenhouses
* Herbs and spices
* Seed production

## 9.2 Livestock production

The system shall support:

* Beef cattle
* Dairy cattle
* Goats
* Sheep
* Pigs
* Rabbits
* Other configurable livestock species

## 9.3 Poultry production

The system shall support:

* Broilers
* Layers
* Breeders
* Village chickens
* Ducks
* Turkeys
* Quail
* Other configurable poultry species

## 9.4 Aquaculture

The system shall support:

* Pond farming
* Cage farming
* Fish grow-out
* Fingerling production
* Hatchery operations

## 9.5 Other production

The system should support configurable enterprises such as:

* Beekeeping
* Mushroom production
* Snail farming
* Insect farming
* Other agricultural enterprises

---

# 10. Core User Journeys

## 10.1 General farm journey

```text
Create organisation
→ Create farm
→ Create enterprise
→ Create production units
→ Create production cycle
→ Plan activities
→ Allocate resources
→ Record production
→ Record outputs
→ Sell outputs
→ Calculate performance and profitability
```

## 10.2 Crop-production journey

```text
Create crop enterprise
→ Register field
→ Create crop cycle
→ Assign crop plan
→ Record planting
→ Record inputs and activities
→ Monitor crop
→ Forecast harvest
→ Record harvest
→ Receive output into inventory
→ Sell output
→ Calculate crop profitability
```

## 10.3 Poultry journey

```text
Create poultry enterprise
→ Register poultry house
→ Create flock
→ Record placement
→ Record daily feed, mortality, and production
→ Record vaccinations and weights
→ Record birds or eggs produced
→ Sell outputs
→ Close flock
→ Calculate flock profitability
```

## 10.4 Livestock journey

```text
Create livestock enterprise
→ Register animals or groups
→ Assign animals to production units
→ Record feeding and health
→ Record breeding and births
→ Record weights and movements
→ Record milk or animal outputs
→ Sell or dispose of animals
→ Calculate enterprise profitability
```

## 10.5 Aquaculture journey

```text
Create aquaculture enterprise
→ Register pond or cage
→ Create production cycle
→ Record stocking
→ Record feeding and water quality
→ Record sampling and mortality
→ Forecast harvest
→ Record harvest
→ Sell fish
→ Calculate cycle profitability
```

---

# 11. Functional Requirements

## 11.1 Organisation and farm management

The system shall allow users to:

* Create an organisation
* Manage organisation details
* Create multiple farms
* Add farm locations
* Assign farm managers
* Upload farm documents
* Configure currencies and measurement units
* Configure enterprise types

## 11.2 Enterprise management

The system shall allow users to:

* Create multiple enterprises per farm
* Select an enterprise category
* Select a crop, species, breed, or variety
* Define production purpose
* Define standard activities
* Define standard inputs
* Define expected outputs
* Activate or deactivate enterprises
* Compare enterprise performance

## 11.3 Production-unit management

The system shall allow users to:

* Create production units
* Assign unit types
* Record size or capacity
* Capture GPS location
* Define parent and child units
* Record unit status
* Assign production cycles
* View production history

## 11.4 Production-cycle management

The system shall allow users to:

* Create production cycles
* Assign cycles to enterprises and production units
* Record start and expected completion dates
* Set production targets
* Define expected inputs
* Define expected outputs
* Track cycle status
* Close or cancel cycles
* Compare planned and actual performance

## 11.5 Activity management

Users shall be able to:

* Create one-time and recurring activities
* Assign activities to users or teams
* Link activities to enterprises, units, and cycles
* Record planned dates
* Record completion dates
* Record labour used
* Record equipment used
* Record inputs consumed
* Record costs
* Upload photographs and notes
* Mark activities as pending, active, delayed, completed, or cancelled

## 11.6 Crop management

The system shall support:

* Crop and variety catalogues
* Field allocation
* Planting records
* Plant-population targets
* Germination and emergence records
* Fertiliser applications
* Chemical applications
* Irrigation records
* Crop-stage tracking
* Crop inspections
* Pest and disease observations
* Corrective actions
* Harvest forecasts
* Harvest recording
* Yield calculations

## 11.7 Animal registry

The system shall support individual and group-based management.

Individual animal records may include:

* Identification number
* Tag number
* Species
* Breed
* Sex
* Date of birth
* Source
* Parentage
* Colour or markings
* Current location
* Health status
* Production status
* Ownership status
* Disposal status

Group records may include:

* Group identifier
* Species
* Breed
* Production purpose
* Entry date
* Initial quantity
* Current quantity
* Average age
* Current production unit
* Group status

## 11.8 Animal movement

The system shall support:

* Movement between production units
* Movement between farms
* Temporary movement
* Sale movement
* Quarantine movement
* Death or disposal
* Transfer history

## 11.9 Breeding and reproduction

The system shall support:

* Heat detection
* Natural mating
* Artificial insemination
* Pregnancy checks
* Expected birth dates
* Calving
* Farrowing
* Kidding
* Lambing
* Litter records
* Parent-child relationships
* Weaning
* Breeding-performance reports

## 11.10 Animal health

The system shall support:

* Health incidents
* Symptoms
* Diagnoses recorded by authorised users
* Treatment records
* Medicine usage
* Dosage records
* Vaccination schedules
* Deworming
* Veterinary visits
* Quarantine
* Recovery status
* Treatment costs
* Medicine-withdrawal periods
* Health-history reports

The system shall not independently prescribe treatment.

## 11.11 Feed management

The system shall support:

* Feed products
* Feed types
* Feed formulations
* Feed suppliers
* Feed batches
* Feeding schedules
* Feed issues
* Consumption records
* Feed costs
* Feed wastage
* Feed requirements
* Feed conversion ratios
* Feed-stock alerts

## 11.12 Poultry management

The system shall support:

* Flock creation
* Poultry-house allocation
* Bird placement
* Daily opening quantity
* Feed consumption
* Water consumption
* Mortality
* Culls
* Vaccinations
* Average weight
* Uniformity
* Egg production
* Egg grading
* Hatchability
* Feed conversion ratio
* Flock closure

## 11.13 Pig management

The system shall support:

* Individual and group records
* Sow and boar records
* Service records
* Pregnancy records
* Farrowing records
* Litter records
* Weaning
* Growth monitoring
* Feeding
* Health treatments
* Pen movements
* Sale and disposal

## 11.14 Cattle, goat, and sheep management

The system shall support:

* Individual identification
* Herd management
* Grazing records
* Weight records
* Breeding
* Births
* Milk production
* Treatments
* Vaccinations
* Mortality
* Sales and transfers

## 11.15 Dairy management

The system shall support:

* Lactation periods
* Milking sessions
* Milk by animal or group
* Milk rejection
* Milk quality
* Dry-off dates
* Feed allocation
* Production trends
* Milk inventory
* Milk sales

## 11.16 Aquaculture management

The system shall support:

* Pond and cage registration
* Fish-batch registration
* Stocking records
* Species
* Fingerling source
* Stocking quantity and weight
* Feed schedules
* Feed consumption
* Water-quality measurements
* Mortality
* Sampling
* Average weight
* Biomass estimation
* Feed conversion ratio
* Harvest forecasts
* Partial harvests
* Final harvests
* Cycle closure

## 11.17 Beekeeping management

The system should support:

* Apiaries
* Hives
* Colony status
* Hive inspections
* Feeding
* Treatments
* Swarming
* Queen status
* Honey harvests
* Wax harvests
* Colony losses

## 11.18 Inventory management

The system shall support:

* Input products
* Feed
* Medicines
* Vaccines
* Seed
* Fertiliser
* Chemicals
* Fuel
* Packaging
* Spare parts
* Finished outputs
* Internal transfers
* Multiple storage locations

Inventory functions shall include:

* Stock receipts
* Stock issues
* Transfers
* Adjustments
* Batch numbers
* Expiry dates
* Unit costs
* Stock valuation
* Reorder levels
* Damaged stock
* Expired stock
* Stock reconciliation

## 11.19 Labour management

The system shall support:

* Worker profiles
* Permanent and casual workers
* Teams
* Attendance
* Task assignments
* Labour hours
* Daily rates
* Piece-work rates
* Labour costs by enterprise
* Labour costs by production unit
* Labour costs by production cycle
* Basic payroll summaries

## 11.20 Equipment management

The system shall support:

* Equipment registration
* Equipment category
* Ownership status
* Operator assignment
* Usage records
* Fuel usage
* Maintenance schedules
* Repairs
* Downtime
* Operating cost
* Assignment to activities and enterprises

## 11.21 Mortality and loss management

The system shall support:

* Animal mortality
* Poultry mortality
* Fish mortality
* Crop loss
* Feed loss
* Input loss
* Produce spoilage
* Theft
* Quantity lost
* Financial value lost
* Cause of loss
* Disposal method
* Supporting evidence
* Loss trends

## 11.22 Output management

The system shall allow users to:

* Define output types
* Record output quantities
* Link outputs to production units and cycles
* Record quality or grade
* Record rejects
* Create output batches
* Transfer output into inventory
* Allocate output for internal consumption
* Process output
* Sell output

## 11.23 Sales management

The system shall support:

* Customer registration
* Quotations
* Sales orders
* Delivery notes
* Invoices
* Payments received
* Outstanding balances
* Product batches
* Sales by enterprise
* Sales by production cycle
* Customer purchase history

## 11.24 Expense management

The system shall support:

* Expense categories
* Supplier records
* Purchase records
* Receipt attachments
* Expenses by farm
* Expenses by enterprise
* Expenses by unit
* Expenses by production cycle
* Shared overhead allocation
* Recurring expenses
* Approval workflows

## 11.25 Profitability

The system shall calculate:

* Cost per hectare
* Cost per production unit
* Cost per animal
* Cost per bird
* Cost per pond
* Cost per kilogram
* Cost per litre
* Gross revenue
* Gross margin
* Net profit
* Profitability by farm
* Profitability by enterprise
* Profitability by production unit
* Profitability by production cycle

---

# 12. Reporting Requirements

## 12.1 General reports

* Farm dashboard
* Enterprise-performance report
* Production-cycle report
* Activity report
* Expense report
* Revenue report
* Profitability report
* Inventory report
* Labour report
* Equipment report
* Loss report
* Sales report

## 12.2 Crop reports

* Crop plan
* Planting report
* Input-application report
* Irrigation report
* Crop-inspection report
* Harvest forecast
* Harvest report
* Yield report
* Crop profitability

## 12.3 Livestock reports

* Animal register
* Herd inventory
* Births
* Breeding performance
* Weight gain
* Treatments
* Vaccinations
* Mortality
* Feed consumption
* Animal movements
* Sales

## 12.4 Poultry reports

* Flock-performance report
* Daily mortality
* Feed consumption
* Average weight
* Feed conversion
* Egg production
* Egg grading
* Vaccination compliance
* Flock profitability

## 12.5 Dairy reports

* Milk production
* Milk by animal
* Milk rejection
* Lactation
* Feed-versus-production report
* Milk sales
* Dairy profitability

## 12.6 Aquaculture reports

* Pond or cage performance
* Stocking report
* Feed consumption
* Water-quality history
* Mortality
* Biomass
* Feed conversion
* Harvest forecast
* Harvest results
* Cycle profitability

---

# 13. Data Model Overview

## 13.1 Core entities

* Organisation
* Farm
* Enterprise
* ProductionUnit
* ProductionCycle
* Activity
* Worker
* LabourRecord
* Equipment
* EquipmentUsage
* Supplier
* InventoryItem
* StockMovement
* Expense
* OutputBatch
* Customer
* SalesOrder
* Invoice
* Payment
* Document
* AuditLog

## 13.2 Crop entities

* Field
* Crop
* Variety
* CropCycle
* PlantingRecord
* CropInspection
* InputApplication
* IrrigationRecord
* HarvestRecord

## 13.3 Livestock entities

* Species
* Breed
* Animal
* AnimalGroup
* Herd
* AnimalMovement
* WeightRecord
* BreedingRecord
* PregnancyRecord
* BirthRecord
* WeaningRecord
* HealthIncident
* Treatment
* Vaccination
* MortalityRecord

## 13.4 Poultry entities

* Flock
* PoultryHouse
* DailyFlockRecord
* EggProductionRecord
* BirdWeightRecord
* FlockClosure

## 13.5 Aquaculture entities

* Pond
* Cage
* FishBatch
* StockingRecord
* FeedingRecord
* WaterQualityRecord
* SamplingRecord
* FishMortalityRecord
* FishHarvest

---

# 14. Roles and Permissions

Default roles may include:

* Organisation administrator
* Farm owner
* Farm manager
* Agronomist
* Livestock officer
* Veterinarian
* Poultry manager
* Aquaculture manager
* Storekeeper
* Finance officer
* Supervisor
* Worker
* Auditor

Permissions shall be configurable by:

* Organisation
* Farm
* Enterprise
* Production unit
* Module
* Action

---

# 15. Non-Functional Requirements

## 15.1 Extensibility

The system shall support new enterprise types through configurable:

* Species and crop catalogues
* Production-unit types
* Activity templates
* Input types
* Output types
* Measurements
* Performance indicators

## 15.2 Offline capability

Selected mobile workflows shall support:

* Offline data entry
* Local encrypted storage
* Queued synchronisation
* Retry handling
* Conflict detection
* GPS capture
* Photograph capture
* Last-sync status

## 15.3 Performance

The system should:

* Load common screens within three seconds under normal conditions
* Use pagination for large datasets
* Process large reports asynchronously
* Support multiple farms and enterprises per organisation
* Support large animal, flock, inventory, and activity datasets

## 15.4 Security

The system shall provide:

* Encryption in transit
* Encryption of sensitive data at rest
* Tenant isolation
* Role-based access control
* Secure password hashing
* Multi-factor authentication for privileged users
* Audit trails
* Rate limiting
* Session management
* Data-export controls
* Automated backups

## 15.5 Reliability

The system shall support:

* Automated backups
* Restore procedures
* Retry queues
* Duplicate-record prevention
* Synchronisation-conflict handling
* Disaster-recovery procedures
* Idempotent financial transactions

## 15.6 Usability

The system should:

* Use simple agricultural terminology
* Minimise repetitive data entry
* Support low-cost Android devices
* Provide enterprise-specific dashboards
* Display clear offline indicators
* Support configurable units
* Support multiple languages in future

---

# 16. Integrations

Masona Farms should support future integrations with:

* Outgrower OS
* Mobile-money providers
* Banks
* Accounting software
* SMS gateways
* Weather services
* Digital scales
* Weighbridges
* IoT sensors
* Milk meters
* Feed systems
* Mapping providers
* E-commerce or buyer platforms

---

# 17. Outgrower OS Integration Boundary

Masona Farms may send the following to Outgrower OS:

* Approved production models
* Input availability
* Seedling or livestock availability
* Service availability
* Buyer demand
* Quality requirements
* Warehouse capacity

Masona Farms may receive:

* Aggregated producer batches
* Production forecasts
* Delivery schedules
* Quality summaries
* Traceability information
* Input-demand forecasts

Masona Farms shall not directly edit:

* Producer profiles
* Producer contracts
* Producer input loans
* Producer deductions
* Producer settlements

These remain owned by Outgrower OS.

---

# 18. Product Packaging

Masona Farms may be packaged as:

## Masona Farms Core

* Farms
* Enterprises
* Production units
* Activities
* Inventory
* Labour
* Equipment
* Expenses
* Sales
* Profitability

## Masona Crops

* Crop cycles
* Field management
* Input applications
* Irrigation
* Inspections
* Harvests

## Masona Livestock

* Animal registry
* Breeding
* Health
* Feeding
* Movements
* Mortality

## Masona Poultry

* Flocks
* Poultry houses
* Daily records
* Eggs
* Feed conversion
* Mortality

## Masona Aquaculture

* Ponds
* Fish batches
* Feeding
* Water quality
* Sampling
* Harvesting

Customers may activate only the modules relevant to their farms.

---

# 19. Success Metrics

## 19.1 Adoption

* Active organisations
* Active farms
* Active enterprises
* Monthly active users
* Production cycles managed
* Percentage of farm records captured digitally

## 19.2 Operational performance

* Activities completed on time
* Inventory variance
* Feed variance
* Input variance
* Mortality rate
* Production losses
* Output per production unit
* Forecast accuracy

## 19.3 Financial performance

* Cost per production unit
* Cost per kilogram or litre
* Revenue by enterprise
* Gross margin
* Net profit
* Profitability by cycle
* Expense-record completeness

## 19.4 Product reliability

* Application uptime
* Synchronisation success rate
* Failed transaction rate
* Data-loss incidents
* Support requests
* User retention

---

# 20. Acceptance Criteria

Masona Farms shall be considered functionally complete for its core product scope when:

1. An organisation can manage multiple farms.
2. A farm can operate multiple agricultural enterprises.
3. Each enterprise can contain production units and production cycles.
4. The system can manage both individual animals and production groups.
5. Crop, livestock, poultry, and aquaculture workflows are supported.
6. Inputs, feed, medicines, labour, and equipment can be assigned to production.
7. Farm outputs can be received into inventory.
8. Outputs can be sold and linked to customers.
9. Expenses and revenue can be allocated to enterprises and cycles.
10. Profitability can be calculated by farm, enterprise, unit, and cycle.
11. User actions affecting inventory, health, finance, and sales are audited.
12. Selected operational workflows function offline.
13. New enterprise configurations can be added without changing the core farm model.

---

# 21. Product Principle

> Masona Farms manages everything required to operate, measure, and improve production within a farm business.

It must support both specialised farms and mixed farms without forcing livestock, poultry, aquaculture, or other enterprises into crop-based workflows.
