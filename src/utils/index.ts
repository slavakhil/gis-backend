import fs from 'fs/promises';
import path from 'path';

// Утилиты
export const moveFile = async (oldPath: string, newPath: string) => {
  await fs.rename(oldPath, newPath);
};

export const deleteFile = async (filePath: string) => {
  console.log('deleteFile', filePath);
  try {
    await fs.unlink(filePath);
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
};

export const uploadFile = async (data) => {
  const fileName = `${Date.now()}-${data.name}`;
  const buffer = Buffer.from(data.data, 'base64');
  const tempDir = path.join(process.cwd(), 'public/tmp');
  const tempPath = path.join(tempDir, fileName);

  await fs.mkdir(tempDir, { recursive: true });
  await fs.writeFile(tempPath, buffer);

  return fileName;
};
