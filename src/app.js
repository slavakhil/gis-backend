import express from 'express';
import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfig from './configs/mikro-orm.config.js';
import { createAdminPanel } from './admin/admin.js';

const start = async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getSchemaGenerator().updateSchema();

    const app = express();
    app.use('/uploads', express.static('public/uploads'));

    const { admin, adminRouter } = await createAdminPanel(orm);
    app.use(admin.options.rootPath, adminRouter);

    app.listen(3000, () => {
      console.log('✅ AdminJS запущен: http://localhost:3000/admin');
    });
  } catch (error) {
    console.error('❌ Ошибка при запуске:', error);
  }
};

start();
