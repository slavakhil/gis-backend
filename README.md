import { ResourceWithOptions } from "adminjs";
import { TeamMember } from "../../entities/team.entity.js";
import { File } from "../../entities/file.entity.js";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import AdminJS from "adminjs";

const uploadDir = path.resolve("uploads");

const getTeamResource = (orm): ResourceWithOptions => ({
  resource: { model: TeamMember, orm },
  options: {
    id: "Команда",
    listProperties: ["fullName", "position", "photo", "createdAt"],
    properties: {
      photo: {
        components: {
          edit: AdminJS.bundle("../components/file-upload.tsx"),
        },
      },
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
        before: async (request, context) => {
          const { photo, ...otherParams } = request.payload ?? {};

          if (photo && photo.name && photo.type && photo.data) {
            const buffer = Buffer.from(photo.data, "base64");
            const fileName = `${uuid()}-${photo.name}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, buffer);

            const file = orm.em.create(File, {
              filename: fileName,
              mimetype: photo.type,
              path: filePath,
            });

            await orm.em.persistAndFlush(file);

            request.payload = {
              ...otherParams,
              photo: file.id,
            };
          }

          return request;
        },
      },
      edit: {
        isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
        before: async (request, context) => {
          const { photo, ...otherParams } = request.payload ?? {};

          if (photo && photo.name && photo.type && photo.data) {
            const buffer = Buffer.from(photo.data, "base64");
            const fileName = `${uuid()}-${photo.name}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, buffer);

            const file = orm.em.create(File, {
              filename: fileName,
              mimetype: photo.type,
              path: filePath,
            });

            await orm.em.persistAndFlush(file);

            request.payload = {
              ...otherParams,
              photo: file.id,
            };
          }

          return request;
        },
      },
      delete: {
        isAccessible: ({ currentAdmin }) => Boolean(currentAdmin?.isAdmin),
      },
      list: {
        isAccessible: () => true,
      },
      show: {
        isAccessible: () => true,
      },
    },
  },
});

export default getTeamResource;
