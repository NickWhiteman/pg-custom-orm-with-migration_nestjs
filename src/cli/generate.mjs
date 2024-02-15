import fs from 'fs';
import { createFile } from './utils.mjs';
import dotenv from 'dotenv';
dotenv.config();

const migrationName = process.argv[2];
const migrationsPathToFolder = `./src/database/migrations`;
const entityPathToFolder = `./src/database/entitys`;
let entitysFinishMapping = [
  {
    table: '',
    columns: {},
  },
];

const settingColumnType = {
  timestamp: `timestamp without time zone`,
  smallint: `smallint`,
  smallint_array: `smallint[]`,
  integer: `integer`,
  integer_array: `integer[]`,
  text: `text`,
  text_array: `text[]`,
  json: 'json',
  json_array: 'json[]',
};

const settingSignatureForCreatingColumn = {
  primaryKey: `GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 )`,
  text_setting: `COLLATE pg_catalog."default"`,
  notNull: `NOT NULL`,
};

// Функционал генерации файлов миграции для предопределенных Entity консольной командой npm run migration:generate --migrationName
function generate() {
  console.time('start');
  const entitys = [];

  fs.readdir(entityPathToFolder, async (err, dir) => {
    if (err) console.error(err);
    entitys.push(dir);
    const nameFile = `${+new Date()}_${migrationName}`;

    entitys.flatMap((entity, indexEnitys) => {
      fs.readFile(`${entityPathToFolder}/${entity}`, (err, data) => {
        if (err) console.error(err);

        const entityFile = data.toString();
        const entityRaws = entityFile.split('\n');
        // find need table name
        const tableNameNotFinding = entityRaws.filter((raw) => raw.includes('// --'))[0];
        const tableName = tableNameNotFinding
          .slice(-(tableNameNotFinding.indexOf(': ') - tableNameNotFinding.length) + 2)
          .trim();
        entitysFinishMapping[indexEnitys].table = tableName;

        // destructuring the entity file to exhume parameters and column names
        const postgresParamsRaws = entityRaws.filter((raw) => raw.includes('// --')).slice(1);
        const indexNamesParams = postgresParamsRaws.flatMap((raw) => entityRaws.indexOf(raw));

        // find need columns name
        const indexEndCharFieldNameColumn = indexNamesParams
          .flatMap((i) => entityRaws[i + 1].trim())
          .flatMap((column) => column.indexOf(':'));
        const columnNames = indexNamesParams
          .flatMap((i) => entityRaws[i + 1].trim())
          .flatMap((column, index) =>
            column.slice(
              0,
              column.includes('?') ? indexEndCharFieldNameColumn[index] - 1 : indexEndCharFieldNameColumn[index],
            ),
          );

        // find need params for columns
        // const postgresParams =
        const indexParamType = postgresParamsRaws.flatMap((param, index) => {
          const typeName = param.split(' ');
          entitysFinishMapping[indexEnitys].columns[columnNames[index]] = {
            name: columnNames[index],
            type: typeName.includes('--type:') ? typeName[typeName.indexOf('--type:') + 1] : null,
            defaultValue: typeName.includes('--defaultValue:')
              ? typeName[typeName.indexOf('--type:') + 1] === 'smallint' ||
                typeName[typeName.indexOf('--type:') + 1] === 'integer' ||
                typeName[typeName.indexOf('--type:') + 1] === 'double' ||
                typeName[typeName.indexOf('--type:') + 1] === 'float'
                ? +typeName[typeName.indexOf('--defaultValue:') + 1]
                : typeName[typeName.indexOf('--defaultValue:') + 1]
              : null,
            isPrimaryKey: typeName.includes('--primaryKey') ? true : null,
            notNull: typeName.includes('--notNull') ? true : null,
          };
        });

        // console.log('--------- [File Data] ---------');
        console.log(
          'tableName =>',
          tableName,
          'indexNames =>',
          indexNamesParams,
          'indexEndCharFieldNameColumn =>',
          indexEndCharFieldNameColumn,
          'columnNames =>',
          columnNames,
          'indexParamType => ',
          indexParamType,
          'entitysFinishMapping => ',
          console.table(entitysFinishMapping[0].columns),
        );
        // console.table(entitysFinishMapping[0].columns);
        // console.log('--------- [File Data] ---------');

        if (indexEnitys === entitys.length - 1) {
          const rawsQuery = (entity) => {
            console.table(entity);
            return Object.keys(entity)
              .flatMap((column, index) =>
                `${entity[column].name} ${entity[column].type ? settingColumnType[entity[column].type] : ''} ${
                  entity[column].notNull ? settingSignatureForCreatingColumn['notNull'] : ''
                } ${entity[index]?.defaultValue ? `default ${entity[index]?.defaultValue}` : ''} ${
                  entity[column].isPrimaryKey
                    ? settingSignatureForCreatingColumn['primaryKey']
                    : settingSignatureForCreatingColumn[`${entity[column].type}_setting`] ?? ''
                }`.trim(),
              )
              .toString();
          };

          const sqlQuery = entitysFinishMapping.flatMap((entity) => {
            console.table(entity);
            const raw = rawsQuery(entity.columns);
            console.log('raw', raw);
            return `
                CREATE TABLE IF NOT EXISTS public.${entity.table}
                (
                  ${raw},
                  CONSTRAINT pk_${entity.table} PRIMARY KEY (${entity.columns.id?.name})
                )
                WITH (
                    OIDS = FALSE
                )
                TABLESPACE pg_default;
          
                ALTER TABLE IF EXISTS public.${entity.table}
                    OWNER to ${process.env['POSTGRES_USERNAME']};
              `;
          });
          const sqlDeleteQuery = entitysFinishMapping.flatMap((entity) => {
            const raw = rawsQuery(entity.columns);
            console.log('raw', raw);
            return `
                DROP TABLE ${entity.table}
              `;
          });

          createFile(
            `${migrationsPathToFolder}/${nameFile}.migration.mjs`,
            `export const up = \`${sqlQuery}\`;
            
            export const down = \`${sqlDeleteQuery}\`;`,
          );
        }
      });
    });
  });
  console.timeEnd('start');
}

generate();
