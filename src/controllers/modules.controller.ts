import { Request, Response } from 'express';
import { Module } from '../entities/module.entity.js';

export const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await req.em.find(Module, {}, { orderBy: { id: 'ASC' } });
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules: ', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};
