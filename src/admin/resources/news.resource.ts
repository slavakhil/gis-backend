import { ResourceWithOptions } from 'adminjs';
import { News } from '../../entities/news.entity.js';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  afterDeleteNews,
  afterEditNews,
  afterNewNews,
  beforeEditNews,
  beforeNewNews,
} from '../services/news.service.js';

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
      content: {
        components: {
          edit: 'MarkdownEditor',
        },
        isVisible: { list: false, filter: false, show: true, edit: true },
      },
      date: {
        
      },
    },
    actions: {
      new: {
        before: beforeNewNews,
        after: afterNewNews,
      },
      edit: {
        before: beforeEditNews,
        after: afterEditNews,
      },
      delete: {
        after: afterDeleteNews,
      },
    },
  },
});

export default getNewsResource;
