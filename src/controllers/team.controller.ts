import { Request, Response } from 'express';
import { TeamMember } from '../entities/team.entity.js';

export const getTeam = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const team = await req.em.find(TeamMember, {}, { orderBy: { id: 'ASC' }, offset, limit });
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};
