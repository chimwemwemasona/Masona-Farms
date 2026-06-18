import { baselineCurrentSchemaMigration } from "./001_baseline_current_schema";
import type { Migration } from "./types";

export const migrations: Migration[] = [baselineCurrentSchemaMigration];
