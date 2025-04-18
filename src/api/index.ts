import { Router } from 'express';
import newsRoutes from './news.routes.js';
import moduleRoutes from './modules.routes.js';
import teamRoutes from './team.routes.js';
import fileRoutes from './file.routes.js';

const router = Router();

router.use('/news', newsRoutes);
router.use('/modules', moduleRoutes);
router.use('/team', teamRoutes);
router.use('/file', fileRoutes);

export default router;
