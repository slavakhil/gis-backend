import { Request, Response } from 'express';
import { News } from 'src/entities/news.entity.js';

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await req.em.find(News, {}, { orderBy: { date: 'DESC' } });
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};
