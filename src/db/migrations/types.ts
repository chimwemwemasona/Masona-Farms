export type SqlParameters = (string | number | null)[];

export type SyncDatabase = {
  execSync(sql: string): void;
  runSync(sql: string, params?: SqlParameters): unknown;
  getAllSync<T>(sql: string, params?: SqlParameters): T[];
  getFirstSync<T>(sql: string, params?: SqlParameters): T | null;
  withTransactionSync(callback: () => void): void;
};

export type Migration = {
  id: number;
  name: string;
  up: (db: SyncDatabase) => void;
};
