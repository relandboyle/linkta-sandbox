import express from 'express';
import type { Request, Response } from 'express';
import genAIController from '@/server/controllers/genAiController';
import { getLogger } from 'log4js';
const router = express.Router();

const logger = getLogger('[Linkta GenAI Router]')

// default route for testing. This route should be removed in production.
router.get('/', (_: Request, res: Response) => {
  res.send({ message: 'Hello from the AI!' });
});

/**
 * Ask the AI to generate a tree.
 */
router.post('/query', genAIController.generateTree, (req: Request, res: Response) => {
  logger.info('Request Body:', req.body);
  res.send({ message: 'tree', response: res.locals.tree });
});

export default router;
