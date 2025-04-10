import { File } from './file.entity.js';

export const News = {
  name: 'News',
  tableName: 'news',
  properties: {
    id: {
      primary: true,
      type: 'number',
      autoincrement: true,
    },
    date: {
      type: 'Date',
      fieldName: 'date',
    },
    content: {
      type: 'text',
      fieldName: 'content',
    },
    author: {
      type: 'text',
      fieldName: 'author',
    },
    photo: {
      reference: 'many-to-one',
      entity: () => File,
      nullable: true,
    },
  },
};
