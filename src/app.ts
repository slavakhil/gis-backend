import "reflect-metadata";
import express from "express";
import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./configs/mikro-orm.config.js";
import { createAdminPanel } from "./admin/admin.js";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);

  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  const app = express();
  app.use(express.json());
  app.use("/public", express.static("public"));
  const { admin, adminRouter } = await createAdminPanel(orm);
  app.use(admin.options.rootPath, adminRouter);

  app.listen(3000, () => {
    console.log("✅ AdminJS запущен: http://localhost:3000/admin");
  });
};

main().catch((error) => console.error(error));
