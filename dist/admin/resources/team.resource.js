import { TeamMember } from '../../entities/team.entity.js';
import fs from 'fs/promises';
import path from 'path';
const UPLOAD_DIR = 'public';
const getTeamResource = (orm) => ({
    resource: { model: TeamMember, orm },
    options: {
        id: 'Команда',
        parent: null,
        listProperties: ['email', 'lastName', 'firstName', 'patronymic', 'position', 'photo'],
        editProperties: ['email', 'lastName', 'firstName', 'patronymic', 'position', 'photo'],
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
            new: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
                before: async (request, context) => {
                    const upload = request.payload?.uploadFile;
                    if (upload && upload.name && upload.data) {
                        const buffer = Buffer.from(upload.data, 'base64');
                        const tempDir = path.join(process.cwd(), 'public/tmp');
                        const fileName = `${Date.now()}-${upload.name}`;
                        const tempPath = path.join(tempDir, fileName);
                        await fs.mkdir(tempDir, { recursive: true });
                        await fs.writeFile(tempPath, buffer);
                        context.tempFile = {
                            fileName,
                            tempPath,
                            finalPath: path.join(process.cwd(), 'public', fileName),
                            relativePath: `/public/${fileName}`,
                        };
                        request.payload.photo = null;
                        delete request.payload.uploadFile;
                    }
                    return request;
                },
                after: async (response, request, context) => {
                    const { record } = context;
                    const filename = path.basename(response?.record?.params?.photo);
                    const tempPath = path.join(process.cwd(), response?.record?.params?.photo);
                    const finalPath = path.join(process.cwd(), `public/${filename}`);
                    console.log('tempPath', tempPath);
                    console.log('finalPath', finalPath);
                    if (response) {
                        try {
                            await fs.rename(`${tempPath}`, `${finalPath}`);
                            record.update({ photo: `/public/${filename}` });
                            await record.save();
                        }
                        catch (err) {
                            console.error('Ошибка при перемещении файла:', err);
                        }
                    }
                    return response;
                },
            },
            edit: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
                before: async (request, context) => {
                    if (!request.payload?.uploadFile) {
                        return request;
                    }
                    const upload = request.payload?.uploadFile;
                    console.log(request, 'upload');
                    if (upload && upload.name && upload.data) {
                        const buffer = Buffer.from(upload.data, 'base64');
                        const tempDir = path.join(process.cwd(), 'public/tmp');
                        const fileName = `${Date.now()}-${upload.name}`;
                        const tempPath = path.join(tempDir, fileName);
                        await fs.mkdir(tempDir, { recursive: true });
                        await fs.writeFile(tempPath, buffer);
                        context.tempFile = {
                            fileName,
                            tempPath,
                            finalPath: path.join(process.cwd(), 'public', fileName),
                            relativePath: `/public/${fileName}`,
                        };
                        if (context.record?.params.photo) {
                            context.oldPhotoPath = path.join(process.cwd(), context.record.params.photo.replace(/^\/+/, ''));
                        }
                        request.payload.photo = null;
                        delete request.payload.uploadFile;
                    }
                    return request;
                },
                after: async (response, request, context) => {
                    const { record } = context;
                    console.log('record', context.tempFile.tempPath);
                    console.log('response', context.tempFile.finalPath);
                    if (record && context.tempFile) {
                        try {
                            await fs.rename(`${context.tempFile.tempPath}`, `${context.tempFile.finalPath}`);
                            record.update({ photo: context.tempFile.relativePath });
                            await record.save();
                            if (context.oldPhotoPath &&
                                context.oldPhotoPath !== context.tempFile.finalPath &&
                                context.oldPhotoPath.includes('public')) {
                                await fs.unlink(context.oldFilePath);
                            }
                        }
                        catch (err) {
                            console.error('Не удалось переместить файл:', err);
                        }
                    }
                    return response;
                },
            },
            delete: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
                before: async (request, context) => {
                    const { record } = context;
                    if (record && record.params.photo) {
                        const relativePath = record.params.photo.replace(/^\/+/, '');
                        try {
                            const fullPath = path.join(process.cwd(), relativePath);
                            await fs.unlink(fullPath);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    return request;
                },
            },
            list: { isAccessible: () => true },
            show: { isAccessible: () => true },
        },
    },
});
export default getTeamResource;
