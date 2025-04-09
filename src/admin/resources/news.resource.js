import { News } from "../../entities/news.entity.js";

export default (orm) => ({
  resource: { model: News, orm },
  options: {
    id: "Новости",
    name: "News",
    icon: "Users",
    parent: null,

    actions: {
      list: { isAccessible: () => true },
      show: { isAccessible: () => true },
      new: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
      delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.isAdmin },
    },
  },
});
