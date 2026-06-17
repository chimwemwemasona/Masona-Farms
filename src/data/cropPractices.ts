import { getCropLibraryItem } from "./cropLibrary";
import type { CropField, FarmRecord } from "./types";

export type PracticeTask = {
  day: number;
  title: string;
  detail: string;
  type: "field" | "fertilizer" | "watering" | "chemical" | "harvest";
};

export type CropPractice = {
  crop: string;
  durationDays: number;
  transplantWindow?: [number, number];
  stages: { name: string; from: number; to: number }[];
  tasks: PracticeTask[];
};

export type FarmCalendarEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  field: string;
  tone: "green" | "amber" | "red" | "teal";
  icon: "calendar-outline" | "leaf-outline" | "water-outline" | "flask-outline" | "cash-outline";
};

export type FarmInsight = {
  id: string;
  title: string;
  detail: string;
  tone: "green" | "amber" | "red" | "teal";
  icon: "bulb-outline" | "warning-outline" | "checkmark-circle-outline";
};

const practices: CropPractice[] = [
  {
    crop: "Chilli",
    durationDays: 150,
    transplantWindow: [35, 45],
    stages: [
      { name: "Nursery", from: 0, to: 35 },
      { name: "Transplanting", from: 36, to: 50 },
      { name: "Vegetative", from: 51, to: 85 },
      { name: "Flowering", from: 86, to: 115 },
      { name: "Harvesting", from: 116, to: 150 }
    ],
    tasks: [
      { day: 35, title: "Transplanting window", detail: "Check seedling strength and prepare the field.", type: "field" },
      { day: 45, title: "Early field check", detail: "Look for gaps, water stress, and pest damage.", type: "field" },
      { day: 60, title: "Top dressing window", detail: "Record fertilizer used, quantity, source, and cost.", type: "fertilizer" },
      { day: 90, title: "Flowering watch", detail: "Track watering, pests, and chemical follow-up notes.", type: "chemical" },
      { day: 120, title: "Harvest planning", detail: "Prepare labour, crates, buyer contacts, and sales records.", type: "harvest" }
    ]
  },
  {
    crop: "Tomato",
    durationDays: 120,
    transplantWindow: [25, 35],
    stages: [
      { name: "Nursery", from: 0, to: 30 },
      { name: "Transplanting", from: 31, to: 40 },
      { name: "Vegetative", from: 41, to: 65 },
      { name: "Flowering", from: 66, to: 85 },
      { name: "Harvesting", from: 86, to: 120 }
    ],
    tasks: [
      { day: 30, title: "Transplanting window", detail: "Move strong seedlings and record labour cost.", type: "field" },
      { day: 45, title: "Early fertilizer check", detail: "Record top dressing and observed crop response.", type: "fertilizer" },
      { day: 65, title: "Flowering watch", detail: "Keep watering and pest records close during flowering.", type: "watering" },
      { day: 85, title: "Harvest planning", detail: "Line up buyer, packaging, transport, and sales records.", type: "harvest" }
    ]
  },
  {
    crop: "Maize",
    durationDays: 120,
    stages: [
      { name: "Emergence", from: 0, to: 14 },
      { name: "Vegetative", from: 15, to: 55 },
      { name: "Tasseling", from: 56, to: 75 },
      { name: "Grain filling", from: 76, to: 105 },
      { name: "Harvesting", from: 106, to: 120 }
    ],
    tasks: [
      { day: 14, title: "Stand count", detail: "Check germination, gaps, and plant population.", type: "field" },
      { day: 28, title: "Top dressing window", detail: "Record fertilizer cost, quantity, and source.", type: "fertilizer" },
      { day: 60, title: "Tasseling watch", detail: "Watch water stress and pest pressure.", type: "watering" },
      { day: 110, title: "Harvest planning", detail: "Prepare shelling, transport, storage, and sales records.", type: "harvest" }
    ]
  },
  {
    crop: "Onion",
    durationDays: 130,
    transplantWindow: [45, 55],
    stages: [
      { name: "Nursery", from: 0, to: 45 },
      { name: "Transplanting", from: 46, to: 58 },
      { name: "Vegetative", from: 59, to: 85 },
      { name: "Bulbing", from: 86, to: 115 },
      { name: "Harvesting", from: 116, to: 130 }
    ],
    tasks: [
      { day: 50, title: "Transplanting window", detail: "Record spacing, labour, and watering notes.", type: "field" },
      { day: 70, title: "Fertilizer check", detail: "Record fertilizer source, cost, and crop response.", type: "fertilizer" },
      { day: 95, title: "Bulbing watch", detail: "Track watering consistency and disease signs.", type: "watering" },
      { day: 120, title: "Harvest planning", detail: "Prepare curing, packaging, and buyer records.", type: "harvest" }
    ]
  },
  {
    crop: "Soybean",
    durationDays: 110,
    stages: [
      { name: "Emergence", from: 0, to: 14 },
      { name: "Vegetative", from: 15, to: 45 },
      { name: "Flowering", from: 46, to: 70 },
      { name: "Podding", from: 71, to: 95 },
      { name: "Harvesting", from: 96, to: 110 }
    ],
    tasks: [
      { day: 14, title: "Stand count", detail: "Check germination, gaps, and early weed pressure.", type: "field" },
      { day: 45, title: "Flowering watch", detail: "Record pest pressure and crop condition.", type: "chemical" },
      { day: 75, title: "Podding watch", detail: "Track rainfall, disease, and field condition.", type: "field" },
      { day: 100, title: "Harvest planning", detail: "Prepare labour, bags, transport, and sales records.", type: "harvest" }
    ]
  }
];

