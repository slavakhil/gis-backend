import { Request, Response } from 'express';
import { News } from '../entities/news.entity.js';
import { getMoscowDate } from '../utils/date.js';

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const now = getMoscowDate();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const news = await req.em.find(
      News,
      { date: { $lte: now } },
      {
        orderBy: { date: 'DESC' },
        offset,
        limit,
      }
    );

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};
