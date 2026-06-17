import type { CropField, FarmRecord, Reminder } from "./types";

export const metrics = [
  { label: "Total value", value: 78420, delta: "+12%", icon: "cash-outline", tone: "green" },
  { label: "Expenses", value: 23840, delta: "+8%", icon: "wallet-outline", tone: "teal" },
  { label: "Net profit", value: 54580, delta: "+18%", icon: "trending-up-outline", tone: "green" },
  { label: "This season", value: 54580, delta: "Mar - Aug", icon: "pie-chart-outline", tone: "teal" }
] as const;

export const fields: CropField[] = [
  { id: "1", crop: "Tomato", field: "Field 1", area: "2.5 ha", variety: "Not set", plantingDate: "", expectedHarvest: "", stage: "Transplanting", progress: 65, status: "Healthy", accent: "#e94a38", daysAfterPlanting: null, progressSource: "manual" },
  { id: "2", crop: "Maize", field: "Field 3", area: "5.0 ha", variety: "Not set", plantingDate: "", expectedHarvest: "", stage: "Vegetative", progress: 45, status: "Good", accent: "#e0b537", daysAfterPlanting: null, progressSource: "manual" },
  { id: "3", crop: "Chilli", field: "Field 2", area: "1.8 ha", variety: "Not set", plantingDate: "", expectedHarvest: "", stage: "Flowering", progress: 70, status: "Watch", accent: "#c9242f", daysAfterPlanting: null, progressSource: "manual" },
  { id: "4", crop: "Soybean", field: "Field 4", area: "3.2 ha", variety: "Not set", plantingDate: "", expectedHarvest: "", stage: "Podding", progress: 55, status: "Good", accent: "#65a744", daysAfterPlanting: null, progressSource: "manual" },
  { id: "5", crop: "Onion", field: "Field 5", area: "1.5 ha", variety: "Not set", plantingDate: "", expectedHarvest: "", stage: "Bulbing", progress: 60, status: "Healthy", accent: "#8a4a36", daysAfterPlanting: null, progressSource: "manual" }
];

export const reminders: Reminder[] = [
  { id: "1", title: "Chilli - Field 2", detail: "Spraying due", due: "Today", tone: "red", icon: "sprinkler" },
  { id: "2", title: "Fertilizer - Maize Field 3", detail: "Top dressing due", due: "Tomorrow", tone: "amber", icon: "calendar" },
  { id: "3", title: "Irrigation - Onion Field 5", detail: "Next irrigation due", due: "2 days", tone: "red", icon: "water" }
];

export const records: FarmRecord[] = [
  { id: "1", type: "Fertilizer Application", field: "Field 3", cropCycleId: "", cropCycleName: "Maize - Field 3", detail: "Urea (46%)", quantity: "50 kg", date: "5 Jun 2026", amount: 750, icon: "checkbox-outline", tone: "green" },
  { id: "2", type: "Irrigation", field: "Field 1", cropCycleId: "", cropCycleName: "Tomato - Field 1", detail: "Drip irrigation", quantity: "2 hours", date: "5 Jun 2026", amount: 120, icon: "water-outline", tone: "blue" },
  { id: "3", type: "Weeding", field: "Field 4", cropCycleId: "", cropCycleName: "Soybean - Field 4", detail: "Manual weeding", quantity: "1 team", date: "4 Jun 2026", amount: 80, icon: "leaf-outline", tone: "green" },
  { id: "4", type: "Purchase", field: "Field 2", cropCycleId: "", cropCycleName: "Chilli - Field 2", detail: "Amistar Top", quantity: "1 L", date: "4 Jun 2026", amount: 420, icon: "briefcase-outline", tone: "amber" }
];

export const quickActions = [
  { label: "Add Field", icon: "add-circle-outline", color: "#08724a" },
  { label: "Add Record", icon: "clipboard-outline", color: "#07945f" },
  { label: "Log Activity", icon: "leaf-outline", color: "#07945f" },
  { label: "Irrigation", icon: "water-outline", color: "#1496a8" },
  { label: "Expense", icon: "cart-outline", color: "#ef8200" },
  { label: "Photo", icon: "camera-outline", color: "#1587aa" }
] as const;
