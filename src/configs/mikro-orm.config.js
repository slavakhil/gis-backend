import { defineConfig } from "@mikro-orm/postgresql";
import { EntitySchema } from "@mikro-orm/core";
import { User } from "../entities/user.entity.js";
import { News } from "../entities/news.entity.js";
import { TeamMember } from "../entities/team.entity.js";
import { Module } from "../entities/module.entity.js";

const config = defineConfig({
  host: "localhost",
  port: 5432,
  dbName: "root",
  user: "root",
  password: "admin",
  entities: [
    new EntitySchema(User),
    new EntitySchema(News),
    new EntitySchema(TeamMember),
    new EntitySchema(Module),
  ],
  debug: true,
});

export default config;
