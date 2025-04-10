import { defineConfig } from "@mikro-orm/postgresql";
import { User } from "../entities/user.entity.js";
import { News } from "../entities/news.entity.js";
import { TeamMember } from "../entities/team.entity.js";
import { Module } from "../entities/module.entity.js";
import { File } from "../entities/file.entity.js";
const config = defineConfig({
    host: "localhost",
    port: 5432,
    dbName: "root",
    user: "root",
    password: "admin",
    entities: [User, News, TeamMember, Module, File],
    entitiesTs: ["./src/entities/*.entity.ts"],
    debug: true,
});
export default config;
