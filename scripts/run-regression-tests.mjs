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

  vm.runInNewContext(output, { exports: module.exports, module, require: localRequire, Intl, Date, Math, Set, Map, RegExp, String, Number }, { filename: filePath });
  return module.exports;
}

function resolveTsImport(fromDir, specifier) {
  const base = path.resolve(fromDir, specifier);
  const candidates = [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")];
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
    if (/INSERT INTO schema_migrations/i.test(sql)) return this.insertMigration(params);
    if (/INSERT INTO app_meta/i.test(sql)) return this.upsertByKey("app_meta", { key: params[0], value: params[1] });
    if (/INSERT INTO user_profiles/i.test(sql)) return this.upsertById("user_profiles", {
      id: params[0],
      farmer_name: params[1],
      farm_name: params[2],
      location: params[3],
      created_at: params[4],
      onboarding_completed: params[5]
    });
    if (/DELETE FROM records/i.test(sql)) return this.clear("records");
    if (/DELETE FROM photos/i.test(sql)) return this.clear("photos");
    if (/DELETE FROM reminders/i.test(sql)) return this.clear("reminders");
    if (/DELETE FROM crop_cycles/i.test(sql)) return this.clear("crop_cycles");
    if (/DELETE FROM fields/i.test(sql)) return this.clear("fields");
    if (/INSERT INTO fields/i.test(sql)) return this.rows.fields.push({
      id: params[0],
      crop: params[1],
      field: params[2],
      area: params[3],
      variety: params[4],
      planting_date: params[5],
      expected_harvest: params[6],
      stage: params[7],
      progress: params[8],
      status: params[9],
      accent: params[10],
      created_at: params[11]
    });
    if (/UPDATE fields SET/i.test(sql)) return this.updateById("fields", params[10], {
      crop: params[0],
      field: params[1],
      area: params[2],
      variety: params[3],
      planting_date: params[4],
      expected_harvest: params[5],
      stage: params[6],
      progress: params[7],
      status: params[8],
      accent: params[9]
    });
    if (/INSERT INTO crop_cycles/i.test(sql)) {
      const [id, field_id, field, crop, variety, planting_date, expected_harvest, stage, status, created_at] = params;
      this.rows.crop_cycles.push({ id, field_id, field, crop, variety, planting_date, expected_harvest, stage, status, created_at });
      return;
    }
    if (/UPDATE crop_cycles SET/i.test(sql)) return this.updateById("crop_cycles", params[6], {
      field: params[0],
      crop: params[1],
      variety: params[2],
      planting_date: params[3],
      expected_harvest: params[4],
      stage: params[5]
    });
    if (/INSERT INTO records/i.test(sql)) return this.rows.records.push({
      id: params[0],
      type: params[1],
      field: params[2],
      crop_cycle_id: params[3],
      crop_cycle_name: params[4],
      detail: params[5],
      quantity: params[6],
      date: params[7],
      amount: params[8],
      icon: params[9],
      tone: params[10],
      deleted_at: params[11],
      created_at: params[12]
    });
    if (/UPDATE records SET deleted_at/i.test(sql)) return this.updateById("records", params[1], { deleted_at: params[0] });
    if (/UPDATE records SET crop_cycle_id = \?, crop_cycle_name = \? WHERE id = \?/i.test(sql)) return this.updateById("records", params[2], { crop_cycle_id: params[0], crop_cycle_name: params[1] });
    if (/UPDATE records SET field = \?, crop_cycle_name = \? WHERE crop_cycle_id = \?/i.test(sql)) return this.rows.records.forEach((row) => {
      if (row.crop_cycle_id === params[2]) Object.assign(row, { field: params[0], crop_cycle_name: params[1] });
    });
    if (/UPDATE records SET field = \? WHERE field = \?/i.test(sql)) return this.rows.records.forEach((row) => {
      if (row.field === params[1]) row.field = params[0];
    });
    if (/INSERT INTO photos/i.test(sql)) return this.rows.photos.push({
      id: params[0],
      field: params[1],
      category: params[2],
      record_id: params[3],
      record_label: params[4],
      uri: params[5],
      caption: params[6],
      created_at: params[7]
    });
    if (/UPDATE photos SET field = \? WHERE field = \?/i.test(sql)) return this.rows.photos.forEach((row) => {
      if (row.field === params[1]) row.field = params[0];
    });
    if (/INSERT INTO reminders/i.test(sql)) return this.rows.reminders.push({
      id: params[0],
      title: params[1],
      detail: params[2],
      field: params[3],
      due_at: params[4],
      tone: params[5],
      icon: params[6],
      notification_id: params[7],
      created_at: params[8]
    });
    if (/UPDATE reminders SET field = \? WHERE field = \?/i.test(sql)) return this.rows.reminders.forEach((row) => {
      if (row.field === params[1]) row.field = params[0];
    });
    throw new Error(`Unexpected runSync SQL in fake database: ${sql}`);
  }

  getAllSync(sql, params = []) {
    const tableInfoMatch = sql.match(/PRAGMA table_info\((\w+)\)/i);
    if (tableInfoMatch) return [...(this.tables.get(tableInfoMatch[1]) ?? new Set())].map((name) => ({ name }));
    if (/SELECT id(,\s*name)? FROM schema_migrations/i.test(sql)) return this.migrationRows.map((row) => ({ id: row.id, name: row.name }));
    if (/FROM fields ORDER BY created_at DESC, field ASC/i.test(sql)) return cloneRows(this.rows.fields.slice().sort((left, right) => right.created_at.localeCompare(left.created_at) || left.field.localeCompare(right.field)));
    if (/FROM crop_cycles WHERE status = \?/i.test(sql)) return cloneRows(this.rows.crop_cycles.filter((row) => row.status === params[0]));
    if (/FROM records WHERE deleted_at IS NULL/i.test(sql)) return cloneRows(this.rows.records.filter((row) => row.deleted_at === null).sort((left, right) => right.created_at.localeCompare(left.created_at) || right.date.localeCompare(left.date)));
    if (/FROM records WHERE crop_cycle_id IS NULL OR crop_cycle_name IS NULL/i.test(sql)) return cloneRows(this.rows.records.filter((row) => row.crop_cycle_id === null || row.crop_cycle_name === null));
    if (/FROM photos ORDER BY created_at DESC/i.test(sql)) return cloneRows(this.rows.photos.slice().sort((left, right) => right.created_at.localeCompare(left.created_at)));
    if (/FROM reminders ORDER BY due_at ASC/i.test(sql)) return cloneRows(this.rows.reminders.slice().sort((left, right) => left.due_at.localeCompare(right.due_at)));
    throw new Error(`Unexpected getAllSync SQL in fake database: ${sql}`);
  }

  getFirstSync(sql, params = []) {
    if (/SELECT value FROM app_meta WHERE key = \?/i.test(sql)) return cloneRow(this.rows.app_meta.find((row) => row.key === params[0]) ?? null);
    if (/FROM user_profiles LIMIT 1/i.test(sql)) return cloneRow(this.rows.user_profiles[0] ?? null);
    if (/FROM fields WHERE id = \?/i.test(sql)) return cloneRow(this.rows.fields.find((row) => row.id === params[0]) ?? null);
    if (/FROM crop_cycles WHERE field_id = \? AND status = \?/i.test(sql)) return cloneRow(this.rows.crop_cycles.find((row) => row.field_id === params[0] && row.status === params[1]) ?? null);
    if (/FROM crop_cycles WHERE field = \? AND status = \?/i.test(sql)) return cloneRow(this.rows.crop_cycles.find((row) => row.field === params[0] && row.status === params[1]) ?? null);
    return null;
  }

  withTransactionSync(callback) {
    const snapshot = this.snapshot();
    try {
      callback();
    } catch (error) {
      this.restore(snapshot);
      throw error;
    }
  }

  clear(table) {
    this.rows[table] = [];
  }

  insertMigration(params) {
    const [id, name, appliedAt, appVersion] = params;
    if (!this.migrationRows.some((row) => row.id === id)) this.migrationRows.push({ id, name, applied_at: appliedAt, app_version: appVersion });
  }

  upsertByKey(table, nextRow) {
    const index = this.rows[table].findIndex((row) => row.key === nextRow.key);
    if (index >= 0) this.rows[table][index] = { ...this.rows[table][index], ...nextRow };
    else this.rows[table].push(nextRow);
  }

  upsertById(table, nextRow) {
    const index = this.rows[table].findIndex((row) => row.id === nextRow.id);
    if (index >= 0) this.rows[table][index] = { ...this.rows[table][index], ...nextRow };
    else this.rows[table].push(nextRow);
  }

  updateById(table, id, patch) {
    const row = this.rows[table].find((item) => item.id === id);
    if (row) Object.assign(row, patch);
  }

  snapshot() {
    return {
      tables: new Map([...this.tables.entries()].map(([table, columns]) => [table, new Set(columns)])),
      migrationRows: this.migrationRows.map((row) => ({ ...row })),
      rows: Object.fromEntries(Object.entries(this.rows).map(([table, rows]) => [table, rows.map((row) => ({ ...row }))]))
    };
  }

  restore(snapshot) {
    this.tables = snapshot.tables;
    this.migrationRows = snapshot.migrationRows;
    this.rows = snapshot.rows;
  }
}

