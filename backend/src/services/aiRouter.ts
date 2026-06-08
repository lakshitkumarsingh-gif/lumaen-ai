import axios from 'axios';

interface AIResponse {
  content: string;
  model: 'gpt' | 'claude' | 'gemini';
  tokens: number;
}

export class AIRouter {
  private openaiKey = process.env.OPENAI_API_KEY;
  private anthropicKey = process.env.ANTHROPIC_API_KEY;
  private geminiKey = process.env.GEMINI_API_KEY;

  /**
   * Route query to best AI model based on content
   */
  routeToModel(query: string): 'gpt' | 'claude' | 'gemini' {
    const lowerQuery = query.toLowerCase();

    // Coding/Technical → GPT
    if (
      lowerQuery.includes('code') ||
      lowerQuery.includes('javascript') ||
      lowerQuery.includes('python') ||
      lowerQuery.includes('debug') ||
      lowerQuery.includes('api') ||
      lowerQuery.includes('algorithm')
    ) {
      return 'gpt';
    }

    // Writing/Creative → Claude
    if (
      lowerQuery.includes('write') ||
      lowerQuery.includes('essay') ||
      lowerQuery.includes('article') ||
      lowerQuery.includes('story') ||
      lowerQuery.includes('poem') ||
      lowerQuery.includes('email')
    ) {
      return 'claude';
    }

    // Research/Search → Gemini
    if (
      lowerQuery.includes('search') ||
      lowerQuery.includes('research') ||
      lowerQuery.includes('find') ||
      lowerQuery.includes('information') ||
      lowerQuery.includes('analyze')
    ) {
      return 'gemini';
    }

    return 'gpt'; // Default
  }

  /**
   * Call OpenAI GPT API
   */
  async callGPT(message: string, conversationHistory: any[] = []): Promise<AIResponse> {
    if (!this.openaiKey) throw new Error('OpenAI API key not configured');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            ...conversationHistory,
            { role: 'user', content: message },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.choices[0].message.content,
        model: 'gpt',
        tokens: response.data.usage.total_tokens,
      };
    } catch (error) {
      console.error('GPT API Error:', error);
      throw error;
    }
  }

  /**
   * Call Anthropic Claude API
   */
  async callClaude(message: string, conversationHistory: any[] = []): Promise<AIResponse> {
    if (!this.anthropicKey) throw new Error('Anthropic API key not configured');

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-opus-20240229',
          max_tokens: 2000,
          system: 'You are a helpful AI assistant that specializes in writing and creative content.',
          messages: [
            ...conversationHistory,
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            'x-api-key': this.anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.content[0].text,
        model: 'claude',
        tokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  /**
   * Call Google Gemini API
   */
  async callGemini(message: string, conversationHistory: any[] = []): Promise<AIResponse> {
    if (!this.geminiKey) throw new Error('Gemini API key not configured');

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.geminiKey}`,
        {
          contents: [
            ...conversationHistory.map((msg: any) => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }],
            })),
            {
              role: 'user',
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7,
          },
        }
      );

      return {
        content: response.data.candidates[0].content.parts[0].text,
        model: 'gemini',
        tokens: response.data.usageMetadata.totalTokenCount,
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  /**
   * Main method: Route and call appropriate AI
   */
  async handleQuery(message: string, conversationHistory: any[] = []): Promise<AIResponse> {
    const model = this.routeToModel(message);

    switch (model) {
      case 'gpt':
        return this.callGPT(message, conversationHistory);
      case 'claude':
        return this.callClaude(message, conversationHistory);
      case 'gemini':
        return this.callGemini(message, conversationHistory);
      default:
        throw new Error('Unknown model');
    }
  }
}

export default new AIRouter();
