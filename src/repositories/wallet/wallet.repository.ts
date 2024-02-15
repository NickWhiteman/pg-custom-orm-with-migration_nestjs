import { Injectable } from '@nestjs/common';
import { RepositoryFactory } from '../repository.abstract';
import { WalletEntity } from 'database/entitys/wallet.entity';
import { IRepository, TableName, UpdateFieldsParamsType } from 'types/repository.type';

@Injectable()
export class WalletRepository extends RepositoryFactory implements IRepository {
  private _tableName: TableName = 'wallet_table';

  constructor() {
    super();
  }

  async create(wallet: WalletEntity) {
    await this._create(wallet, this._tableName);
  }

  async read(id: number): Promise<WalletEntity | WalletEntity[]> {
    const result = await this._read(id, this._tableName);
    return result;
  }

  async update(newWallet: WalletEntity): Promise<void> {
    await this._update(newWallet, this._tableName);
  }

  async updateField(params: Omit<UpdateFieldsParamsType, 'tableName'>): Promise<void> {
    await this._updateColumn({ ...params, tableName: this._tableName });
  }

  async delete(id: number): Promise<void> {
    await this._delete(id, this._tableName);
  }
}
