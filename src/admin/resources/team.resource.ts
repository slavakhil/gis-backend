import AdminJS from 'adminjs';
import { TeamMember } from '../../entities/team.entity.js';
import { componentLoader } from '../components.bundler.js';
import uploadFeature from '@adminjs/upload';

export default (orm) => ({
  resource: { model: TeamMember, orm },
  options: {
    id: 'Команда',
    name: 'TeamMember',
    icon: 'Users',
    parent: null,
    listProperties: ['email', 'lastName', 'firstName', 'patronymic', 'position', 'photo'],
    actions: {
      list: { isAccessible: () => true },
      show: { isAccessible: () => true },
      new: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
    },
  },
});
