import 'reflect-metadata';
import express from 'express';
import path from 'path';
import multer from 'multer';
import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfig from './configs/mikro-orm.config.js';
import { createAdminPanel } from './admin/admin.js';
import type { NextFunction, Request, Response } from 'express';
import './utils/cleanerTemp.js';
import fs from 'fs';
import dotenv from 'dotenv';
import apiRouter from './api/index.js';
import cors from 'cors';
import sharp from 'sharp';

dotenv.config();

const main = async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);

    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();

    const app = express();
    app.use(express.json());
    app.use(
      cors()
      //   {
      //   origin: 'http://localhost:5173',
      //   credentials: true, //access-control-allow-credentials:true
      // }
    );

    app.use((req: Request, res: Response, next: NextFunction): void => {
      (req as any).em = orm.em.fork();
      next();
    });

    // Раздача статики для загруженных файлов
    app.use('/public', express.static('public'));

    // Настройка multer

    app.use('/api', apiRouter);
    // Роут для загрузки файлов
    

    // Инициализация админки
    const { admin, adminRouter } = await createAdminPanel(orm);
    app.use(admin.options.rootPath, adminRouter);

    app.listen(5000, () => {
      console.log(`✅ AdminJS запущен: http://localhost:${process.env.SERVER_PORT}/admin`);
    });
  } catch (err) {
    console.error(err);
  }
};

main().catch((error) => console.error(error));
