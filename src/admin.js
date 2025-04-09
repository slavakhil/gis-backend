import bcrypt from "bcrypt";

/** AdminJS ресурс для User */
const UserResource = {
  resource: { model: User, orm },
  options: {
    properties: {
      password: {
        type: "password",
        isVisible: {
          list: false,
          filter: false,
          show: false,
          edit: true,
        },
      },
    },
    actions: {
      new: {
        before: async (request) => {
          if (request.payload?.password) {
            request.payload.password = await bcrypt.hash(
              request.payload.password,
              10
            );
          }
          return request;
        },
      },
      edit: {
        before: async (request) => {
          // Только если пароль изменяется — хешируем
          if (request.payload?.password) {
            request.payload.password = await bcrypt.hash(
              request.payload.password,
              10
            );
          } else {
            // если не передан — удаляем, чтобы не затереть пустым
            delete request.payload.password;
          }
          return request;
        },
      },
    },
  },
};

export default UserResource;
