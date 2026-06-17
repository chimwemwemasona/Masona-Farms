import type { Ionicons } from "@expo/vector-icons";

export type FieldStatus = "Healthy" | "Good" | "Watch";

export type CropField = {
  id: string;
  crop: string;
  field: string;
  area: string;
  variety: string;
  plantingDate: string;
  expectedHarvest: string;
  stage: string;
  progress: number;
  status: FieldStatus;
  accent: string;
  daysAfterPlanting: number | null;
  progressSource: "calendar" | "manual";
};

export type CropCycle = {
  id: string;
  fieldId: string;
  field: string;
  crop: string;
  variety: string;
  plantingDate: string;
  expectedHarvest: string;
  stage: string;
  status: "Active" | "Completed";
  label: string;
};

export type Reminder = {
  id: string;
  title: string;
  detail: string;
  due: string;
  tone: "red" | "amber";
  icon: "sprinkler" | "calendar" | "water";
};

export type FarmRecord = {
  id: string;
  type: string;
  field: string;
  cropCycleId: string;
  cropCycleName: string;
  detail: string;
  quantity: string;
  date: string;
  amount: number;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "green" | "blue" | "amber";
  deletedAt?: string | null;
};

export type FarmTotals = {
  revenue: number;
  expenses: number;
  profit: number;
};

export type FieldInput = {
  crop: string;
  field: string;
  area: string;
  variety: string;
  plantingDate: string;
  expectedHarvest: string;
  stage: string;
  progress: number;
  status: FieldStatus;
  accent: string;
};

export type RecordInput = {
  type: string;
  field: string;
  cropCycleId: string;
  cropCycleName: string;
  detail: string;
  quantity: string;
  date: string;
  amount: number;
  icon: FarmRecord["icon"];
  tone: FarmRecord["tone"];
};

export type PhotoRecord = {
  id: string;
  field: string;
  category: "Progress" | "Problem" | "Receipt" | "General";
  recordId?: string | null;
  recordLabel?: string | null;
  uri: string;
  caption: string;
  createdAt: string;
};

export type PhotoInput = {
  field: string;
  category: PhotoRecord["category"];
  recordId?: string | null;
  recordLabel?: string | null;
  uri: string;
  caption: string;
};

export type ReminderInput = {
  title: string;
  detail: string;
  field: string;
  dueAt: string;
  tone: Reminder["tone"];
  icon: Reminder["icon"];
  notificationId?: string;
};

export type UserProfile = {
  id: string;
  farmerName: string;
  farmName: string;
  location: string;
  createdAt: string;
  onboardingCompleted: boolean;
};

export type UserProfileInput = {
  farmerName: string;
  farmName: string;
  location: string;
};
