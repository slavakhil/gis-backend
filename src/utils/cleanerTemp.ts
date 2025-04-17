import fs from 'fs/promises';
import path from 'path';
import cron from 'node-cron';

const TMP_FOLDER = path.join(process.cwd(), 'public/tmp');

const cleanupTmpFolder = async () => {
  try {
    const files = await fs.readdir(TMP_FOLDER);

    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(TMP_FOLDER, file);
      const stat = await fs.stat(filePath);

      const age = now - stat.mtimeMs;

      if (age > Number(process.env.CLEAR_TEMP_TIME)) {
        await fs.unlink(filePath);
        console.log(`🗑️ Удалён временный файл: ${file}`);
      }
    }
  } catch (err) {
    console.error('❌ Ошибка очистки tmp:', err);
  }
};

// Запускаем каждую минуту
cron.schedule('* * * * *', cleanupTmpFolder);
