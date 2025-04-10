import AdminJS from 'adminjs';
import { TeamMember } from '../../entities/team.entity.js';
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
    properties: {
      photo: {
        isVisible: { list: true, filter: false, show: true, edit: true },
        components: {
          list: 'PhotoThumbnail',
          show: 'PhotoThumbnail',
        },
      },
      // 'photo.path': {
      //   isVisible: false,
      // },
      // 'photo.filename': {
      //   isVisible: false,
      // },
    },
    features: [
      uploadFeature({
        provider: {
          local: {
            bucket: 'public/uploads/team_members',
          },
        },
        properties: {
          key: 'photo',
          mimeType: 'photo.mime',
          bucket: 'photo.bucket',
          size: 'photo.size',
          filename: 'photo.filename',
          file: 'uploadPhoto',
        },
        uploadPath: ({ record, filename }) => `team_members/${record.id}-${filename}`,
      }),
    ],
  },
});
