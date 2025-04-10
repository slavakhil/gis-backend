import { ResourceWithOptions } from "adminjs";
import { EntityManager } from "@mikro-orm/core";
import { News } from "../../entities/news.entity.js";

const getNewsResource = (orm: EntityManager): ResourceWithOptions => ({
  resource: { model: News, orm },
  options: {
    id: "Новости",
    parent: null,
    listProperties: ["author", "content", "date", "createdAt"],
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

export default getNewsResource;
