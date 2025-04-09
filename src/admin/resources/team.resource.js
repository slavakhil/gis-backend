import { TeamMember } from "../../entities/team.entity.js";

export default (orm) => ({
  resource: { model: TeamMember, orm },
  options: {
    id: "Команда",
    name: "TeamMember",
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