function freshRepository(db) {
  sqliteMockDatabase = db;
  moduleCache.delete(path.resolve(projectRoot, "src/data/farmRepository.ts"));
  moduleCache.delete(path.resolve(projectRoot, "src/db/database.ts"));
  return loadTs("src/data/farmRepository.ts");
}

function createMigratedDatabase() {
  const db = new FakeDatabase();
  const { runMigrations } = loadTs("src/db/migrate.ts");
  runMigrations(db);
  return db;
}

test("repository saves and reloads profile, fields, cycles, records, photos, and reminders", () => {
  const db = createMigratedDatabase();
  const repository = freshRepository(db);

  repository.initializeDatabase();
  repository.initializeDatabase();
  assert.equal(db.migrationRows.length, 1);
  assert.equal(db.rows.app_meta.filter((row) => row.key === "seeded").length, 1);

  const profile = repository.saveUserProfile({
    farmerName: " Chimwemwe ",
    farmName: " Masona Demo Farm ",
    location: " Lusaka "
  });
  assertJsonEqual(repository.getUserProfile(), {
    ...profile,
    farmerName: "Chimwemwe",
    farmName: "Masona Demo Farm",
    location: "Lusaka",
    onboardingCompleted: true
  });

  const field = repository.addField({
    crop: "Chilli",
    field: "North Field",
    area: "1.5 ha",
    variety: "ABE",
    plantingDate: "2026-01-01",
    expectedHarvest: "2026-04-01",
    stage: "Vegetative",
    progress: 30,
    status: "Good",
    accent: "#07945F"
  });
  const cycles = repository.getCropCycles();
  assert.equal(repository.getFields()[0].field, "North Field");
  assert.equal(cycles.length, 1);
  assert.equal(cycles[0].fieldId, field.id);
  assert.equal(cycles[0].label, "Chilli - North Field (ABE)");
  repository.initializeDatabase();
  repository.initializeDatabase();
  assert.equal(repository.getCropCycles().length, 1);
  assert.equal(db.rows.crop_cycles.filter((row) => row.field_id === field.id && row.status === "Active").length, 1);

  const record = repository.addRecord({
    type: "Fertilizer",
    field: field.field,
    cropCycleId: cycles[0].id,
    cropCycleName: cycles[0].label,
    detail: "Compound D from town shop",
    quantity: "2 bags",
    date: "2026-01-15",
    amount: 640,
    icon: "leaf-outline",
    tone: "green"
  });
  const photo = repository.addPhoto({
    field: field.field,
    category: "Receipt",
    recordId: record.id,
    recordLabel: `${record.type} - ${record.detail}`,
    uri: "file://receipt.jpg",
    caption: "Fertilizer receipt"
  });
  const reminder = repository.addReminder({
    title: "Check fertilizer result",
    detail: "Look at leaf colour",
    field: field.field,
    dueAt: new Date().toISOString(),
    tone: "amber",
    icon: "calendar",
    notificationId: "local-notification"
  });

  assertJsonEqual(repository.getRecords()[0], { ...record, deletedAt: null });
  assertJsonEqual(repository.getPhotos()[0], photo);
  assertJsonEqual(repository.getReminders()[0], {
    id: reminder.id,
    title: "Check fertilizer result",
    detail: "Look at leaf colour",
    due: "Today",
    tone: "amber",
    icon: "calendar"
  });
});

