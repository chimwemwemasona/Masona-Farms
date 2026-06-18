import { migrations } from "./migrations";
import type { Migration, SyncDatabase } from "./migrations/types";

type MigrationRow = {
  id: number;
  name: string;
};

type RunMigrationOptions = {
  appVersion?: string | null;
  migrationPlan?: Migration[];
};

export function runMigrations(db: SyncDatabase, options: RunMigrationOptions = {}) {
  const migrationPlan = options.migrationPlan ?? migrations;
  validateMigrationPlan(migrationPlan);

  db.execSync("PRAGMA journal_mode = WAL;");
  ensureMigrationTable(db);

  const appliedRows = db.getAllSync<MigrationRow>("SELECT id, name FROM schema_migrations");
  const applied = new Map(appliedRows.map((row) => [row.id, row.name]));
  migrationPlan
    .slice()
    .sort((left, right) => left.id - right.id)
    .forEach((migration) => {
      const appliedName = applied.get(migration.id);
      if (appliedName) {
        if (appliedName !== migration.name) {
          throw new Error(`Migration ${migration.id} was already applied as ${appliedName}, not ${migration.name}.`);
        }
        return;
      }
      db.withTransactionSync(() => {
        migration.up(db);
        db.runSync("INSERT INTO schema_migrations (id, name, applied_at, app_version) VALUES (?, ?, ?, ?)", [
          migration.id,
          migration.name,
          new Date().toISOString(),
          options.appVersion ?? null
        ]);
      });
      applied.set(migration.id, migration.name);
    });
}

function validateMigrationPlan(migrationPlan: Migration[]) {
  const ids = new Set<number>();
  migrationPlan.forEach((migration) => {
    if (ids.has(migration.id)) {
      throw new Error(`Duplicate migration id: ${migration.id}`);
    }
    ids.add(migration.id);
  });
}

function ensureMigrationTable(db: SyncDatabase) {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL,
      app_version TEXT
    );
  `);
}
