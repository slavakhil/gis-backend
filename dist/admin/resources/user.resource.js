import bcrypt from "bcrypt";
import { User } from "../../entities/user.entity.js";
const getUserResource = (orm) => ({
    resource: { model: User, orm },
    options: {
        id: "Пользователи",
        parent: null,
        listProperties: ["email", "isAdmin", "createdAt"],
        actions: {
            list: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
            },
            show: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
            },
            delete: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
            },
            new: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
                before: async (request) => {
                    if (request.payload?.password) {
                        const hashed = await bcrypt.hash(request.payload.password, 10);
                        request.payload = {
                            ...request.payload,
                            password: hashed,
                        };
                    }
                    return request;
                },
            },
            edit: {
                isAccessible: ({ currentAdmin }) => Boolean(currentAdmin),
                before: async (request, context) => {
                    const { currentAdmin, record } = context;
                    if (!request.payload?.password) {
                        return request;
                    }
                    if (record?.params?.email === currentAdmin?.email) {
                        const hashed = await bcrypt.hash(request.payload.password, 10);
                        request.payload = {
                            ...request.payload,
                            password: hashed,
                        };
                    }
                    else {
                        delete request.payload.password;
                    }
                    return request;
                },
            },
        },
    },
});
export default getUserResource;
