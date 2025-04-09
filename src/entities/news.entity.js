export const News = {
  name: "News",
  tableName: "news",
  properties: {
    id: {
      primary: true,
      type: "number",
      autoincrement: true,
    },
    date: {
      type: "Date",
      fieldName: "date",
    },
    content: {
      type: "text",
      fieldName: "content",
    },
    author: {
      type: "text",
      fieldName: "author",
    },
  },
};
