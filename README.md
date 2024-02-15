## Module orm for pg with migration functions

**Step1: need setting options instance class Pool for connection db**

```typescript
new Pool({
  user: configEnv('POSTGRES_USERNAME'),
  database: configEnv('POSTGRES_DATABASE_NAME'),
  password: configEnv('POSTGRES_PASSWORD'),
  port: +configEnv('POSTGRES_PORT'),
  host: configEnv('POSTGRES_HOST'),
  query_timeout: 1000,
  connectionTimeoutMillis: 2000,
});
```

**Step2: For correctly working migration need enter console command:**

```bash
  npm run migration:init
```

After calling this command, a migration table will be created in your database - where
the migrations that have been applied to the database will be stored.

**Step3: You've encapsulated a module in a project. Now you can create your entities as in the example**

```typescript
type WalletEntityType = {
  id?: number;
  private_key: string;
  is_delete?: number;
};

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
```
