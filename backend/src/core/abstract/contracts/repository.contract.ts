export abstract class IRepository<T> {
  abstract create(
    item: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
  ): Promise<T>;
  abstract update(id: number, item: Partial<T>): Promise<T>;
  abstract getById(id: number): Promise<T | null>;
  abstract getAll(): Promise<T[]>;
  abstract delete(id: number): Promise<void>;
}
