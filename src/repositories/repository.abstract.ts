import { Pool } from 'pg';
import { WalletEntity } from 'database/entitys/wallet.entity';
import { AnyEntity, EntityListType, TableList, TableName, UpdateFieldsParamsType } from 'types/repository.type';
import { configEnv } from 'utils/env';

export abstract class RepositoryFactory {
  protected _db: Pool;

  constructor() {
    this._db = new Pool({
      user: configEnv('POSTGRES_USERNAME'),
      database: configEnv('POSTGRES_DATABASE_NAME'),
      password: configEnv('POSTGRES_PASSWORD'),
      port: +configEnv('POSTGRES_PORT'),
      host: configEnv('POSTGRES_HOST'),
      query_timeout: 1000,
      connectionTimeoutMillis: 2000,
    });
  }

  protected async _create(entity: AnyEntity, tableName: TableName): Promise<void> {
    const { id, ...insertData } = entity;
    await this._db.query(
      `insert into ${TableList[tableName]} (${Object.keys(insertData).toString()}) values(${Object.keys(insertData)
        .flatMap((key, index) => `$${index + 1}`)
        .toString()})`,
      [...Object.values(insertData)],
    );
  }

  protected async _read(id: number, tableName: TableName): Promise<AnyEntity | AnyEntity[]> {
    const keysColumn = Object.keys(this._getEntityForRead<AnyEntity>(TableList[tableName], {} as AnyEntity)).toString();
    const data = (
      await this._db.query<AnyEntity>(`select ${keysColumn} from ${TableList[tableName]} where id = $1`, [id])
    ).rows;

    if (data.length > 1) {
      const mappingEntitys = data.flatMap((data) => this._getEntityForRead<AnyEntity>(tableName, data));
      return mappingEntitys;
    }

    const mappingEntity = this._getEntityForRead<AnyEntity>(tableName, data[0]);
    return mappingEntity;
  }

  protected async _update(entity: AnyEntity, tableName: TableName): Promise<void> {
    const { id, ...entityData } = entity;
    await this._updateColumn({
      id,
      fields: Object.keys(entityData),
      values: Object.values(entityData),
      tableName: TableList[tableName],
    });
  }

  protected async _delete(id: number, tableName: TableName): Promise<void> {
    await this._updateColumn({
      id,
      fields: ['is_delete'],
      values: [1],
      tableName: TableList[tableName],
    });
  }

  protected async _updateColumn({ id, fields, values, tableName }: UpdateFieldsParamsType): Promise<void> {
    await this._db.query(
      `update public.${TableList[tableName]} set ${fields
        .flatMap((field, index) => `${field} = $${index + 1}`)
        .toString()} where id = $${fields.length + 1}`,
      [...values, id],
    );
  }

  protected async customQuery(query: string, params: unknown[]) {
    const resultQuery = (await this._db.query(query, params)).rows;

    if (resultQuery.length > 1) {
      return resultQuery;
    }

    return resultQuery[0];
  }

  /**
   * @description Метод для расширения - представляет из себя перечень экземпляров класса сущностей для представления данных
   * @param tableName имя таблицы
   * @param data данные из запроса
   * @returns возвращает экземпляр класса entity
   */
  private _getEntityForRead<T>(tableName: TableName, data: AnyEntity): T {
    const entityList: EntityListType = {
      wallet_table: new WalletEntity(data),
    };

    return entityList[tableName] as T;
  }
}
