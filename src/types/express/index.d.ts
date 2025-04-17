import { EntityManager } from '@mikro-orm/postgresql';

declare global {
  namespace Express {
    interface Request {
      em: EntityManager;
    }
  }
}
