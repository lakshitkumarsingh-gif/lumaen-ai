import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Message {
  id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  model: 'gpt' | 'claude' | 'gemini';
  tokens_used: number;
  created_at: Date;
}

export class MessageModel {
  async createMessage(userId: string, content: string, role: 'user' | 'assistant', model: 'gpt' | 'claude' | 'gemini', tokensUsed: number): Promise<Message> {
    const query = `
      INSERT INTO messages (user_id, content, role, model, tokens_used)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, content, role, model, tokensUsed]);
    return result.rows[0];
  }

  async getUserMessages(userId: string, limit = 50): Promise<Message[]> {
    const query = `
      SELECT * FROM messages
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2;
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows.reverse();
  }
}

export default new MessageModel();