test("repository updates field links and hides soft-archived records", () => {
  const db = createMigratedDatabase();
  const repository = freshRepository(db);

  repository.initializeDatabase();
  const field = repository.addField({
    crop: "Chilli",
    field: "North Field",
    area: "1 ha",
    variety: "ABE",
    plantingDate: "2026-01-01",
    expectedHarvest: "2026-04-01",
    stage: "Vegetative",
    progress: 25,
    status: "Good",
    accent: "#07945F"
  });
  const cycle = repository.getCropCycles()[0];
  const record = repository.addRecord({
    type: "Labor",
    field: "North Field",
    cropCycleId: cycle.id,
    cropCycleName: cycle.label,
    detail: "Weeding",
    quantity: "2 workers",
    date: "2026-01-20",
    amount: 200,
    icon: "leaf-outline",
    tone: "green"
  });
  repository.addPhoto({ field: "North Field", category: "Progress", recordId: null, recordLabel: null, uri: "file://progress.jpg", caption: "Progress" });
  repository.addReminder({ title: "Water tomorrow", detail: "Check soil", field: "North Field", dueAt: new Date().toISOString(), tone: "amber", icon: "water" });

  repository.updateField(field.id, {
    crop: "Chilli",
    field: "East Field",
    area: "1 ha",
    variety: "ABE",
    plantingDate: "2026-01-01",
    expectedHarvest: "2026-04-01",
    stage: "Flowering",
    progress: 55,
    status: "Watch",
    accent: "#EF8200"
  });
  assert.equal(repository.getFields().find((item) => item.id === field.id)?.field, "East Field");
  assert.equal(repository.getCropCycles()[0].label, "Chilli - East Field (ABE)");
  assert.equal(repository.getRecords()[0].field, "East Field");
  assert.equal(repository.getRecords()[0].cropCycleName, "Chilli - East Field (ABE)");
  assert.equal(repository.getPhotos()[0].field, "East Field");

  repository.deleteRecord(record.id);
  assert.equal(repository.getRecords().length, 0);
  assert.ok(db.rows.records.find((row) => row.id === record.id).deleted_at, "record should remain soft archived");
});

