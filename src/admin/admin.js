import AdminJS from "adminjs";
import * as AdminJSMikroORM from "@adminjs/mikroorm";
import AdminJSExpress from "@adminjs/express";
import bcrypt from "bcrypt";
import session from "express-session";

// Ресурсы
import userResource from "./resources/user.resource.js";
import newsResource from "./resources/news.resource.js";
import teamResource from "./resources/team.resource.js";
import moduleResource from "./resources/module.resource.js";

import { User } from "../entities/user.entity.js";
import ruLocale from "./locales/ru.js";
import { componentLoader } from "./components.bundler.js";

AdminJS.registerAdapter({
  Resource: AdminJSMikroORM.Resource,
  Database: AdminJSMikroORM.Database,
});

export const createAdminPanel = async (orm) => {
  const admin = new AdminJS({
    rootPath: "/admin",
    databases: [orm],
    componentLoader,
    branding: {
      logo: "",
      companyName: "Панель администратора",
      softwareBrothers: false,
      withMadeWithLove: false,
    },
    locale: ruLocale,

    resources: [
      userResource(orm),
      newsResource(orm),
      teamResource(orm),
      moduleResource(orm),
    ],
  });

  const em = orm.em.fork();

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        const user = await em.findOne(User, { email });
        if (user && (await bcrypt.compare(password, user.password))) {
          return {
            email: user.email,
            isAdmin: user.isAdmin,
          };
        }
        return null;
      },
      cookiePassword: "session-secret",
      cookieName: "adminjs",
    },
    null,
    {
      store: new session.MemoryStore(), // можно подключить Redis или другое хранилище
      secret: "session-secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 8, // 8 часов
      },
    }
  );

  return { admin, adminRouter };
};