const defaultPractice: CropPractice = {
  crop: "General crop",
  durationDays: 120,
  stages: [
    { name: "Establishment", from: 0, to: 25 },
    { name: "Vegetative", from: 26, to: 60 },
    { name: "Flowering", from: 61, to: 85 },
    { name: "Maturity", from: 86, to: 110 },
    { name: "Harvesting", from: 111, to: 120 }
  ],
  tasks: [
    { day: 14, title: "Early field check", detail: "Check crop stand, weeds, water stress, and pests.", type: "field" },
    { day: 35, title: "Input check", detail: "Record input use, source, cost, and crop response.", type: "fertilizer" },
    { day: 70, title: "Crop health check", detail: "Review watering, pest, disease, and growth records.", type: "chemical" },
    { day: 105, title: "Harvest planning", detail: "Prepare labour, packaging, transport, and buyer records.", type: "harvest" }
  ]
};

export function getCropPractice(crop: string) {
  return getCropLibraryItem(crop).practice;
}

export function getCropTimeline(crop: string, plantingDate: string, expectedHarvest: string, manualProgress: number, manualStage: string) {
  const practice = getCropPractice(crop);
  const start = parseLocalDate(plantingDate);
  if (!start) {
    return {
      progress: manualProgress,
      stage: manualStage,
      daysAfterPlanting: null,
      durationDays: practice.durationDays,
      progressSource: "manual" as const
    };
  }

  const today = startOfDay(new Date());
  const harvest = parseLocalDate(expectedHarvest);
  const durationDays = harvest ? Math.max(1, diffDays(start, harvest)) : practice.durationDays;
  const daysAfterPlanting = Math.max(0, diffDays(start, today));
  const progress = Math.max(0, Math.min(100, Math.round((daysAfterPlanting / durationDays) * 100)));
  const stage = practice.stages.find((item) => daysAfterPlanting >= item.from && daysAfterPlanting <= item.to)?.name ?? (progress >= 100 ? "Harvesting" : manualStage);

  return {
    progress,
    stage,
    daysAfterPlanting,
    durationDays,
    progressSource: "calendar" as const
  };
}

