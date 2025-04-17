import { defineConfig } from '@mikro-orm/postgresql';
import { User } from '../entities/user.entity.js';
import { News } from '../entities/news.entity.js';
import { TeamMember } from '../entities/team.entity.js';
import { Module } from '../entities/module.entity.js';
import dotenv from 'dotenv';

dotenv.config();

const config = defineConfig({
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [User, News, TeamMember, Module],
  debug: true,
});

export default config;
