import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface User {
  id: string;
  google_id: string;
  email: string;
  first_name: string;
  last_name?: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'premium' | 'infinity';
  credits: number;
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  async createUser(googleId: string, email: string, firstName: string, lastName: string, avatar: string): Promise<User> {
    const query = `
      INSERT INTO users (google_id, email, first_name, last_name, avatar, plan, credits)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const result = await pool.query(query, [googleId, email, firstName, lastName, avatar, 'free', 100]);
    return result.rows[0];
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE google_id = $1';
    const result = await pool.query(query, [googleId]);
    return result.rows[0] || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async updatePlan(userId: string, plan: 'free' | 'pro' | 'premium' | 'infinity', stripeCustomerId: string): Promise<User> {
    const query = `
      UPDATE users
      SET plan = $1, stripe_customer_id = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const result = await pool.query(query, [plan, stripeCustomerId, userId]);
    return result.rows[0];
  }

  async deductCredits(userId: string, credits: number): Promise<void> {
    const query = 'UPDATE users SET credits = credits - $1 WHERE id = $2';
    await pool.query(query, [credits, userId]);
  }
}

export default new UserModel();
