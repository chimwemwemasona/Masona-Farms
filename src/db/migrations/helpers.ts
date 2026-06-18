import type { SyncDatabase } from "./types";

export function ensureColumn(db: SyncDatabase, table: string, column: string, definition: string) {
  const columns = db.getAllSync<{ name: string }>(`PRAGMA table_info(${table})`);
  if (columns.some((item) => item.name === column)) return;
  db.execSync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}
