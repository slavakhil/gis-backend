import { Request, Response } from 'express';
import { TeamMember } from '../entities/team.entity.js';

export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await req.em.find(TeamMember, {}, { orderBy: { id: 'ASC' } });
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};
