import {ObjectType, Repository} from "typeorm";
import {PostgreConnection} from "@infra/database/postgree/connection";

export class PostgreRepository {
  private readonly connection = PostgreConnection.getInstance();

  async getRepository<Entity>(
    entity: ObjectType<Entity>,
  ): Promise<Repository<Entity>> {
    return this.connection.getRepository(entity);
  }
}
