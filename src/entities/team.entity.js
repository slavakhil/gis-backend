export const TeamMember = {
  name: "TeamMember",
  tableName: "team_members",
  properties: {
    id: {
      primary: true,
      type: "number",
      autoincrement: true,
    },
    position: {
      type: "text",
      fieldName: "position",
    },
    lastName: {
      type: "text",
      fieldName: "last_name",
    },
    firstName: {
      type: "text",
      fieldName: "first_name",
    },
    patronymic: {
      type: "text",
      fieldName: "patronymic",
    },
    email: {
      type: "text",
      fieldName: "email",
    },
  },
};
