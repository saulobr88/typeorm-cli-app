// src/database/data-source.ts
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });


const dbDriver = (process.env.DB_DRIVER || '').toLowerCase() || 'postgres';

const dataSourceObjEntities = {
  entities:   [path.join(__dirname, '../entities/*.ts')],
  migrations: [path.join(__dirname, './migrations/*.ts')],
  synchronize: false,             // nunca em produção!
}

let dataSourceObj: DataSourceOptions;

dataSourceObj = {
  type:     'postgres',
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...dataSourceObjEntities,
};

if (dbDriver === 'sqlite' || dbDriver === 'better-sqlite3') {
  dataSourceObj = {
    type: 'better-sqlite3',
    database: process.env.SQLITE_PATH || './.data/db.sqlite',
    ...dataSourceObjEntities,
    migrations: [path.join(__dirname, './migrations/sqlite3/*.ts')],
  };
}

export const AppDataSource = new DataSource(dataSourceObj);
