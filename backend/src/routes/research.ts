import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import deepResearch from '../services/deepResearch';
import MemoryModel from '../models/Memory';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Perform deep research
router.post('/research', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    const userId = req.user?.id;

    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }

    // Perform research
    const result = await deepResearch.research(query);

    // Store in memory for learning
    await MemoryModel.createMemory(
      userId,
      `Research: ${result.summary}`,
      9 // High importance for research
    );

    res.json(result);
  } catch (error) {
    console.error('Research error:', error);
    res.status(500).json({ error: 'Failed to perform research' });
  }
});

// Compare two topics
router.post('/compare', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { topic1, topic2 } = req.body;
    const userId = req.user?.id;

    if (!topic1 || !topic2) {
      return res.status(400).json({ error: 'Both topics required' });
    }

    const result = await deepResearch.compareTopics(topic1, topic2);

    // Store comparison in memory
    await MemoryModel.createMemory(
      userId,
      `Comparison: ${topic1} vs ${topic2}\n${result.comparison}`,
      8
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare topics' });
  }
});

export default router;