export function buildFarmCalendar(fields: CropField[], records: FarmRecord[]) {
  const events: FarmCalendarEvent[] = [];

  fields.forEach((field) => {
    const planting = parseLocalDate(field.plantingDate);
    if (!planting) return;
    const practice = getCropPractice(field.crop);
    events.push({
      id: `${field.id}-planting`,
      date: toDateInputValue(planting),
      title: `${field.crop} started`,
      detail: `${field.field} crop cycle started.`,
      field: field.field,
      tone: "green",
      icon: "leaf-outline"
    });

    practice.tasks.forEach((task) => {
      const date = addDays(planting, task.day);
      events.push({
        id: `${field.id}-${task.day}-${task.title}`,
        date: toDateInputValue(date),
        title: task.title,
        detail: task.detail,
        field: field.field,
        tone: task.type === "harvest" ? "teal" : task.type === "chemical" ? "red" : task.type === "watering" ? "amber" : "green",
        icon: task.type === "harvest" ? "cash-outline" : task.type === "chemical" ? "flask-outline" : task.type === "watering" ? "water-outline" : "calendar-outline"
      });
    });

    if (field.expectedHarvest) {
      events.push({
        id: `${field.id}-expected-harvest`,
        date: field.expectedHarvest,
        title: "Expected harvest",
        detail: `Prepare sales and harvest records for ${field.crop}.`,
        field: field.field,
        tone: "teal",
        icon: "cash-outline"
      });
    }
  });

  records.slice(0, 30).forEach((record) => {
    events.push({
      id: `${record.id}-record`,
      date: normalDate(record.date),
      title: record.type,
      detail: `${record.detail}${record.quantity ? ` - ${record.quantity}` : ""}`,
      field: record.field,
      tone: record.type === "Sale" || record.type === "Harvest" ? "teal" : record.type === "Chemical" ? "red" : "amber",
      icon: record.type === "Sale" || record.type === "Harvest" ? "cash-outline" : record.type === "Chemical" ? "flask-outline" : "calendar-outline"
    });
    if (record.type === "Chemical") {
      events.push({
        id: `${record.id}-withholding-check`,
        date: toDateInputValue(addDays(new Date(`${normalDate(record.date)}T00:00:00`), 7)),
        title: "Withholding check",
        detail: `Review harvest safety after ${record.detail}. Follow the product label before picking.`,
        field: record.field,
        tone: "red",
        icon: "flask-outline"
      });
    }
  });

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export function buildPracticeInsights(fields: CropField[], records: FarmRecord[]) {
  const insights: FarmInsight[] = [];

  fields.forEach((field) => {
    const practice = getCropPractice(field.crop);
    const fieldRecords = records.filter((record) => record.field === field.field || record.cropCycleName.includes(field.field));
    const hasFertilizer = fieldRecords.some((record) => record.type === "Fertilizer");
    const hasWater = fieldRecords.some((record) => record.type === "Irrigation");
    const hasSale = fieldRecords.some((record) => record.type === "Sale");

    if (field.progressSource === "calendar" && field.daysAfterPlanting !== null) {
      insights.push({
        id: `${field.id}-calendar-progress`,
        title: `${field.crop} is ${field.daysAfterPlanting} days old`,
        detail: `${field.field} is in the expected ${field.stage.toLowerCase()} stage using the ${practice.crop} benchmark timeline.`,
        tone: "green",
        icon: "checkmark-circle-outline"
      });
    }

    if (field.crop.toLowerCase().includes("abe chilli") && field.daysAfterPlanting !== null) {
      const fertilizerRecord = fieldRecords.find((record) => record.type === "Fertilizer");
      const chemicalRecord = fieldRecords.find((record) => record.type === "Chemical" || record.type === "Treatment");
      const harvestRecord = fieldRecords.find((record) => record.type === "Harvest");
      insights.push({
        id: `${field.id}-abe-guide-active`,
        title: "ABE Chilli guide active",
        detail: `${field.field} is using ABE Chilli guidance for nursery, transplanting, fertilizer, spray, harvest, drying, and storage timing.`,
        tone: "green",
        icon: "checkmark-circle-outline"
      });

      if (fertilizerRecord) {
        const days = daysBetween(field.plantingDate, fertilizerRecord.date);
        if (days !== null) {
          insights.push({
            id: `${field.id}-abe-fertilizer-timing`,
            title: "ABE fertilizer timing recorded",
            detail: `${fertilizerRecord.detail}${fertilizerRecord.quantity ? ` (${fertilizerRecord.quantity})` : ""} was recorded ${days} days after transplanting. The ABE guide starts basal fertilizer at day 4, then top dressing around day 25 and every 14 days.`,
            tone: days >= 3 && days <= 28 ? "green" : "amber",
            icon: days >= 3 && days <= 28 ? "checkmark-circle-outline" : "warning-outline"
          });
        }
      }

      if (field.daysAfterPlanting >= 7 && !chemicalRecord) {
        insights.push({
          id: `${field.id}-abe-chemical-gap`,
          title: "ABE spray record missing",
          detail: "The ABE guide starts fungal prevention around day 7 after transplanting, followed by Neemcide the next day. Record sprays even if the field looks healthy.",
          tone: "amber",
          icon: "warning-outline"
        });
      }

      if (field.daysAfterPlanting >= 90 && !harvestRecord) {
        insights.push({
          id: `${field.id}-abe-harvest-prep`,
          title: "ABE harvest and drying prep",
          detail: "ABE first picking is commonly around 3-4 months. Pick fully red chillies without stalks and plan 5-7 days of drying on raised racks or solar cabinets.",
          tone: "teal",
          icon: "bulb-outline"
        });
      }
    }

    if (field.daysAfterPlanting !== null && field.daysAfterPlanting >= 25 && !hasFertilizer) {
      insights.push({
        id: `${field.id}-fertilizer-gap`,
        title: "No fertilizer record yet",
        detail: `${field.field} has passed an early input window. Record fertilizer use, even if nothing was applied.`,
        tone: "amber",
        icon: "warning-outline"
      });
    }

    if (["Flowering", "Bulbing", "Podding", "Tasseling"].includes(field.stage) && !hasWater) {
      insights.push({
        id: `${field.id}-water-gap`,
        title: "Water records are missing",
        detail: `${field.crop} is at ${field.stage.toLowerCase()} stage. Water or rainfall notes will make the history easier to diagnose later.`,
        tone: "amber",
        icon: "bulb-outline"
      });
    }

    if (field.progress >= 85 && !hasSale) {
      insights.push({
        id: `${field.id}-sales-gap`,
        title: "Prepare sales tracking",
        detail: `${field.field} is nearing harvest. Start recording buyers, prices, transport, and payment status.`,
        tone: "teal",
        icon: "bulb-outline"
      });
    }
  });

  if (!insights.length) {
    insights.push({
      id: "no-insights",
      title: "Add dates to unlock guidance",
      detail: "Planting and harvest dates let Masona Farms compare records against crop timelines.",
      tone: "green",
      icon: "bulb-outline"
    });
  }

  return insights.slice(0, 8);
}

function daysBetween(startDate: string, recordDate: string) {
  const start = parseLocalDate(startDate);
  const record = parseLocalDate(normalDate(recordDate));
  if (!start || !record) return null;
  return diffDays(start, record);
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseLocalDate(value: string) {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  return startOfDay(new Date(parts[0], parts[1] - 1, parts[2]));
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffDays(start: Date, end: Date) {
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / 86400000);
}

function normalDate(value: string) {
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) return toDateInputValue(new Date(parsed));
  return toDateInputValue(new Date());
}
