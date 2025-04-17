import { Router } from 'express';
import * as TeamController from '../controllers/team.controller.js';

const router = Router();

router.get('/', TeamController.getTeam);

export default router;
