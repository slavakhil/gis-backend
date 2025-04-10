export const File = {
  name: 'Module',
  tableName: 'file',
  collection: 'file',
  properties: {
    id: {
      primary: true,
      type: 'number',
      autoincrement: true,
    },
    name: {
      type: 'string',
      fieldName: 'name',
    },
    path: {
      type: 'string',
      fieldName: 'path',
    },
    path: {
      type: 'string',
      fieldName: 'mimetype',
    },
    size: {
      type: 'string',
      fieldName: 'size',
    },
    createdAt: {
      type: 'DateTime',
      fieldName: 'created_at',
      defaultRaw: 'now()',
    },
  },
};
