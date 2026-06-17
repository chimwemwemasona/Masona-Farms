import * as SQLite from "expo-sqlite";
import { getCropTimeline } from "./cropPractices";
import type { CropCycle, CropField, FarmRecord, FieldInput, PhotoInput, PhotoRecord, RecordInput, Reminder, ReminderInput, UserProfile, UserProfileInput } from "./types";

const db = SQLite.openDatabaseSync("masona-farms.db");

type FieldRow = {
  id: string;
  crop: string;
  field: string;
  area: string;
  variety: string | null;
  planting_date: string | null;
  expected_harvest: string | null;
  stage: string;
  progress: number;
  status: CropField["status"];
  accent: string;
};

type RecordRow = {
  id: string;
  type: string;
  field: string;
  crop_cycle_id: string | null;
  crop_cycle_name: string | null;
  detail: string;
  quantity: string | null;
  date: string;
  amount: number;
  icon: FarmRecord["icon"];
  tone: FarmRecord["tone"];
  deleted_at: string | null;
};

type CropCycleRow = {
  id: string;
  field_id: string;
  field: string;
  crop: string;
  variety: string;
  planting_date: string;
  expected_harvest: string;
  stage: string;
  status: CropCycle["status"];
};

type PhotoRow = {
  id: string;
  field: string;
  category: PhotoRecord["category"] | null;
  record_id: string | null;
  record_label: string | null;
  uri: string;
  caption: string;
  created_at: string;
};

type ReminderRow = {
  id: string;
  title: string;
  detail: string;
  field: string;
  due_at: string;
  tone: Reminder["tone"];
  icon: Reminder["icon"];
  notification_id: string | null;
};

type UserProfileRow = {
  id: string;
  farmer_name: string;
  farm_name: string;
  location: string;
  created_at: string;
  onboarding_completed: number;
};

