import { News } from '../../entities/news.entity.js';
const getNewsResource = (orm) => ({
    resource: { model: News, orm },
    options: {
        id: 'Новости',
        parent: null,
        listProperties: ['title', 'content', 'author', 'photo', 'date', 'createdAt'],
        editProperties: ['title', 'content', 'author', 'photo', 'date', 'createdAt'],
        properties: {
            photo: {
                components: {
                    edit: 'UploadPhoto',
                    list: 'ImagePreview',
                    show: 'ImagePreview',
                },
            },
        },
        actions: {
            new: { isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin) },
            edit: { isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin) },
            delete: { isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin) },
            list: { isAccessible: () => true },
            show: { isAccessible: () => true },
        },
    },
});
export default getNewsResource;
