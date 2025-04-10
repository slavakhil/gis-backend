export const Module = {
  name: 'Module',
  tableName: 'modules',
  properties: {
    id: {
      primary: true,
      type: 'number',
      autoincrement: true,
    },
    name: {
      type: 'text',
      fieldName: 'name',
    },
    link: {
      type: 'text',
      fieldName: 'link',
    },
  },
};
