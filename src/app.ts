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
import newsRoutes from './api/news.routes.js';

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/tmp/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

const main = async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);

    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();

    const app = express();
    app.use(express.json());

    app.use((req: Request, res: Response, next: NextFunction): void => {
      (req as any).em = orm.em.fork();
      next();
    });

    // Раздача статики для загруженных файлов
    app.use('/public', express.static('public'));

    // Настройка multer

    app.use('/api/news', newsRoutes);
    // Роут для загрузки файлов
    app.post('/admin/upload', upload.single('file'), (req: Request, res: Response): void => {
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const filePath = `/public/tmp/${file.filename}`;
      res.status(200).json({ filePath });
    });

    // Инициализация админки
    const { admin, adminRouter } = await createAdminPanel(orm);
    app.use(admin.options.rootPath, adminRouter);

    app.listen(Number(process.env.SERVER_PORT), () => {
      console.log(`✅ AdminJS запущен: http://localhost:${process.env.SERVER_PORT}/admin`);
    });
  } catch (err) {
    console.error(err);
  }
};

main().catch((error) => console.error(error));
