import { ActionRequest, ActionContext, After, RecordActionResponse, Before } from 'adminjs';
import path from 'path';
import fs from 'fs/promises';
import { deleteFile, moveFile, uploadFile } from '../../utils/functions.js';

// BEFORE-хук для сохранения предыдущего пути (чтобы удалить старый файл)
export const beforeNewTeam: Before = async (request: ActionRequest, context: ActionContext) => {
  const upload = request.payload?.uploadFile;

  if (upload && upload.name && upload.data) {
    const buffer = Buffer.from(upload.data, 'base64');
    const tempDir = path.join(process.cwd(), 'public/tmp');
    const fileName = `${Date.now()}-${upload.name}`;
    const tempPath = path.join(tempDir, fileName);

    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(tempPath, buffer);

    // Сохраняем путь до временного файла во временное поле
    context.tempFile = {
      fileName,
      tempPath,
      finalPath: path.join(process.cwd(), 'public', fileName),
      relativePath: `/public/${fileName}`,
    };

    // сохраняем во временное поле для последующей обработки
    request.payload.photo = null;
    delete request.payload.uploadFile;
  }

  return request;
};

// BEFORE-хук для сохранения предыдущего пути (чтобы удалить старый файл)
export const beforeEditTeam: Before = async (request: ActionRequest, context: ActionContext) => {
  const upload = request.payload?.uploadFile;

  if (upload && upload.name && upload.data) {
    const fileName = uploadFile(upload);

    request.payload = {
      ...request.payload,
      photo: `public/tmp/${fileName}`,
    };

    delete request.payload.uploadFile;
  }

  // для edit — сохранить предыдущее фото
  if (context.record?.params.photo) {
    request.payload._previousPhoto = context.record.params.photo;
  }

  return request;
};

export const afterNewTeam: After<RecordActionResponse> = async (response, request, context) => {
  const { record } = context;
  const filename = path.basename(response?.record?.params?.photo);
  const tempPath = path.join(process.cwd(), response?.record?.params?.photo);
  const finalPath = path.join(process.cwd(), `public/${filename}`);

  if (response) {
    try {
      await fs.rename(`${tempPath}`, `${finalPath}`);
      record.update({ photo: `/public/${filename}` });
      await record.save();
    } catch (err) {
      console.error('Ошибка при перемещении файла:', err);
    }
  }

  return response;
};

// AFTER-хук: переносит фото из tmp и удаляет старое, если нужно
export const afterEditTeam: After<RecordActionResponse> = async (response, request, context) => {
  const recordJson = response.record;
  if (!recordJson) return response;

  const newPhoto = recordJson.params.photo as string;
  const previousPhoto = recordJson.params._previousPhoto as string;

  const tmpPrefix = 'public/tmp/';
  const isTmp = newPhoto?.includes('/public/tmp/');
  if (isTmp) {
    const fileName = newPhoto.replace(tmpPrefix, '');
    const tmpPath = path.join('public/tmp', fileName);
    const finalPath = path.join('public', fileName);
    const finalDbPath = `/public${fileName}`;

    try {
      await fs.access(tmpPath);

      if (previousPhoto && previousPhoto !== newPhoto) {
        const oldPath = path.join(process.cwd(), previousPhoto);
        await deleteFile(oldPath);
      }
      await moveFile(tmpPath, finalPath);

      // Получаем настоящий record
      const baseRecord = await context.resource.findOne(recordJson.id);
      if (baseRecord) {
        await baseRecord.update({ photo: finalDbPath });
        response.record = baseRecord.toJSON(); // Обновляем response
      }
    } catch (err) {
      console.error('❌ Ошибка перемещения или обновления:', err);
    }
  }

  return response;
};

// AFTER-хук: при удалении записи — удаляем и фото
export const afterDeleteTeam: After<RecordActionResponse> = async (response, request, context) => {
  const { record } = context;
  if (!record) return response;

  const photo = record.params.photo as string;
  if (photo) {
    const filePath = path.join('public/', photo);
    await deleteFile(filePath);
  }

  return response;
};
