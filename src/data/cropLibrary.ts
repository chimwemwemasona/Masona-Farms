import type { CropPractice } from "./cropPractices";

export type CropLibraryItem = {
  id: string;
  name: string;
  displayName: string;
  defaultVariety: string;
  varieties: string[];
  defaultAreaUnit: string;
  dateLabel: string;
  accent: string;
  practice: CropPractice;
};

export const cropLibrary: CropLibraryItem[] = [
  {
    id: "abe-chilli",
    name: "ABE Chilli",
    displayName: "ABE Chilli",
    defaultVariety: "African Bird's Eye",
    varieties: ["African Bird's Eye", "ABE Chilli"],
    defaultAreaUnit: "1.0 ha",
    dateLabel: "Transplanting date",
    accent: "#c9242f",
    practice: {
      crop: "ABE Chilli",
      durationDays: 120,
      transplantWindow: [42, 56],
      stages: [
        { name: "Nursery", from: -56, to: -1 },
        { name: "Transplanting", from: 0, to: 7 },
        { name: "Establishment", from: 8, to: 28 },
        { name: "Vegetative", from: 29, to: 60 },
        { name: "Flowering", from: 61, to: 90 },
        { name: "First picking", from: 91, to: 120 },
        { name: "Continuous harvest", from: 121, to: 1095 }
      ],
      tasks: [
        { day: -56, title: "Start nursery", detail: "Prepare raised nursery beds, treat soil, sow seed, mulch, and water morning and evening.", type: "field" },
        { day: -28, title: "Start hardening seedlings", detail: "Begin hardening seedlings around 4 weeks before transplanting if using trays.", type: "field" },
        { day: -4, title: "Pre-transplant field prep", detail: "Apply manure and agricultural lime, prepare holes, mix well with soil, and water daily.", type: "field" },
        { day: 0, title: "Transplant ABE Chilli", detail: "Use 6-8 week seedlings, plant late afternoon, keep 1m between plants and rows, and record labour.", type: "field" },
        { day: 0, title: "Soil pest drench", detail: "Apply recommended soil drench for cutworms, termites, and nematodes on transplanting day.", type: "chemical" },
        { day: 4, title: "Basal fertilizer", detail: "Apply Compound WMB or Compound D at 10 g per plant once for early establishment.", type: "fertilizer" },
        { day: 7, title: "Fungicide spray", detail: "Apply Mancolaxyl for fungal prevention and record dosage, source, and cost.", type: "chemical" },
        { day: 8, title: "Neemcide spray", detail: "Apply Neemcide for insects and nematodes, then record observed crop response.", type: "chemical" },
        { day: 25, title: "Top dressing", detail: "Apply Greensulf at 10 g per plant, then repeat every 14 days for 3-4 rounds.", type: "fertilizer" },
        { day: 28, title: "Growth booster", detail: "Apply approved booster or Green Sulphur and repeat every 2 weeks where needed.", type: "fertilizer" },
        { day: 30, title: "Monthly soil drench", detail: "Apply Magnesium Nitrate and Potassium Nitrate as a monthly soil drench.", type: "fertilizer" },
        { day: 42, title: "Foliar feed", detail: "Apply Omniboost, Kelp-Max, and Borex as a foliar spray, then repeat every 14 days.", type: "fertilizer" },
        { day: 60, title: "Scout field", detail: "Walk the field for pests, disease, weeds, nutrient gaps, and water stress.", type: "field" },
        { day: 90, title: "Prepare first picking", detail: "Line up labour, drying racks, poly-sacks, bags, and buyer records.", type: "harvest" },
        { day: 105, title: "First ABE Chilli picking", detail: "Pick fully red ripe chillies without stalks and start drying records.", type: "harvest" },
        { day: 110, title: "Drying check", detail: "Dry on raised racks or solar cabinets for 5-7 days and avoid metal sheets.", type: "harvest" }
      ]
    }
  },
  {
    id: "tomato",
    name: "Tomato",
    displayName: "Tomato",
    defaultVariety: "Not set",
    varieties: ["Not set", "Roma", "Tengeru"],
    defaultAreaUnit: "1.0 ha",
    dateLabel: "Transplanting date",
    accent: "#e94a38",
    practice: {
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
    }
  },
  {
    id: "maize",
    name: "Maize",
    displayName: "Maize",
    defaultVariety: "Not set",
    varieties: ["Not set"],
    defaultAreaUnit: "1.0 ha",
    dateLabel: "Sowing date",
    accent: "#e0b537",
    practice: {
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
    }
  },
  {
    id: "onion",
    name: "Onion",
    displayName: "Onion",
    defaultVariety: "Not set",
    varieties: ["Not set"],
    defaultAreaUnit: "1.0 ha",
    dateLabel: "Transplanting date",
    accent: "#8a4a36",
    practice: {
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
    }
  },
  {
    id: "soybean",
    name: "Soybean",
    displayName: "Soybean",
    defaultVariety: "Not set",
    varieties: ["Not set"],
    defaultAreaUnit: "1.0 ha",
    dateLabel: "Sowing date",
    accent: "#65a744",
    practice: {
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
  },
  {
    id: "general-crop",
    name: "General crop",
    displayName: "Other crop",
    defaultVariety: "Not set",
    varieties: ["Not set"],
    defaultAreaUnit: "1.0 ha",
    dateLabel: "Planting date",
    accent: "#07945f",
    practice: {
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
    }
  }
];

export function getCropLibraryItem(cropName: string) {
  const normalized = cropName.toLowerCase();
  return cropLibrary.find((item) => item.name.toLowerCase() === normalized || item.displayName.toLowerCase() === normalized) ?? cropLibrary.find((item) => normalized.includes(item.name.toLowerCase())) ?? cropLibrary[cropLibrary.length - 1];
}

export function getCropById(cropId: string) {
  return cropLibrary.find((item) => item.id === cropId) ?? cropLibrary[0];
}
