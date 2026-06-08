import axios from 'axios';
import AIRouter from './aiRouter';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface ResearchResult {
  query: string;
  summary: string;
  sources: SearchResult[];
  keyInsights: string[];
  relatedTopics: string[];
}

export class DeepResearch {
  private aiRouter = AIRouter;

  /**
   * Perform deep research using multiple sources and AI analysis
   */
  async research(query: string): Promise<ResearchResult> {
    try {
      // Step 1: Search for information
      const searchResults = await this.searchWeb(query);

      // Step 2: Extract and summarize content
      const sources = searchResults.slice(0, 5);
      const combinedContent = sources
        .map(r => `${r.title}:\n${r.snippet}`)
        .join('\n\n');

      // Step 3: Use Gemini for deep analysis
      const analysisPrompt = `Analyze the following search results about "${query}" and provide:
1. A comprehensive summary
2. Key insights (list 3-5 important findings)
3. Related topics to explore

Search Results:\n${combinedContent}`;

      const analysis = await this.aiRouter.callGemini(analysisPrompt);

      // Step 4: Extract insights and topics
      const keyInsights = this.extractKeyPoints(analysis.content);
      const relatedTopics = this.extractRelatedTopics(analysis.content);

      return {
        query,
        summary: analysis.content,
        sources,
        keyInsights,
        relatedTopics,
      };
    } catch (error) {
      console.error('Deep research error:', error);
      throw error;
    }
  }

  /**
   * Search the web (using SerpAPI or similar)
   */
  private async searchWeb(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          q: query,
          api_key: process.env.SERPAPI_KEY,
          num: 10,
        },
      });

      return response.data.organic_results.map((result: any) => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet,
      }));
    } catch (error) {
      console.error('Web search error:', error);
      // Fallback: return mock results
      return [
        {
          title: 'Research Guide',
          url: 'https://example.com',
          snippet: 'Comprehensive guide on the topic',
        },
      ];
    }
  }

  /**
   * Extract key points from analysis
   */
  private extractKeyPoints(content: string): string[] {
    // Simple extraction: look for numbered lists or bullet points
    const lines = content.split('\n');
    return lines
      .filter(line => /^\d+\.|^[-•*]/.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s|^[-•*]\s/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5);
  }

  /**
   * Extract related topics
   */
  private extractRelatedTopics(content: string): string[] {
    // Simple extraction: look for "related" section
    const relatedSection = content.match(/related\s*topics?[:\n]([^\n]*)/i);
    if (relatedSection && relatedSection[1]) {
      return relatedSection[1]
        .split(/,|;|\sand\s/)
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .slice(0, 5);
    }
    return [];
  }

  /**
   * Comparative research: compare two topics
   */
  async compareTopics(topic1: string, topic2: string): Promise<any> {
    try {
      const research1 = await this.research(topic1);
      const research2 = await this.research(topic2);

      const comparisonPrompt = `Compare and contrast "${topic1}" and "${topic2}":

${topic1}:\n${research1.summary}

${topic2}:\n${research2.summary}

Provide similarities, differences, and use cases.`;

      const comparison = await this.aiRouter.callGemini(comparisonPrompt);

      return {
        topic1,
        topic2,
        comparison: comparison.content,
        research1,
        research2,
      };
    } catch (error) {
      console.error('Comparison error:', error);
      throw error;
    }
  }
}

export default new DeepResearch();
