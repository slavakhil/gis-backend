import { ResourceWithOptions, ActionRequest, ActionContext, After, RecordActionResponse, Before } from 'adminjs';
import { News } from '../../entities/news.entity.js';
import { EntityManager } from '@mikro-orm/postgresql';
import path from 'path';
import { promises as fs } from 'fs';
import { deleteFile, moveFile } from '../../utils/functions.js';
import { DateTime } from 'luxon';
import { convertToMoscowDate } from '../../utils/date.js';

const publicDir = path.join(process.cwd(), 'public');
const tmpDir = path.join(publicDir, 'tmp');

const beforeNew: Before = async (request: ActionRequest, context: ActionContext) => {
  const dateField = 'date'; // замените на имя вашего поля

  if (request.payload?.[dateField]) {
    const original = request.payload[dateField];

    // Парсим ISO-строку как московское время
    const moscowTime = DateTime.fromISO(original, { zone: 'Europe/Moscow' });

    if (!moscowTime.isValid) {
      throw new Error(`Невалидная дата: ${original}`);
    }

    // Переводим в UTC и сохраняем как JS Date
    request.payload[dateField] = moscowTime.toJSDate();
  }

  const uploads = request.payload?.uploadFiles;

  if (uploads && Array.isArray(uploads)) {
    const paths: string[] = [];

    await fs.mkdir(tmpDir, { recursive: true });

    for (const file of uploads) {
      const fileName = `${Date.now()}-${file.name}`;
      const buffer = Buffer.from(file.data, 'base64');
      const tempPath = path.join(tmpDir, fileName);
      await fs.writeFile(tempPath, buffer);
      paths.push(`public/tmp/${fileName}`);
    }

    request.payload.photo = paths;
  }

  delete request.payload.uploadFiles;
  return request;
};

const afterNew: After<RecordActionResponse> = async (response, request, context) => {
  const { record } = context;
  if (!record) return response;

  // Собираем photo[] из record.params
  const photoKeys = Object.keys(record.params).filter((key) => key.startsWith('photo.'));

  const photos = photoKeys
    .sort((a, b) => {
      const aIndex = parseInt(a.split('.')[1], 10);
      const bIndex = parseInt(b.split('.')[1], 10);
      return aIndex - bIndex;
    })
    .map((key) => record.params[key])
    .filter(Boolean);

  if (photos.length === 0) return response;

  const finalPhotoPaths: string[] = [];

  for (const tmpPath of photos) {
    const fileName = path.basename(tmpPath);
    const from = path.join(publicDir, 'tmp', fileName);
    const to = path.join(publicDir, fileName);
    const dbPath = `/public/${fileName}`;

    try {
      await moveFile(from, to);
      finalPhotoPaths.push(dbPath);
    } catch (err) {
      console.error('❌ Ошибка при перемещении:', err);
    }
  }

  // Обновляем запись
  await record.update({ photo: finalPhotoPaths });

  return response;
};

const beforeEdit: Before = async (request: ActionRequest, context: ActionContext) => {
  const dateField = 'date'; // замените на имя вашего поля

  if (request.payload?.[dateField]) {
    const original = request.payload[dateField];

    // Парсим ISO-строку как московское время
    const moscowTime = DateTime.fromISO(original, { zone: 'Europe/Moscow' });

    if (!moscowTime.isValid) {
      throw new Error(`Невалидная дата: ${original}`);
    }

    // Переводим в UTC и сохраняем как JS Date
    request.payload[dateField] = moscowTime.toJSDate();
  }

  const uploads = request.payload?.uploadFile;

  // Обработка новых файлов (если загружены)
  if (uploads && Array.isArray(uploads)) {
    const photos: string[] = [];

    for (const upload of uploads) {
      if (upload?.name && upload?.data) {
        const buffer = Buffer.from(upload.data, 'base64');
        const fileName = `${Date.now()}-${upload.name}`;
        const tmpPath = path.join(process.cwd(), 'public/tmp', fileName);

        await fs.mkdir(path.dirname(tmpPath), { recursive: true });
        await fs.writeFile(tmpPath, buffer);

        photos.push(`/public/tmp/${fileName}`);
      }
    }

    request.payload.photo = photos;
  }

  // Сохраняем предыдущее значение photo
  const photoFields = Object.entries(context.record?.params || {}).filter(([key]) => key.startsWith('photo.'));
  const previousPhotos = photoFields.map(([, value]) => value).filter(Boolean);

  if (previousPhotos.length > 0) {
    request.payload._previousPhoto = previousPhotos;
  }

  // Очищаем поле uploadFile, чтобы AdminJS не пытался его сохранить
  delete request.payload.uploadFile;

  return request;
};

