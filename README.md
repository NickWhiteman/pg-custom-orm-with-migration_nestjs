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

Congratulations to your first entity designed. Now we can use the console command to generate the migration.

**Step4: In order to generate a migration, you need to enter the console command:**

```bash
npm run migration:generate --migrationName
```

En route `./src/database/migration` will create a.mjs migration file.

**Step:5 To apply a migration to a database, you must enter a console command:**

```bash
npm run migration:up
```

The CLI automatically takes the edge migration and sends a query to the database with the migration.

**In order to roll back the migration, you need to enter the console command:**

```bash
npm run migration:down
```

### Realization:

Interaction with data from the database is based on the principle of an object.
Therefore, it wasn't the complex abstraction itself that was invented to standardize
the design of repository classes.
