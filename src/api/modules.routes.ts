import { Router } from 'express';
import * as ModuleController from '../controllers/modules.controller.js';

const router = Router();

router.get('/', ModuleController.getModules);

export default router;
