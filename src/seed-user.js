import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./configs/mikro-orm.config.js";
import { User } from "./entities/user.entity.js";
import bcrypt from "bcrypt";

const createAdminUser = async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);
    const em = orm.em.fork();

    const existing = await em.findOne(User, { email: "admin@example.com" });
    if (existing) {
      console.log("👤 Пользователь уже существует");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const user = em.create(User, {
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true, // 👈 Делаем пользователя админом
    });

    await em.persistAndFlush(user);
    console.log("✅ Админ-пользователь создан");
  } catch (error) {
    console.error("❌ Ошибка при создании пользователя:", error);
  }
};

createAdminUser();
