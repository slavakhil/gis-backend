import AdminJS from "adminjs";
import * as AdminJSMikroORM from "@adminjs/mikroorm";
import AdminJSExpress from "@adminjs/express";
import bcrypt from "bcrypt";
import session from "express-session";
import { locale } from "./locale/index.js";
import { User } from "../entities/user.entity.js";
import { componentLoader } from "./components.bundler.js";
import getModuleResource from "./resources/module.resource.js";
import getNewsResource from "./resources/news.resource.js";
import getTeamResource from "./resources/team.resource.js";
import getUserResource from "./resources/user.resource.js";
import getFileResource from "./resources/file.resource.js";
AdminJS.registerAdapter({
    Resource: AdminJSMikroORM.Resource,
    Database: AdminJSMikroORM.Database,
});
export const createAdminPanel = async (orm) => {
    const admin = new AdminJS({
        rootPath: "/admin",
        databases: [orm],
        locale,
        componentLoader,
        branding: {
            logo: "",
            companyName: "Панель администратора",
            withMadeWithLove: false,
        },
        resources: [
            getNewsResource(orm),
            getTeamResource(orm),
            getUserResource(orm),
            getFileResource(orm),
            getModuleResource(orm),
        ],
    });
    const em = orm.em.fork();
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
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
    }, null, {
        store: new session.MemoryStore(),
        secret: "session-secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 8,
        },
    });
    return { admin, adminRouter };
};
