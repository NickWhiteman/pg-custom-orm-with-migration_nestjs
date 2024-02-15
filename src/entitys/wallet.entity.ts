import { WalletEntityType } from 'types/repository.type';

// --tableName: wallet_table
export class WalletEntity {
  // --type: integer --primaryKey --notNull
  id?: number;
  // --type: text --notNull
  private_key: string;
  // --type: smallint --notNull --defaultValue: 0
  is_delete?: number;
  // --type: timestamp --defaultValue: now()
  create_at: Date;
  // --type: timestamp
  update_at: Date;

  constructor({ id, private_key, is_delete }: WalletEntityType) {
    this.id = id;
    this.private_key = private_key;
    this.is_delete = is_delete;
  }
}
