import { features } from 'process';
import { File } from '../../entities/file.entity.js';
import uploadFileFeature from '@adminjs/upload';
import path from 'path';

export default (orm) => ({
  resource: { model: File, orm },
  features: [
    uploadFileFeature({
      provider: {
        local: {
          bucket: path.join(process.cwd(), 'uploads'),
        },
      },
      properties: {
        key: 'path',
        mimeType: 'mimetype',
        size: 'size',
        filename: 'name',
        file: 'uploadFile',
      },
      uploadPath: (record, filename) => `photos/${Date.now()}-${filename}`,
    }),
  ],

  // options: {
  //   id: 'Модули',
  //   name: 'Module', // Название ресурса в меню
  //   icon: 'Newspaper', // Иконка из набора AdminJS
  //   parent: null, // Убираем группировку
  //   listProperties: ['name', 'link'],
  //   actions: {
  //     list: { isAccessible: () => true },
  //     show: { isAccessible: () => true },
  //     new: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
  //     edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
  //     delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
  //   },
  // },
});
