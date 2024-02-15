import fs from 'fs';
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const migrationsPathToFolder = `./src/database/migrations`;

function downFlow() {
  let migration;

  const db = new Pool({
    user: process.env['POSTGRES_USERNAME'],
    database: process.env['POSTGRES_DATABASE_NAME'],
    password: process.env['POSTGRES_PASSWORD'],
    port: +process.env['POSTGRES_PORT'],
    host: process.env['POSTGRES_HOST'],
  });

  fs.readdir(migrationsPathToFolder, async (err, dir) => {
    if (err) console.error(err);
    migration = dir[dir.length - 1];
    import(`../migrations/${migration}`).then(async (file) => {
      try {
        console.log(migration);
        await db.query(file.down);
      } catch (error) {
        console.error('Migration not sended in db: ', error);
      }

      await db.query(
        `delete from public.migration
        where migration_name = $1;`,
        [migration],
      );
      console.info(`Current down migration ${migration} was be done success!`);
    });
  });
}

downFlow();
