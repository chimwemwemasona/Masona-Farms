import { migrations } from "./migrations";
import type { Migration, SyncDatabase } from "./migrations/types";

type MigrationRow = {
  id: number;
};

type RunMigrationOptions = {
  appVersion?: string | null;
  migrationPlan?: Migration[];
};

export function runMigrations(db: SyncDatabase, options: RunMigrationOptions = {}) {
  db.execSync("PRAGMA journal_mode = WAL;");
  ensureMigrationTable(db);

  const applied = new Set(db.getAllSync<MigrationRow>("SELECT id FROM schema_migrations").map((row) => row.id));
  const migrationPlan = options.migrationPlan ?? migrations;
  migrationPlan
    .slice()
    .sort((left, right) => left.id - right.id)
    .forEach((migration) => {
      if (applied.has(migration.id)) return;
      db.withTransactionSync(() => {
        migration.up(db);
        db.runSync("INSERT INTO schema_migrations (id, name, applied_at, app_version) VALUES (?, ?, ?, ?)", [
          migration.id,
          migration.name,
          new Date().toISOString(),
          options.appVersion ?? null
        ]);
      });
      applied.add(migration.id);
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
