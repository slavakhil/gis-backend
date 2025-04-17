import { Router } from 'express';
import * as NewsController from '../controllers/news.controller.js';

const router = Router();

router.get('/', NewsController.getAllNews);

export default router;
