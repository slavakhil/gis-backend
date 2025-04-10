import { Module } from "../../entities/module.entity.js";
const getModuleResource = (orm) => ({
    resource: { model: Module, orm },
    options: {
        id: "Модули",
        parent: null,
        listProperties: ["name", "link"],
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
});
export default getModuleResource;