test("current report rules preserve sale, harvest, payment, and archive behavior", () => {
  const { calculateFarmTotals, calculateFieldReportValues, getBestCrop } = loadTs("src/reports/currentReportRules.ts");
  const fields = [reportField({ crop: "Chilli", field: "East Field", area: "2 ha" })];
  const visibleRecords = [
    reportRecord({ type: "Sale", amount: 1500 }),
    reportRecord({ type: "Fertilizer", amount: 320 }),
    reportRecord({ type: "Labor", amount: 180 }),
    reportRecord({ type: "Harvest", amount: 999 }),
    reportRecord({ type: "Payment", amount: 400 })
  ];
  const archivedRecord = reportRecord({ id: "archived", type: "Chemical", amount: 250, deletedAt: "2026-02-01T00:00:00.000Z" });
  const activeRecords = [...visibleRecords, archivedRecord].filter((record) => !record.deletedAt);

  const totals = calculateFarmTotals(activeRecords);

  assertJsonEqual(totals, { revenue: 1500, expenses: 900, profit: 600 });
  assertJsonEqual(calculateFieldReportValues(totals, fields), { fieldCost: 900, costPerHa: 450 });
  assert.equal(getBestCrop(fields, activeRecords).name, "Chilli");
  assert.match(getBestCrop(fields, activeRecords).detail, /600/);
});

