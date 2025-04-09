import { User } from "../../entities/user.entity.js";
import bcrypt from "bcrypt";

export default (orm) => ({
  resource: { model: User, orm },
  options: {
    id: "Пользователи",
    name: "Users",
    icon: "User",
    parent: null,
    actions: {
      list: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      show: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin,
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
        isAccessible: ({ currentAdmin }) => !!currentAdmin,
        before: async (request, context) => {
          const { currentAdmin, record } = context;

          // Если поля нет — возвращаем как есть
          if (!request.payload?.password) return request;

          // Если редактирует СВОЙ пароль
          if (record?.params?.email === currentAdmin.email) {
            const hashed = await bcrypt.hash(request.payload.password, 10);
            request.payload = {
              ...request.payload,
              password: hashed,
            };
          } else {
            // Чужой пароль? Удаляем его из запроса
            delete request.payload.password;
          }

          return request;
        },
      },
    },
  },
});