const afterEdit: After<RecordActionResponse> = async (response, request, context: ActionContext) => {
  const recordJson = response.record;
  if (!recordJson) return response;

  console.log(recordJson);
  // const newPhotos = recordJson.params.photo as string[] | undefined;
  // const previousPhotos = recordJson.params._previousPhoto as string[] | undefined;

  const newPhotoKeys = Object.keys(recordJson.params).filter((key) => key.startsWith('photo.'));
  const previousPhotosKeys = Object.keys(recordJson.params).filter((key) => key.startsWith('_previousPhoto.'));

  const newPhotos = newPhotoKeys
    .sort((a, b) => {
      const aIndex = parseInt(a.split('.')[1], 10);
      const bIndex = parseInt(b.split('.')[1], 10);
      return aIndex - bIndex;
    })
    .map((key) => recordJson.params[key])
    .filter(Boolean);

  const previousPhotos = previousPhotosKeys
    .sort((a, b) => {
      const aIndex = parseInt(a.split('.')[1], 10);
      const bIndex = parseInt(b.split('.')[1], 10);
      return aIndex - bIndex;
    })
    .map((key) => recordJson.params[key])
    .filter(Boolean);

  // if (!Array.isArray(newPhotos)) return response;

  const tmpPrefix = 'public/tmp/';
  const finalPhotos: string[] = [];

  for (const photo of newPhotos) {
    const isTmp = photo.includes(tmpPrefix);
    if (isTmp) {
      const fileName = photo.replace(tmpPrefix, '');
      const tmpPath = path.join('public/tmp', fileName);
      const finalPath = path.join('public', fileName);
      const finalDbPath = `/public/${fileName}`;

      try {
        await fs.access(tmpPath);
        await moveFile(tmpPath, finalPath);
        finalPhotos.push(finalDbPath);
      } catch (err) {
        console.error('❌ Ошибка перемещения файла:', err);
        finalPhotos.push(photo); // на случай, если не удалось переместить
      }
    } else {
      finalPhotos.push(photo); // уже финальный путь
    }
  }

  // Удаляем старые фотографии, если они больше не используются
  if (Array.isArray(previousPhotos)) {
    const toDelete = previousPhotos.filter((p) => !finalPhotos.includes(p));
    for (const photoPath of toDelete) {
      try {
        await deleteFile(path.join(process.cwd(), photoPath));
      } catch (err) {
        console.warn(`⚠️ Не удалось удалить файл ${photoPath}:`, err);
      }
    }
  }

  // Обновляем запись с новым массивом путей
  const baseRecord = await context.resource.findOne(recordJson.id);
  if (baseRecord) {
    await baseRecord.update({ photo: finalPhotos });
    response.record = baseRecord.toJSON();
  }

  return response;
};

const afterDelete: After<RecordActionResponse> = async (response, request, context: ActionContext) => {
  const { record } = context;
  console.log(record, 'record');
  const photoKeys = Object.keys(record.params).filter((key) => key.startsWith('photo.'));

  const photos = photoKeys
    .sort((a, b) => {
      const aIndex = parseInt(a.split('.')[1], 10);
      const bIndex = parseInt(b.split('.')[1], 10);
      return aIndex - bIndex;
    })
    .map((key) => record.params[key])
    .filter(Boolean);

  if (photos.length === 0) return response;

  console.log(photos, 'photos');
  if (Array.isArray(photos)) {
    for (const photo of photos) {
      try {
        const filePath = path.join(process.cwd(), photo);
        console.log(filePath, 'filePath');
        await deleteFile(filePath);
      } catch (err) {
        console.warn(`⚠️ Не удалось удалить файл ${photo}:`, err);
      }
    }
  }

  return response;
};

// Экспорт ресурса
const getNewsResource = (orm: EntityManager): ResourceWithOptions => ({
  resource: { model: News, orm },
  options: {
    id: 'Новости',
    parent: null,
    listProperties: ['title', 'date', 'author', 'content', 'photo'],
    properties: {
      photo: {
        isVisible: { list: true, filter: false, show: true, edit: true },
        components: {
          edit: 'UploadMultiplePhotos',
          list: 'ImagesPreview',
          show: 'ImagesPreview',
        },
      },
    },
    actions: {
      new: {
        before: beforeNew,
        after: afterNew,
      },
      edit: {
        before: beforeEdit,
        after: afterEdit,
      },
      delete: {
        after: afterDelete,
      },
    },
  },
});

export default getNewsResource;
