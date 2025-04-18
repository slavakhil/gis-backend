import { ResourceWithOptions } from 'adminjs';
import { TeamMember } from '../../entities/team.entity.js';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  afterDeleteTeam,
  afterEditTeam,
  afterNewTeam,
  beforeEditTeam,
  beforeNewTeam,
} from '../services/team.service.js';

// Экспорт ресурса
const getTeamResource = (orm: EntityManager): ResourceWithOptions => ({
  resource: { model: TeamMember, orm },
  options: {
    id: 'Команда',
    parent: null,
    listProperties: ['id', 'email', 'lastName', 'firstName', 'patronymic', 'position', 'photo'],
    properties: {
      photo: {
        isVisible: {
          list: true,
          filter: false,
          show: true,
          edit: true,
        },
        components: {
          list: 'ImagePreview',
          show: 'ImagePreview',
          edit: 'UploadPhoto', // если используешь кастомный upload
        },
      },
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => {
          console.log(currentAdmin, 'currentAdmin');
          return Boolean(currentAdmin?.isAdmin);
        },
        before: beforeNewTeam,
        after: afterNewTeam,
      },
      edit: {
        isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
        before: beforeEditTeam,
        after: afterEditTeam,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
        after: afterDeleteTeam,
      },
    },
  },
});

export default getTeamResource;
