import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

export const uploadPhoto = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const originalPath = file.path;
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = `compressed-${file.filename.replace(/\.[^/.]+$/, '')}${ext}`;
  const outputPath = path.join('public/tmp', filename);

  try {
    // Обработка изображения через sharp
    const image = sharp(originalPath);
    const metadata = await image.metadata();
    const stats = await fs.stat(originalPath);

    const shouldResize = metadata.width && metadata.width > 1000;

    // Проверяем тип и сжимаем
    if (stats.size > 500 * 1024) {
      if (ext === '.jpg' || ext === '.jpeg') {
        await image
          .resize({ width: shouldResize ? 1000 : undefined })
          .jpeg({ quality: 70 })
          .toFile(outputPath);
      } else if (ext === '.png') {
        await image
          .resize({ width: shouldResize ? 1000 : undefined })
          .png({ quality: 70 })
          .toFile(outputPath);
      } else {
        // Если формат не подходит — просто копируем без сжатия
        fs.copyFile(originalPath, outputPath);
      }

      // Удаляем оригинальный файл
      fs.unlink(originalPath);
    } else {
      fs.copyFile(originalPath, outputPath);
    }

    // Отправляем путь до нового (сжатого) файла
    res.status(200).json({ filePath: `/public/tmp/${filename}` });
  } catch (err) {
    console.error('Ошибка при обработке изображения:', err);
    res.status(500).json({ error: 'Ошибка при обработке изображения' });
  }
};
