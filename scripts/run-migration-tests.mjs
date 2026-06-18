import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..");
const require = createRequire(import.meta.url);
const moduleCache = new Map();
let sqliteMockDatabase = null;

function loadTs(relativePath) {
  const filePath = path.resolve(projectRoot, relativePath);
  if (moduleCache.has(filePath)) return moduleCache.get(filePath).exports;

  const source = fs.readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const module = { exports: {} };
  moduleCache.set(filePath, module);

  const localRequire = (specifier) => {
    if (specifier === "expo-sqlite") {
      return {
        openDatabaseSync() {
          if (!sqliteMockDatabase) throw new Error("No SQLite mock database configured");
          return sqliteMockDatabase;
        }
      };
    }
    if (!specifier.startsWith(".")) return require(specifier);
    const resolved = resolveTsImport(path.dirname(filePath), specifier);
    return loadTs(path.relative(projectRoot, resolved));
  };

  vm.runInNewContext(output, { exports: module.exports, module, require: localRequire }, { filename: filePath });
  return module.exports;
}

function resolveTsImport(fromDir, specifier) {
  const base = path.resolve(fromDir, specifier);
  const candidates = [`${base}.ts`, path.join(base, "index.ts")];
  const match = candidates.find((candidate) => fs.existsSync(candidate));
  if (!match) throw new Error(`Cannot resolve ${specifier} from ${fromDir}`);
  return match;
}

class FakeDatabase {
  constructor() {
    this.tables = new Map();
    this.migrationRows = [];
    this.rows = {
      app_meta: [],
      fields: [],
      crop_cycles: [],
      records: [],
      photos: [],
      reminders: [],
      user_profiles: []
    };
  }

  execSync(sql) {
    for (const statement of sql.split(";").map((item) => item.trim()).filter(Boolean)) {
      if (statement.startsWith("PRAGMA")) continue;
      const createMatch = statement.match(/CREATE TABLE IF NOT EXISTS\s+(\w+)\s*\(([\s\S]*)\)$/i);
      if (createMatch) {
        const [, tableName, columnBlock] = createMatch;
        if (!this.tables.has(tableName)) this.tables.set(tableName, new Set());
        const columns = this.tables.get(tableName);
        columnBlock
          .split(",")
          .map((line) => line.trim().match(/^(\w+)/)?.[1])
          .filter(Boolean)
          .forEach((column) => columns.add(column));
        continue;
      }
      const alterMatch = statement.match(/ALTER TABLE\s+(\w+)\s+ADD COLUMN\s+(\w+)/i);
      if (alterMatch) {
        this.tables.get(alterMatch[1])?.add(alterMatch[2]);
        continue;
      }
      throw new Error(`Unexpected SQL in fake database: ${statement}`);
    }
  }

  runSync(sql, params = []) {
    if (/INSERT INTO schema_migrations/i.test(sql)) {
      const [id, name, appliedAt, appVersion] = params;
      if (!this.migrationRows.some((row) => row.id === id)) {
        this.migrationRows.push({ id, name, applied_at: appliedAt, app_version: appVersion });
      }
      return;
    }
    if (/UPDATE records SET crop_cycle_id/i.test(sql)) return;
    if (/INSERT INTO crop_cycles/i.test(sql)) return;
    throw new Error(`Unexpected runSync SQL in fake database: ${sql}`);
  }

  getAllSync(sql, params = []) {
    const tableInfoMatch = sql.match(/PRAGMA table_info\((\w+)\)/i);
    if (tableInfoMatch) {
      return [...(this.tables.get(tableInfoMatch[1]) ?? new Set())].map((name) => ({ name }));
    }
    if (/SELECT id FROM schema_migrations/i.test(sql)) {
      return this.migrationRows.map((row) => ({ id: row.id }));
    }
    if (/FROM fields ORDER BY created_at DESC, field ASC/i.test(sql)) return this.rows.fields;
    if (/FROM crop_cycles WHERE status = \?/i.test(sql)) return this.rows.crop_cycles.filter((row) => row.status === params[0]);
    if (/FROM records WHERE deleted_at IS NULL/i.test(sql)) return this.rows.records.filter((row) => row.deleted_at === null);
    if (/FROM records WHERE crop_cycle_id IS NULL OR crop_cycle_name IS NULL/i.test(sql)) {
      return this.rows.records.filter((row) => row.crop_cycle_id === null || row.crop_cycle_name === null);
    }
    if (/FROM photos ORDER BY created_at DESC/i.test(sql)) return this.rows.photos;
    if (/FROM reminders ORDER BY due_at ASC/i.test(sql)) return this.rows.reminders;
    throw new Error(`Unexpected getAllSync SQL in fake database: ${sql}`);
  }

  getFirstSync(sql, params = []) {
    if (/SELECT value FROM app_meta WHERE key = \?/i.test(sql)) {
      return this.rows.app_meta.find((row) => row.key === params[0]) ?? null;
    }
    if (/FROM user_profiles LIMIT 1/i.test(sql)) return this.rows.user_profiles[0] ?? null;
    if (/FROM crop_cycles WHERE field = \? AND status = \?/i.test(sql)) {
      return this.rows.crop_cycles.find((row) => row.field === params[0] && row.status === params[1]) ?? null;
    }
    return null;
  }

