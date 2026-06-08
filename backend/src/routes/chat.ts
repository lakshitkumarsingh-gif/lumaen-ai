import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import aiRouter from '../services/aiRouter';
import MessageModel from '../models/Message';
import MemoryModel from '../models/Memory';
import UserModel from '../models/User';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Send message and get AI response
router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Message and user ID required' });
    }

    // Get user for plan validation
    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check plan limitations
    if (user.plan === 'free' && user.credits < 10) {
      return res.status(429).json({ error: 'Not enough credits. Please upgrade.' });
    }

    // Store user message
    await MessageModel.createMessage(userId, message, 'user', 'gpt', 0);

    // Get conversation history
    const history = await MessageModel.getUserMessages(userId, 10);
    const formattedHistory = history.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Route and get AI response
    const aiResponse = await aiRouter.handleQuery(message, formattedHistory);

    // Deduct credits
    await UserModel.deductCredits(userId, Math.ceil(aiResponse.tokens / 10));

    // Store assistant message
    const storedMessage = await MessageModel.createMessage(
      userId,
      aiResponse.content,
      'assistant',
      aiResponse.model,
      aiResponse.tokens
    );

    // Create or update memory
    const memory = await MemoryModel.createMemory(
      userId,
      `Q: ${message}\nA: ${aiResponse.content}`,
      7
    );

    res.json({
      id: storedMessage.id,
      response: aiResponse.content,
      model: aiResponse.model,
      tokensUsed: aiResponse.tokens,
      creditsRemaining: user.credits - Math.ceil(aiResponse.tokens / 10),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history
router.get('/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const messages = await MessageModel.getUserMessages(userId);
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