test("current report export sources preserve rows, escaping, and plain totals", () => {
  const { buildAgronomistSummary, buildReportCsv, buildReportHtml, buildShareReport, calculateFarmTotals, calculateFieldReportValues, getBestCrop } = loadTs("src/reports/currentReportRules.ts");
  const fields = [reportField({ crop: "Chilli", field: "East Field", area: "2 ha", variety: "ABE" })];
  const records = [
    reportRecord({ type: "Sale", detail: "Sold to \"Market\"", quantity: "20 kg", amount: 1500 }),
    reportRecord({ type: "Payment", detail: "Buyer paid <cash>", quantity: "Partial", amount: 400 })
  ];
  const totals = calculateFarmTotals(records);
  const { fieldCost, costPerHa } = calculateFieldReportValues(totals, fields);
  const bestCrop = getBestCrop(fields, records);
  const agronomistSummary = buildAgronomistSummary(fields, records);

  const share = buildShareReport({ totals, fields, records, bestCrop, fieldCost, costPerHa, agronomistSummary });
  assert.match(share, /Revenue: .*\b1,500/);
  assert.match(share, /Expenses: .*\b400/);
  assert.match(share, /Net profit: .*\b1,100/);
  assert.match(share, /- Chilli East Field: 2 ha, Flowering, Good/);
  assert.match(share, /- Sale: Chilli - East Field \(ABE\), Sold to "Market", 20 kg, .*\b1,500/);
  assert.match(share, /- Payment: Chilli - East Field \(ABE\), Buyer paid <cash>, Partial, .*\b400/);

  const html = buildReportHtml({
    totals,
    fields,
    records,
    bestCrop,
    fieldCost,
    costPerHa,
    agronomistSummary,
    insights: [{ title: "Review <cost>", detail: "Check \"payment\" status" }]
  });
  assert.match(html, /Total earned/);
  assert.match(html, /Sold to &quot;Market&quot;/);
  assert.match(html, /Buyer paid &lt;cash&gt;/);
  assert.match(html, /Review &lt;cost&gt;/);
  assert.match(html, /<td>Sale<\/td>/);
  assert.match(html, /<td>Payment<\/td>/);

  const csv = buildReportCsv(fields, records);
  assert.match(csv, /^"Section","Date","Type","Field","Crop","Crop cycle","Detail","Quantity","Amount"/);
  assert.match(csv, /"Field","2026-01-01","Crop cycle","East Field","Chilli","Chilli - East Field","Flowering","ABE",""/);
  assert.match(csv, /"Record","2026-02-01","Sale","East Field","","Chilli - East Field \(ABE\)","Sold to ""Market""","20 kg","1500"/);
  assert.match(csv, /"Record","2026-02-01","Payment","East Field","","Chilli - East Field \(ABE\)","Buyer paid <cash>","Partial","400"/);
});

function reportField(overrides = {}) {
  return {
    id: "field-1",
    crop: "Chilli",
    field: "East Field",
    area: "1 ha",
    variety: "ABE",
    plantingDate: "2026-01-01",
    expectedHarvest: "2026-04-01",
    stage: "Flowering",
    progress: 55,
    status: "Good",
    accent: "#07945F",
    daysAfterPlanting: 32,
    progressSource: "manual",
    ...overrides
  };
}

function reportRecord(overrides = {}) {
  return {
    id: overrides.id ?? `${overrides.type ?? "record"}-${overrides.amount ?? 0}`,
    type: "Fertilizer",
    field: "East Field",
    cropCycleId: "cycle-1",
    cropCycleName: "Chilli - East Field (ABE)",
    detail: "Record detail",
    quantity: "1 unit",
    date: "2026-02-01",
    amount: 0,
    icon: "leaf-outline",
    tone: "green",
    deletedAt: null,
    ...overrides
  };
}

function assertJsonEqual(actual, expected) {
  assert.deepEqual(JSON.parse(JSON.stringify(actual)), JSON.parse(JSON.stringify(expected)));
}

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function cloneRow(row) {
  return row ? { ...row } : null;
}