  withTransactionSync(callback) {
    const tableSnapshot = cloneTables(this.tables);
    const migrationSnapshot = this.migrationRows.map((row) => ({ ...row }));
    try {
      callback();
    } catch (error) {
      this.tables = tableSnapshot;
      this.migrationRows = migrationSnapshot;
      throw error;
    }
  }
}

function cloneTables(tables) {
  return new Map([...tables.entries()].map(([table, columns]) => [table, new Set(columns)]));
}

const { runMigrations } = loadTs("src/db/migrate.ts");

test("fresh database gets current tables and one baseline migration row", () => {
  const db = new FakeDatabase();
  runMigrations(db);

  ["app_meta", "fields", "crop_cycles", "records", "photos", "reminders", "user_profiles", "schema_migrations"].forEach((table) => {
    assert.ok(db.tables.has(table), `${table} should exist`);
  });
  assert.equal(db.migrationRows.length, 1);
  assert.equal(db.migrationRows[0].id, 1);
});

test("existing current database is safely marked as baseline once", () => {
  const db = new FakeDatabase();
  db.tables.set("records", new Set(["id", "type", "field", "detail", "date", "amount", "icon", "tone", "created_at"]));
  db.tables.set("fields", new Set(["id", "crop", "field", "area", "stage", "progress", "status", "accent", "created_at"]));
  db.tables.set("photos", new Set(["id", "field", "uri", "caption", "created_at"]));

  runMigrations(db);
  runMigrations(db);

  assert.equal(db.migrationRows.length, 1);
  assert.ok(db.tables.get("records").has("deleted_at"));
  assert.ok(db.tables.get("records").has("crop_cycle_id"));
  assert.ok(db.tables.get("fields").has("variety"));
  assert.ok(db.tables.get("photos").has("record_label"));
});

test("failed migration rolls back the attempted migration row", () => {
  const db = new FakeDatabase();
  const failingMigration = {
    id: 9,
    name: "failing_change",
    up() {
      throw new Error("boom");
    }
  };

  assert.throws(() => runMigrations(db, { migrationPlan: [failingMigration] }), /boom/);
  assert.equal(db.migrationRows.length, 0);
});

test("repository reads preserve existing data and hide soft-archived records", () => {
  const db = createSeededCurrentDatabase();
  sqliteMockDatabase = db;
  moduleCache.delete(path.resolve(projectRoot, "src/data/farmRepository.ts"));

  const repository = loadTs("src/data/farmRepository.ts");
  repository.initializeDatabase();

  assert.equal(db.migrationRows.length, 1);
  assert.equal(repository.getUserProfile().farmName, "Masona Demo Farm");
  assert.equal(repository.getFields().length, 1);
  assert.equal(repository.getCropCycles().length, 1);
  assert.deepEqual(repository.getRecords().map((record) => record.id), ["visible-record"]);
  assert.equal(repository.getPhotos().length, 1);
  assert.equal(repository.getReminders().length, 1);
});

function createSeededCurrentDatabase() {
  const db = new FakeDatabase();
  db.rows.app_meta.push({ key: "seeded", value: "true" });
  db.rows.fields.push({
    id: "field-1",
    crop: "Chilli",
    field: "Field 1",
    area: "1 ha",
    variety: "ABE",
    planting_date: "2026-01-01",
    expected_harvest: "2026-04-01",
    stage: "Vegetative",
    progress: 45,
    status: "Good",
    accent: "#168a4a"
  });
  db.rows.crop_cycles.push({
    id: "cycle-1",
    field_id: "field-1",
    field: "Field 1",
    crop: "Chilli",
    variety: "ABE",
    planting_date: "2026-01-01",
    expected_harvest: "2026-04-01",
    stage: "Vegetative",
    status: "Active"
  });
  db.rows.records.push(
    {
      id: "visible-record",
      type: "Fertilizer",
      field: "Field 1",
      crop_cycle_id: "cycle-1",
      crop_cycle_name: "Chilli - Field 1 (ABE)",
      detail: "Applied basal dressing",
      quantity: "2 bags",
      date: "2026-01-20",
      amount: 450,
      icon: "leaf",
      tone: "green",
      deleted_at: null
    },
    {
      id: "archived-record",
      type: "Chemical",
      field: "Field 1",
      crop_cycle_id: "cycle-1",
      crop_cycle_name: "Chilli - Field 1 (ABE)",
      detail: "Old spray",
      quantity: "100 ml",
      date: "2026-01-22",
      amount: 150,
      icon: "flask",
      tone: "red",
      deleted_at: "2026-02-01T00:00:00.000Z"
    }
  );
  db.rows.photos.push({
    id: "photo-1",
    field: "Field 1",
    category: "Progress",
    record_id: "visible-record",
    record_label: "Fertilizer",
    uri: "file://photo.jpg",
    caption: "Healthy plants",
    created_at: "2026-01-21T00:00:00.000Z"
  });
  db.rows.reminders.push({
    id: "reminder-1",
    title: "Check field",
    detail: "Look at leaves",
    field: "Field 1",
    due_at: new Date().toISOString(),
    tone: "amber",
    icon: "calendar",
    notification_id: null
  });
  db.rows.user_profiles.push({
    id: "local-profile",
    farmer_name: "Chimwemwe",
    farm_name: "Masona Demo Farm",
    location: "Lusaka",
    created_at: "2026-01-01T00:00:00.000Z",
    onboarding_completed: 1
  });
  return db;
}