export function initializeDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fields (
      id TEXT PRIMARY KEY NOT NULL,
      crop TEXT NOT NULL,
      field TEXT NOT NULL,
      area TEXT NOT NULL,
      variety TEXT,
      planting_date TEXT,
      expected_harvest TEXT,
      stage TEXT NOT NULL,
      progress INTEGER NOT NULL,
      status TEXT NOT NULL,
      accent TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      field TEXT NOT NULL,
      crop_cycle_id TEXT,
      crop_cycle_name TEXT,
      detail TEXT NOT NULL,
      quantity TEXT,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      icon TEXT NOT NULL,
      tone TEXT NOT NULL,
      deleted_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS crop_cycles (
      id TEXT PRIMARY KEY NOT NULL,
      field_id TEXT NOT NULL,
      field TEXT NOT NULL,
      crop TEXT NOT NULL,
      variety TEXT NOT NULL,
      planting_date TEXT NOT NULL,
      expected_harvest TEXT NOT NULL,
      stage TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY NOT NULL,
      field TEXT NOT NULL,
      category TEXT,
      record_id TEXT,
      record_label TEXT,
      uri TEXT NOT NULL,
      caption TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      detail TEXT NOT NULL,
      field TEXT NOT NULL,
      due_at TEXT NOT NULL,
      tone TEXT NOT NULL,
      icon TEXT NOT NULL,
      notification_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY NOT NULL,
      farmer_name TEXT NOT NULL,
      farm_name TEXT NOT NULL,
      location TEXT NOT NULL,
      created_at TEXT NOT NULL,
      onboarding_completed INTEGER NOT NULL
    );
  `);

  ensureColumn("records", "crop_cycle_id", "TEXT");
  ensureColumn("records", "crop_cycle_name", "TEXT");
  ensureColumn("records", "deleted_at", "TEXT");
  ensureColumn("records", "quantity", "TEXT");
  ensureColumn("fields", "variety", "TEXT");
  ensureColumn("fields", "planting_date", "TEXT");
  ensureColumn("fields", "expected_harvest", "TEXT");
  ensureColumn("photos", "category", "TEXT");
  ensureColumn("photos", "record_id", "TEXT");
  ensureColumn("photos", "record_label", "TEXT");

  const seeded = db.getFirstSync<{ value: string }>("SELECT value FROM app_meta WHERE key = ?", ["seeded"]);
  if (seeded?.value === "true") {
    ensureCropCyclesForExistingFields();
    migrateExistingRecordsToCropCycles();
    return;
  }

  db.runSync("INSERT INTO app_meta (key, value) VALUES (?, ?)", ["seeded", "true"]);
}

export function getFields(): CropField[] {
  return db
    .getAllSync<FieldRow>("SELECT id, crop, field, area, variety, planting_date, expected_harvest, stage, progress, status, accent FROM fields ORDER BY created_at DESC, field ASC")
    .map(mapField);
}

export function getCropCycles(): CropCycle[] {
  return db
    .getAllSync<CropCycleRow>("SELECT id, field_id, field, crop, variety, planting_date, expected_harvest, stage, status FROM crop_cycles WHERE status = ? ORDER BY created_at DESC", ["Active"])
    .map(mapCropCycle);
}

export function getRecords(): FarmRecord[] {
  return db
    .getAllSync<RecordRow>("SELECT id, type, field, crop_cycle_id, crop_cycle_name, detail, quantity, date, amount, icon, tone, deleted_at FROM records WHERE deleted_at IS NULL ORDER BY created_at DESC, date DESC")
    .map((record) => ({
      id: record.id,
      type: record.type,
      field: record.field,
      cropCycleId: record.crop_cycle_id ?? "",
      cropCycleName: record.crop_cycle_name ?? record.field,
      detail: record.detail,
      quantity: record.quantity ?? "",
      date: record.date,
      amount: record.amount,
      icon: record.icon,
      tone: record.tone,
      deletedAt: record.deleted_at
    }));
}

export function getPhotos(): PhotoRecord[] {
  return db
    .getAllSync<PhotoRow>("SELECT id, field, category, record_id, record_label, uri, caption, created_at FROM photos ORDER BY created_at DESC")
    .map((photo) => ({
      id: photo.id,
      field: photo.field,
      category: photo.category ?? "Progress",
      recordId: photo.record_id,
      recordLabel: photo.record_label,
      uri: photo.uri,
      caption: photo.caption,
      createdAt: photo.created_at
    }));
}

export function getReminders(): Reminder[] {
  return db
    .getAllSync<ReminderRow>("SELECT id, title, detail, field, due_at, tone, icon, notification_id FROM reminders ORDER BY due_at ASC")
    .map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      detail: reminder.detail,
      due: formatDueLabel(reminder.due_at),
      tone: reminder.tone,
      icon: reminder.icon
    }));
}

export function getUserProfile(): UserProfile | null {
  const row = db.getFirstSync<UserProfileRow>("SELECT id, farmer_name, farm_name, location, created_at, onboarding_completed FROM user_profiles LIMIT 1");
  if (!row) return null;
  return {
    id: row.id,
    farmerName: row.farmer_name,
    farmName: row.farm_name,
    location: row.location,
    createdAt: row.created_at,
    onboardingCompleted: row.onboarding_completed === 1
  };
}

export function saveUserProfile(input: UserProfileInput): UserProfile {
  const existing = getUserProfile();
  const profile: UserProfile = {
    id: existing?.id ?? "local-profile",
    farmerName: input.farmerName.trim(),
    farmName: input.farmName.trim(),
    location: input.location.trim(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    onboardingCompleted: true
  };
  db.runSync(
    `INSERT INTO user_profiles (id, farmer_name, farm_name, location, created_at, onboarding_completed)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       farmer_name = excluded.farmer_name,
       farm_name = excluded.farm_name,
       location = excluded.location,
       onboarding_completed = excluded.onboarding_completed`,
    [profile.id, profile.farmerName, profile.farmName, profile.location, profile.createdAt, 1]
  );
  return profile;
}

export function resetFarmData() {
  db.withTransactionSync(() => {
    db.runSync("DELETE FROM records");
    db.runSync("DELETE FROM photos");
    db.runSync("DELETE FROM reminders");
    db.runSync("DELETE FROM crop_cycles");
    db.runSync("DELETE FROM fields");
  });
}

export function addField(input: FieldInput): CropField {
  const timeline = getCropTimeline(input.crop, input.plantingDate, input.expectedHarvest, input.progress, input.stage);
  const field: CropField = {
    id: createId(),
    ...input,
    stage: timeline.stage,
    progress: timeline.progress,
    daysAfterPlanting: timeline.daysAfterPlanting,
    progressSource: timeline.progressSource
  };
  db.runSync(
    "INSERT INTO fields (id, crop, field, area, variety, planting_date, expected_harvest, stage, progress, status, accent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [field.id, field.crop, field.field, field.area, field.variety, field.plantingDate, field.expectedHarvest, field.stage, field.progress, field.status, field.accent, new Date().toISOString()]
  );
  insertCropCycleForField(field, new Date().toISOString());
  return field;
}

export function updateField(fieldId: string, input: FieldInput): CropField {
  const existingField = db.getFirstSync<FieldRow>("SELECT id, crop, field, area, variety, planting_date, expected_harvest, stage, progress, status, accent FROM fields WHERE id = ? LIMIT 1", [fieldId]);
  const existingCycle = db.getFirstSync<CropCycleRow>("SELECT id, field_id, field, crop, variety, planting_date, expected_harvest, stage, status FROM crop_cycles WHERE field_id = ? AND status = ? LIMIT 1", [fieldId, "Active"]);
  const timeline = getCropTimeline(input.crop, input.plantingDate, input.expectedHarvest, input.progress, input.stage);
  const field: CropField = {
    id: fieldId,
    ...input,
    stage: timeline.stage,
    progress: timeline.progress,
    daysAfterPlanting: timeline.daysAfterPlanting,
    progressSource: timeline.progressSource
  };

  db.withTransactionSync(() => {
    db.runSync(
      "UPDATE fields SET crop = ?, field = ?, area = ?, variety = ?, planting_date = ?, expected_harvest = ?, stage = ?, progress = ?, status = ?, accent = ? WHERE id = ?",
      [field.crop, field.field, field.area, field.variety, field.plantingDate, field.expectedHarvest, field.stage, field.progress, field.status, field.accent, field.id]
    );
    if (existingCycle) {
      const label = cycleLabel(field.crop, field.field, field.variety);
      db.runSync(
        "UPDATE crop_cycles SET field = ?, crop = ?, variety = ?, planting_date = ?, expected_harvest = ?, stage = ? WHERE id = ?",
        [field.field, field.crop, field.variety, field.plantingDate, field.expectedHarvest, field.stage, existingCycle.id]
      );
      db.runSync("UPDATE records SET field = ?, crop_cycle_name = ? WHERE crop_cycle_id = ?", [field.field, label, existingCycle.id]);
    } else {
      insertCropCycleForField(field, new Date().toISOString());
    }
    if (existingField?.field && existingField.field !== field.field) {
      db.runSync("UPDATE records SET field = ? WHERE field = ?", [field.field, existingField.field]);
      db.runSync("UPDATE photos SET field = ? WHERE field = ?", [field.field, existingField.field]);
      db.runSync("UPDATE reminders SET field = ? WHERE field = ?", [field.field, existingField.field]);
    }
  });

  return field;
}

export function addRecord(input: RecordInput): FarmRecord {
  const record: FarmRecord = {
    id: createId(),
    ...input
  };
  db.runSync(
    "INSERT INTO records (id, type, field, crop_cycle_id, crop_cycle_name, detail, quantity, date, amount, icon, tone, deleted_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [record.id, record.type, record.field, record.cropCycleId, record.cropCycleName, record.detail, record.quantity, record.date, record.amount, record.icon, record.tone, null, new Date().toISOString()]
  );
  return record;
}

export function deleteRecord(recordId: string) {
  db.runSync("UPDATE records SET deleted_at = ? WHERE id = ?", [new Date().toISOString(), recordId]);
}

export function addPhoto(input: PhotoInput): PhotoRecord {
  const photo: PhotoRecord = {
    id: createId(),
    field: input.field,
    category: input.category,
    recordId: input.recordId ?? null,
    recordLabel: input.recordLabel ?? null,
    uri: input.uri,
    caption: input.caption,
    createdAt: new Date().toISOString()
  };
  db.runSync(
    "INSERT INTO photos (id, field, category, record_id, record_label, uri, caption, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [photo.id, photo.field, photo.category, photo.recordId ?? null, photo.recordLabel ?? null, photo.uri, photo.caption, photo.createdAt]
  );
  return photo;
}

export function addReminder(input: ReminderInput): Reminder {
  const reminder = {
    id: createId(),
    ...input
  };
  db.runSync(
    "INSERT INTO reminders (id, title, detail, field, due_at, tone, icon, notification_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [reminder.id, reminder.title, reminder.detail, reminder.field, reminder.dueAt, reminder.tone, reminder.icon, reminder.notificationId ?? null, new Date().toISOString()]
  );
  return {
    id: reminder.id,
    title: reminder.title,
    detail: reminder.detail,
    due: formatDueLabel(reminder.dueAt),
    tone: reminder.tone,
    icon: reminder.icon
  };
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ensureColumn(table: string, column: string, definition: string) {
  const columns = db.getAllSync<{ name: string }>(`PRAGMA table_info(${table})`);
  if (columns.some((item) => item.name === column)) return;
  db.execSync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

function insertCropCycleForField(field: CropField, createdAt: string) {
  const existing = findCycleByFieldName(field.field);
  if (existing) return existing;
  const cycle = {
    id: createId(),
    fieldId: field.id,
    field: field.field,
    crop: field.crop,
    variety: field.variety || "Not set",
    plantingDate: field.plantingDate,
    expectedHarvest: field.expectedHarvest,
    stage: field.stage,
    status: "Active" as const
  };
  db.runSync(
    "INSERT INTO crop_cycles (id, field_id, field, crop, variety, planting_date, expected_harvest, stage, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [cycle.id, cycle.fieldId, cycle.field, cycle.crop, cycle.variety, cycle.plantingDate, cycle.expectedHarvest, cycle.stage, cycle.status, createdAt]
  );
  return {
    ...cycle,
    label: cycleLabel(cycle.crop, cycle.field, cycle.variety)
  };
}

function ensureCropCyclesForExistingFields() {
  const fields = getFields();
  const now = new Date().toISOString();
  fields.forEach((field) => insertCropCycleForField(field, now));
}

function migrateExistingRecordsToCropCycles() {
  const records = db.getAllSync<RecordRow>("SELECT id, type, field, crop_cycle_id, crop_cycle_name, detail, quantity, date, amount, icon, tone, deleted_at FROM records WHERE crop_cycle_id IS NULL OR crop_cycle_name IS NULL");
  records.forEach((record) => {
    const cycle = findCycleForRecordField(record.field) ?? findCycleByFieldName(record.field);
    if (!cycle) return;
    db.runSync("UPDATE records SET crop_cycle_id = ?, crop_cycle_name = ? WHERE id = ?", [cycle.id, cycle.label, record.id]);
  });
}

function mapField(row: FieldRow): CropField {
  const variety = row.variety || "Not set";
  const plantingDate = row.planting_date || "";
  const expectedHarvest = row.expected_harvest || "";
  const timeline = getCropTimeline(row.crop, plantingDate, expectedHarvest, row.progress, row.stage);
  return {
    id: row.id,
    crop: row.crop,
    field: row.field,
    area: row.area,
    variety,
    plantingDate,
    expectedHarvest,
    stage: timeline.stage,
    progress: timeline.progress,
    status: row.status,
    accent: row.accent,
    daysAfterPlanting: timeline.daysAfterPlanting,
    progressSource: timeline.progressSource
  };
}

function findCycleByFieldName(fieldName: string) {
  const row = db.getFirstSync<CropCycleRow>("SELECT id, field_id, field, crop, variety, planting_date, expected_harvest, stage, status FROM crop_cycles WHERE field = ? AND status = ? LIMIT 1", [fieldName, "Active"]);
  return row ? mapCropCycle(row) : undefined;
}

function findCycleForRecordField(recordField: string) {
  const cycles = getCropCycles();
  const normalized = recordField.toLowerCase();
  return cycles.find((cycle) => normalized.includes(cycle.field.toLowerCase()) || normalized.includes(cycle.crop.toLowerCase()));
}

function mapCropCycle(row: CropCycleRow): CropCycle {
  return {
    id: row.id,
    fieldId: row.field_id,
    field: row.field,
    crop: row.crop,
    variety: row.variety,
    plantingDate: row.planting_date,
    expectedHarvest: row.expected_harvest,
    stage: row.stage,
    status: row.status,
    label: cycleLabel(row.crop, row.field, row.variety)
  };
}

function cycleLabel(crop: string, field: string, variety: string) {
  return `${crop} - ${field}${variety && variety !== "Not set" ? ` (${variety})` : ""}`;
}

function formatDueLabel(value: string) {
  const due = new Date(value);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startDue = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const dayDiff = Math.round((startDue - startToday) / 86400000);
  if (dayDiff <= 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";
  return `${dayDiff} days`;
}
