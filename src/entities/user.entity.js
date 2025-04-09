export const User = {
  name: "User",
  tableName: "users",
  properties: {
    id: {
      primary: true,
      type: "number",
      autoincrement: true,
    },
    email: {
      type: "text",
      unique: true,
    },
    password: {
      type: "text",
    },
    isAdmin: {
      type: "boolean",
      default: false,
      fieldName: "is_admin",
    },
    createdAt: {
      type: "Date",
      fieldName: "created_at",
      defaultRaw: "now()",
    },
    updatedAt: {
      type: "Date",
      fieldName: "updated_at",
      defaultRaw: "now()",
      onUpdate: () => new Date(),
    },
  },
};
