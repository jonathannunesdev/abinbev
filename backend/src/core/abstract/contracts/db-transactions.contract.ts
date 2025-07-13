export interface DbTransaction {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
