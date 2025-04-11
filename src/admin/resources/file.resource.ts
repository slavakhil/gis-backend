import AdminJS, { ResourceWithOptions } from 'adminjs';
import uploadFileFeature from '@adminjs/upload';
import path from 'path';
import { File } from '../../entities/file.entity.js';
import { componentLoader } from '../components.bundler.js';
import { EntityManager } from '@mikro-orm/postgresql';

const getFileResource = (orm: EntityManager): ResourceWithOptions => ({
  resource: { model: File, orm },
  options: {
    navigation: { name: 'Sasd asd asdasdDfjsdnfsdj', icon: 'asd' },
    properties: {
      id: { isVisible: false },
      name: { isTitle: true },
      path: {
        isVisible: { list: false, filter: false, show: true, edit: true },
      },
      mimetype: {},
      size: {},
      createdAt: {
        isVisible: { edit: false, show: true, list: true, filter: true },
      },
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
        after: async (response, request, context) => {
          const { record } = context;
          if (record && record.isValid()) {
            await record.save();
          }
          return response;
        },
      },
    },
  },
  features: [
    uploadFileFeature({
      provider: {
        local: {
          bucket: path.join(process.cwd(), 'public'),
          opts: {
            baseUrl: undefined,
          },
        },
      },
      componentLoader,
      properties: {
        key: 'path',
        mimeType: 'mimetype',
        size: 'size',
        filename: 'name',
        file: 'uploadFile',
      },
      uploadPath: (record, filename) => `${Date.now()}-${filename}`,
    }),
  ],
});

export default getFileResource;
