import { ensureColumn } from "./helpers";
import type { Migration } from "./types";

export const baselineCurrentSchemaMigration: Migration = {
  id: 1,
  name: "baseline_current_schema",
  up(db) {
    db.execSync(`
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

    ensureColumn(db, "records", "crop_cycle_id", "TEXT");
    ensureColumn(db, "records", "crop_cycle_name", "TEXT");
    ensureColumn(db, "records", "deleted_at", "TEXT");
    ensureColumn(db, "records", "quantity", "TEXT");
    ensureColumn(db, "fields", "variety", "TEXT");
    ensureColumn(db, "fields", "planting_date", "TEXT");
    ensureColumn(db, "fields", "expected_harvest", "TEXT");
    ensureColumn(db, "photos", "category", "TEXT");
    ensureColumn(db, "photos", "record_id", "TEXT");
    ensureColumn(db, "photos", "record_label", "TEXT");
  }
};
