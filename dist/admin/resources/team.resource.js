import uploadFeature from '@adminjs/upload';
import { TeamMember } from '../../entities/team.entity.js';
import { componentLoader } from '../components.bundler.js';
const getTeamResource = (orm) => ({
    resource: { model: TeamMember, orm },
    options: {
        id: 'Команда',
        parent: null,
        listProperties: [
            'email',
            'lastName',
            'firstName',
            'patronymic',
            'position',
            'photo',
        ],
        actions: {
            list: { isAccessible: () => true },
            show: { isAccessible: () => true },
            new: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
            },
            edit: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
            },
            delete: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
            },
        },
    },
    features: [
        uploadFeature({
            componentLoader,
            provider: { local: {
                    bucket: 'uploads',
                    opts: {
                        baseUrl: undefined
                    }
                } },
            properties: {
                key: 'photo.path',
                mimeType: 'photo.mimetype',
                size: 'photo.size',
                filename: 'photo.name',
                file: 'uploadFile',
            },
            uploadPath: (record, filename) => `photos/${Date.now()}-${filename}`,
        }),
    ],
});
export default getTeamResource;
