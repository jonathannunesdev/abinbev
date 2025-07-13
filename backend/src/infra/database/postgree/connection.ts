import {DataSource, ObjectType, Repository} from "typeorm";
import {DbTransaction} from "@abstract/contracts/db-transactions.contract";
import {PostgreDB} from "./postgree.db";
import {Config, IConfig} from "@config";
import {UserEntity} from "@entities";

export class PostgreConnection implements DbTransaction {
  private static instance?: PostgreConnection;
  private dataSourceInstance?: DataSource;
  private readonly dbConnection = new PostgreDB();
  public config: IConfig = Config;

  private async createDataSource(): Promise<DataSource> {
    if (!this.dataSourceInstance) {
      this.dataSourceInstance = new DataSource({
        type: this.dbConnection.type as "postgres",
        host: this.dbConnection.host,
        port: this.dbConnection.port,
        username: this.dbConnection.user,
        password: this.dbConnection.password,
        database: this.dbConnection.database,
        entities: [UserEntity],
        synchronize: true,
        logging: false,
      });
    }
    return this.dataSourceInstance;
  }

  static getInstance(): PostgreConnection {
    PostgreConnection.instance ??= new PostgreConnection();
    return PostgreConnection.instance;
  }

  async connect(): Promise<void> {
    try {
      const dataSource = await this.createDataSource();
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.dataSourceInstance?.isInitialized) {
      await this.dataSourceInstance.destroy();
      this.dataSourceInstance = undefined;
    }
  }

  /**
   * dataSource
   * @returns DataSource
   */
  async getDataSource(): Promise<DataSource> {
    return this.dataSourceInstance!;
  }

  /**
   * getRepository
   * @param entity Entity class
   * @returns Repository<Entity>
   */
  public async getRepository<Entity>(
    entity: ObjectType<Entity>,
  ): Promise<Repository<Entity>> {
    let repository;
    await this.connect()
      .then(async () => {
        const dataSource = await this.getDataSource();
        repository = dataSource.getRepository(entity);
      })
      .catch((error) => {
        console.error("🤕Error:\n");
        console.error(error);
      });

    return repository;
  }
}
