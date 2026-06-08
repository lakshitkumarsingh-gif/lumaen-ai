import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Memory {
  id: string;
  user_id: string;
  content: string;
  importance_score: number;
  relationships: string[];
  created_at: Date;
  updated_at: Date;
}

export class MemoryModel {
  async createMemory(userId: string, content: string, importanceScore: number = 5): Promise<Memory> {
    const query = `
      INSERT INTO memories (user_id, content, importance_score)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, content, importanceScore]);
    return result.rows[0];
  }

  async getUserMemories(userId: string, limit = 100): Promise<Memory[]> {
    const query = `
      SELECT * FROM memories
      WHERE user_id = $1
      ORDER BY importance_score DESC, created_at DESC
      LIMIT $2;
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  async updateImportanceScore(memoryId: string, score: number): Promise<Memory> {
    const query = `
      UPDATE memories
      SET importance_score = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [score, memoryId]);
    return result.rows[0];
  }

  async linkMemories(memoryId1: string, memoryId2: string): Promise<void> {
    const query = `
      INSERT INTO memory_relationships (memory_id_1, memory_id_2)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;
    await pool.query(query, [memoryId1, memoryId2]);
  }
}

export default new MemoryModel();
