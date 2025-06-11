// src/database/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const AppDataSource = new DataSource({
  type:     'postgres',
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities:   [path.join(__dirname, '../entities/*.ts')],
  migrations: [path.join(__dirname, './migrations/*.ts')],
  synchronize: false,             // nunca em produção!
});
