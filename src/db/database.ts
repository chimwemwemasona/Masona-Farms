import * as SQLite from "expo-sqlite";
import type { SyncDatabase } from "./migrations/types";

export const databaseName = "masona-farms.db";

export function openFarmDatabase(): SyncDatabase {
  return SQLite.openDatabaseSync(databaseName) as unknown as SyncDatabase;
}
