import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

async function init() {
  console.time('init');
  const db = new Pool({
    user: process.env['POSTGRES_USERNAME'],
    database: process.env['POSTGRES_DATABASE_NAME'],
    password: process.env['POSTGRES_PASSWORD'],
    port: +process.env['POSTGRES_PORT'],
    host: process.env['POSTGRES_HOST'],
  });
  try {
    await db.query('select * from migration');
  } catch (error) {
    await db.query(`
        CREATE TABLE IF NOT EXISTS public.migration
        (
            id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
            migration text COLLATE pg_catalog."default",
            migration_name text COLLATE pg_catalog."default",
            create_at timestamp without time zone DEFAULT now(),
            CONSTRAINT pk_wallet PRIMARY KEY (id)
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;

            ALTER TABLE IF EXISTS public.migration
                OWNER to postgres;
    `);
  }

  console.timeEnd('init');
}

init();
