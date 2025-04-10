import { Module } from '../../entities/module.entity.js';

export default (orm) => ({
  resource: { model: Module, orm },
  options: {
    id: 'Модули',
    name: 'Module', // Название ресурса в меню
    icon: 'Newspaper', // Иконка из набора AdminJS
    parent: null, // Убираем группировку
    listProperties: ['name', 'link'],
    actions: {
      list: { isAccessible: () => true },
      show: { isAccessible: () => true },
      new: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
    },
  },
});
