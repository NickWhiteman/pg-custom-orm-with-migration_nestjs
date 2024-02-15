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

<img width="450" alt="image" src="https://github.com/NickWhiteman/pg-custom-orm-with-migration_nestjs/assets/66336085/30207d06-3b5e-42c2-91fd-c84ff25d6ba1">

With the following content
<img width="961" alt="image" src="https://github.com/NickWhiteman/pg-custom-orm-with-migration_nestjs/assets/66336085/8539c451-1f55-4c34-93ae-a083431581a8">


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

<img width="386" alt="image" src="https://github.com/NickWhiteman/pg-custom-orm-with-migration_nestjs/assets/66336085/b97f88b8-5955-4cda-8387-48f80e2a085e">

So far, the module looks like a separate standalone implementation with its own architecture, cli implementation, and abstraction for working with entty to form repository classes.

**The abstraction for creating repositories is a standardization of the formation of CRUD procedures for the Entity:**

Example method create

<img width="876" alt="image" src="https://github.com/NickWhiteman/pg-custom-orm-with-migration_nestjs/assets/66336085/73c25024-e282-4727-9cb1-9aec770218d8">

In an abstract class, we need to scale this method to form the correct functionality of the orm

<img width="656" alt="image" src="https://github.com/NickWhiteman/pg-custom-orm-with-migration_nestjs/assets/66336085/0b43d027-8386-48cc-91c3-463680b69768">

<img width="668" alt="image" src="https://github.com/NickWhiteman/pg-custom-orm-with-migration_nestjs/assets/66336085/9995e530-80cc-423a-844f-cb739ce95055">

In this way, the implementation of abstraction is used. 
Later, the repository generation code will be added to the cli and the project itself will be rebuilt into a batch solution






