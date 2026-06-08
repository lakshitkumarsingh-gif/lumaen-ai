import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes (will be implemented)
app.get('/api/user', (req, res) => {
  res.json({ message: 'User endpoint' });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    response: `Echo: ${message}`,
    model: 'gpt',
    timestamp: new Date(),
  });
});

app.get('/api/memories', (req, res) => {
  res.json({
    memories: [],
    total: 0,
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LUMAEN Backend running on http://localhost:${PORT}`);
});
